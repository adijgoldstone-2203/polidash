import { politicians } from '../data';

// Maps poll party names to their leading politicians for stance analysis
export const PARTY_LEADER_MAP: Record<string, string> = {
  "Likud": "benjamin-netanyahu",
  "National Unity Party": "benny-gantz",
  "Yesh Atid": "yair-lapid",
  "Together (Bennett-Lapid)": "naftali-bennett",
  "Yisrael Beiteinu": "avigdor-lieberman",
  "Shas": "aryeh-deri",
  "United Torah Judaism": "yitzhak-goldknopf",
  "Otzma Yehudit": "itamar-ben-gvir",
  "Religious Zionist": "bezalel-smotrich",
  "Hadash-Ta'al": "ayman-odeh",
  "Hadash": "ayman-odeh",
  "Ra'am": "mansour-abbas",
  "United Arab List (Ra'am)": "mansour-abbas",
  "Labor": "yair-golan",
  "Democrats": "yair-golan",
  "Yashar!": "gadi-eisenkot"
};

export interface Conflict {
  issue: string;
  parties: { name: string; stance: string }[];
  severity: 'high' | 'medium';
}

/**
 * Analyzes a proposed coalition for policy conflicts.
 * Flags issues where members have opposing (Support vs Oppose) stances.
 */
export const detectConflicts = (coalition: string[]): Conflict[] => {
  if (coalition.length < 2) return [];

  const conflicts: Conflict[] = [];
  const issues = Object.keys(politicians[0].stances);

  issues.forEach(issue => {
    const stancesFound: Record<string, string[]> = {
      'Support': [],
      'Oppose': [],
      'Ambiguous': []
    };

    coalition.forEach(partyName => {
      const leaderId = PARTY_LEADER_MAP[partyName];
      const leader = politicians.find(p => p.id === leaderId);
      
      if (leader) {
        const stance = leader.stances[issue];
        if (stance) {
          stancesFound[stance].push(partyName);
        }
      }
    });

    // A conflict exists if we have both Support and Oppose in the same coalition
    if (stancesFound['Support'].length > 0 && stancesFound['Oppose'].length > 0) {
      conflicts.push({
        issue,
        severity: 'high',
        parties: [
          ...stancesFound['Support'].map(p => ({ name: p, stance: 'Support' })),
          ...stancesFound['Oppose'].map(p => ({ name: p, stance: 'Oppose' }))
        ]
      });
    }
  });

  return conflicts;
};
