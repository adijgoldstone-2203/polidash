import { Poll, BLOCS } from '../polls';

/**
 * Compute a recency-weighted average of all polls.
 * More recent polls carry higher weight: weight = 1 / (daysSincePoll + 1)
 */
export const computeWeightedAverage = (polls: Poll[]): Record<string, number> => {
  if (polls.length === 0) return {};

  const sorted = [...polls].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
  const mostRecentDate = new Date(sorted[0].dateISO);

  // Collect all party names across all polls
  const allParties = new Set<string>();
  polls.forEach(p => Object.keys(p.data).forEach(party => allParties.add(party)));

  const result: Record<string, number> = {};

  allParties.forEach(party => {
    let weightedSum = 0;
    let totalWeight = 0;
    const sourceCountForParty = new Map<string, number>();

    sorted.forEach(poll => {
      const seats = poll.data[party] || 0;
      
      const sourceChannel = poll.source.split(' (')[0];
      const currentCount = sourceCountForParty.get(sourceChannel) || 0;
      sourceCountForParty.set(sourceChannel, currentCount + 1);

      const pollDate = new Date(poll.dateISO);
      const daysDiff = Math.max(0, (mostRecentDate.getTime() - pollDate.getTime()) / (1000 * 60 * 60 * 24));
      
      let weight = 0;
      if (daysDiff > 30) {
        weight = 0; // Over a month old gets 0% weight
      } else if (currentCount === 0) {
        weight = 1.0; // 1st most recent gets 100%
      } else if (currentCount === 1) {
        weight = 0.05; // 2nd most recent gets 5%
      } else {
        weight = 0; // 3rd most recent or older gets 0%
      }

      // Penalty: Any poll over 2 weeks old gets its weight cut by 50%
      if (weight > 0 && daysDiff > 14) {
        weight *= 0.5;
      }

      weightedSum += seats * weight;
      totalWeight += weight;
    });

    if (totalWeight > 0) {
      result[party] = Math.round(weightedSum / totalWeight * 10) / 10;
    }
  });

  return result;
};

/**
 * Compute a simple arithmetic average across all polls.
 */
export const computeSimpleAverage = (polls: Poll[]): Record<string, number> => {
  if (polls.length === 0) return {};

  const allParties = new Set<string>();
  polls.forEach(p => Object.keys(p.data).forEach(party => allParties.add(party)));

  const result: Record<string, number> = {};

  allParties.forEach(party => {
    let sum = 0;
    let count = 0;

    polls.forEach(poll => {
      const seats = poll.data[party];
      if (seats !== undefined) {
        sum += seats;
        count++;
      }
    });

    if (count > 0) {
      result[party] = Math.round(sum / count * 10) / 10;
    }
  });

  return result;
};

/**
 * Compute trend direction for a party: compare last 30 days average to prior 30 days.
 */
export const computeTrend = (polls: Poll[], party: string): 'up' | 'down' | 'stable' => {
  if (polls.length < 4) return 'stable';

  const sorted = [...polls].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
  const mostRecentDate = new Date(sorted[0].dateISO);

  const recentPolls: number[] = [];
  const olderPolls: number[] = [];

  sorted.forEach(poll => {
    const seats = poll.data[party];
    if (seats === undefined) return;
    const daysDiff = (mostRecentDate.getTime() - new Date(poll.dateISO).getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff <= 30) {
      recentPolls.push(seats);
    } else if (daysDiff <= 90) {
      olderPolls.push(seats);
    }
  });

  if (recentPolls.length === 0 || olderPolls.length === 0) return 'stable';

  const recentAvg = recentPolls.reduce((a, b) => a + b, 0) / recentPolls.length;
  const olderAvg = olderPolls.reduce((a, b) => a + b, 0) / olderPolls.length;

  const diff = recentAvg - olderAvg;
  if (diff > 1.5) return 'up';
  if (diff < -1.5) return 'down';
  return 'stable';
};

/**
 * Transform poll data into Recharts-compatible time-series format.
 * Returns array sorted chronologically: [{ date: "2025-11-27", "Likud": 25, "Shas": 10, ... }]
 */
export const getTimeSeriesData = (polls: Poll[]): Record<string, string | number>[] => {
  const sorted = [...polls].sort((a, b) => a.dateISO.localeCompare(b.dateISO));

  return sorted.map(poll => {
    const entry: Record<string, string | number> = {
      date: poll.dateISO,
      timestamp: new Date(poll.dateISO).getTime(),
      displayDate: poll.date,
      source: poll.source,
    };
    Object.entries(poll.data).forEach(([party, seats]) => {
      entry[party] = seats;
    });
    return entry;
  });
};

/**
 * Compute a running weighted average over time.
 * For each poll date, calculates the weighted average of all polls up to that date.
 */
export const getRunningWeightedAverageData = (polls: Poll[]): Record<string, string | number>[] => {
  if (polls.length === 0) return [];
  
  const sorted = [...polls].sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  const allParties = new Set<string>();
  polls.forEach(p => Object.keys(p.data).forEach(party => allParties.add(party)));

  const uniqueDates = Array.from(new Set(sorted.map(p => p.dateISO)));

  return uniqueDates.map(dateISO => {
    const pollsOnDate = sorted.filter(p => p.dateISO === dateISO);
    const displayDate = pollsOnDate[0].date;

    const lastIndexForDate = sorted.map(p => p.dateISO).lastIndexOf(dateISO);
    const pollsUpToNow = sorted.slice(0, lastIndexForDate + 1);
    
    // Sort reverse chronological to use computeWeightedAverage's assumption that first is most recent
    const pollsUpToNowDesc = [...pollsUpToNow].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
    
    const runningAvg = computeWeightedAverage(pollsUpToNowDesc);

    const entry: Record<string, any> = {
      date: dateISO,
      timestamp: new Date(dateISO).getTime(),
      displayDate,
      source: `Running Avg (${pollsOnDate.length > 1 ? 'Multiple Polls' : pollsOnDate[0].source.split(' (')[0]})`,
      pollsOnDate: pollsOnDate.map(p => ({
        source: p.source.split(' (')[0],
        data: p.data,
        date: p.date,
        rawSource: p.source
      }))
    };

    allParties.forEach(party => {
      entry[party] = runningAvg[party] !== undefined ? runningAvg[party] : 0;
    });

    // Add raw poll seats with a prefix to be used for the scatter points
    pollsOnDate.forEach((p, index) => {
      Object.entries(p.data).forEach(([party, seats]) => {
        entry[`raw_${index}_${party}`] = seats;
      });
    });

    return entry;
  });
};


/**
 * Transform poll data into Recharts-compatible time-series format for a single poll source.
 * Shows the actual running number of that poll over time.
 */
export const getSinglePollTimeSeriesData = (polls: Poll[]): Record<string, string | number>[] => {
  const sorted = [...polls].sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  
  const allParties = new Set<string>();
  polls.forEach(p => Object.keys(p.data).forEach(party => allParties.add(party)));

  // Group polls by dateISO
  const uniqueDates = Array.from(new Set(sorted.map(p => p.dateISO)));

  return uniqueDates.map(dateISO => {
    const pollsOnDate = sorted.filter(p => p.dateISO === dateISO);
    const displayDate = pollsOnDate[0].date;
    
    // Average the seats for the trend line if there are multiple polls on the same date
    const avgData: Record<string, number> = {};
    const allPartiesOnDate = new Set<string>();
    pollsOnDate.forEach(p => Object.keys(p.data).forEach(party => allPartiesOnDate.add(party)));
    
    allPartiesOnDate.forEach(party => {
      let sum = 0;
      let count = 0;
      pollsOnDate.forEach(p => {
        if (p.data[party] !== undefined) {
          sum += p.data[party];
          count++;
        }
      });
      if (count > 0) {
        avgData[party] = Math.round((sum / count) * 10) / 10;
      }
    });

    const entry: Record<string, any> = {
      date: dateISO,
      timestamp: new Date(dateISO).getTime(),
      displayDate,
      source: pollsOnDate.length > 1 ? `${pollsOnDate[0].source.split(' (')[0]} (Multiple)` : pollsOnDate[0].source,
      rawSource: pollsOnDate.length > 1 ? `${pollsOnDate[0].source.split(' (')[0]} (Multiple)` : pollsOnDate[0].source,
      pollsOnDate: pollsOnDate.map(p => ({
        source: p.source.split(' (')[0],
        data: p.data,
        date: p.date,
        rawSource: p.source
      }))
    };

    // Add averaged line values
    allParties.forEach(party => {
      entry[party] = avgData[party] !== undefined ? avgData[party] : 0;
    });

    // Add raw values for each poll dot
    pollsOnDate.forEach((p, index) => {
      Object.entries(p.data).forEach(([party, seats]) => {
        entry[`raw_${index}_${party}`] = seats;
      });
    });

    return entry;
  });
};


/**
 * Compute bloc seat totals for each poll (for bloc trend chart).
 */
export const getBlocTimeSeriesData = (polls: Poll[]): Record<string, string | number>[] => {
  const sorted = [...polls].sort((a, b) => a.dateISO.localeCompare(b.dateISO));

  return sorted.map(poll => {
    const entry: Record<string, string | number> = {
      date: poll.dateISO,
      displayDate: poll.date,
      source: poll.source,
    };

    Object.entries(BLOCS).forEach(([blocName, parties]) => {
      let total = 0;
      parties.forEach(party => {
        total += poll.data[party] || 0;
      });
      entry[blocName] = total;
    });

    return entry;
  });
};

/**
 * Get all unique party names across all polls, sorted by their weighted average (descending).
 */
export const getAllParties = (polls: Poll[]): string[] => {
  const avg = computeWeightedAverage(polls);
  const parties = Object.keys(avg);
  return parties.sort((a, b) => (avg[b] || 0) - (avg[a] || 0));
};

/**
 * Get the latest poll from the data.
 */
export const getLatestPoll = (polls: Poll[]): Poll => {
  return [...polls].sort((a, b) => b.dateISO.localeCompare(a.dateISO))[0];
};
