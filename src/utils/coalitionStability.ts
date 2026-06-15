import { detectConflicts, Conflict } from './coalitionLogic';

/**
 * Symmetric pairwise compatibility matrix between political parties (0% to 100%).
 * Reflects political willingness to govern together, religious-secular dynamics,
 * Arab-Zionist relations, and personal vetoes.
 */
export const PARTY_COMPATIBILITY_MATRIX: Record<string, Record<string, number>> = {
  "Likud": {
    "Likud": 100,
    "Shas": 95,
    "United Torah Judaism": 95,
    "Otzma Yehudit": 90,
    "Religious Zionist": 90,
    "National Unity Party": 35, // Crisis / emergency only
    "Together (Bennett-Lapid)": 25,
    "Bennett 2026": 25,
    "Yesh Atid": 5, // Vetoed
    "Yisrael Beiteinu": 15, // High tension / veto
    "Democrats": 0,
    "United Arab List (Ra'am)": 20, // Taboo, historically discussed but far-right blocks it
    "United Arab Party": 20,
    "Hadash-Ta'al": 0,
    "Yashar!": 10,
    "HaMiluimnikim": 30,
    "Balad (National Democratic Alliance)": 0,
  },
  "Yesh Atid": {
    "Likud": 5,
    "Yesh Atid": 100,
    "National Unity Party": 90,
    "Together (Bennett-Lapid)": 85,
    "Bennett 2026": 80,
    "Yisrael Beiteinu": 85,
    "Democrats": 95,
    "Yashar!": 95,
    "HaMiluimnikim": 80,
    "Shas": 15, // Religious-secular divide
    "United Torah Judaism": 10,
    "Otzma Yehudit": 0,
    "Religious Zionist": 0,
    "United Arab List (Ra'am)": 65, // Co-existed in previous government
    "United Arab Party": 65,
    "Hadash-Ta'al": 20, // Outside support only
    "Balad (National Democratic Alliance)": 0,
  },
  "National Unity Party": {
    "Likud": 35,
    "Yesh Atid": 90,
    "National Unity Party": 100,
    "Together (Bennett-Lapid)": 85,
    "Bennett 2026": 80,
    "Yisrael Beiteinu": 80,
    "Democrats": 85,
    "Yashar!": 90,
    "HaMiluimnikim": 85,
    "Shas": 40, // Moderate Gantz-Haredi relations
    "United Torah Judaism": 45,
    "Otzma Yehudit": 5,
    "Religious Zionist": 10,
    "United Arab List (Ra'am)": 65,
    "United Arab Party": 65,
    "Hadash-Ta'al": 25,
    "Balad (National Democratic Alliance)": 0,
  },
  "Together (Bennett-Lapid)": {
    "Likud": 25,
    "Yesh Atid": 85,
    "National Unity Party": 85,
    "Together (Bennett-Lapid)": 100,
    "Bennett 2026": 95,
    "Yisrael Beiteinu": 85,
    "Democrats": 70,
    "Yashar!": 85,
    "HaMiluimnikim": 85,
    "Shas": 30,
    "United Torah Judaism": 30,
    "Otzma Yehudit": 5,
    "Religious Zionist": 10,
    "United Arab List (Ra'am)": 75, // Formed the initial coalition
    "United Arab Party": 75,
    "Hadash-Ta'al": 15,
    "Balad (National Democratic Alliance)": 0,
  },
  "Bennett 2026": {
    "Likud": 25,
    "Yesh Atid": 80,
    "National Unity Party": 80,
    "Together (Bennett-Lapid)": 95,
    "Bennett 2026": 100,
    "Yisrael Beiteinu": 85,
    "Democrats": 65,
    "Yashar!": 80,
    "HaMiluimnikim": 85,
    "Shas": 35,
    "United Torah Judaism": 35,
    "Otzma Yehudit": 5,
    "Religious Zionist": 15,
    "United Arab List (Ra'am)": 75,
    "United Arab Party": 75,
    "Hadash-Ta'al": 15,
    "Balad (National Democratic Alliance)": 0,
  },
  "Yisrael Beiteinu": {
    "Likud": 15,
    "Yesh Atid": 85,
    "National Unity Party": 80,
    "Together (Bennett-Lapid)": 85,
    "Bennett 2026": 85,
    "Yisrael Beiteinu": 100,
    "Democrats": 70,
    "Yashar!": 80,
    "HaMiluimnikim": 85,
    "Shas": 10, // Draft dispute
    "United Torah Judaism": 10, // Secularist veto
    "Otzma Yehudit": 5,
    "Religious Zionist": 10,
    "United Arab List (Ra'am)": 50, // Tension, but sat together
    "United Arab Party": 50,
    "Hadash-Ta'al": 0,
    "Balad (National Democratic Alliance)": 0,
  },
  "Democrats": {
    "Likud": 0,
    "Yesh Atid": 95,
    "National Unity Party": 85,
    "Together (Bennett-Lapid)": 70,
    "Bennett 2026": 65,
    "Yisrael Beiteinu": 70,
    "Democrats": 100,
    "Yashar!": 90,
    "HaMiluimnikim": 75,
    "Shas": 5,
    "United Torah Judaism": 5,
    "Otzma Yehudit": 0,
    "Religious Zionist": 0,
    "United Arab List (Ra'am)": 80,
    "United Arab Party": 80,
    "Hadash-Ta'al": 60, // Left-Arab alignment
    "Balad (National Democratic Alliance)": 15,
  },
  "Shas": {
    "Likud": 95,
    "Yesh Atid": 15,
    "National Unity Party": 40,
    "Together (Bennett-Lapid)": 30,
    "Bennett 2026": 35,
    "Yisrael Beiteinu": 10,
    "Democrats": 5,
    "Shas": 100,
    "United Torah Judaism": 95,
    "Otzma Yehudit": 75,
    "Religious Zionist": 80,
    "Yashar!": 25,
    "HaMiluimnikim": 35,
    "United Arab List (Ra'am)": 45, // Religious conservative overlap
    "United Arab Party": 45,
    "Hadash-Ta'al": 0,
    "Balad (National Democratic Alliance)": 0,
  },
  "United Torah Judaism": {
    "Likud": 95,
    "Yesh Atid": 10,
    "National Unity Party": 45,
    "Together (Bennett-Lapid)": 30,
    "Bennett 2026": 35,
    "Yisrael Beiteinu": 10,
    "Democrats": 5,
    "Shas": 95,
    "United Torah Judaism": 100,
    "Otzma Yehudit": 75,
    "Religious Zionist": 80,
    "Yashar!": 25,
    "HaMiluimnikim": 35,
    "United Arab List (Ra'am)": 45,
    "United Arab Party": 45,
    "Hadash-Ta'al": 0,
    "Balad (National Democratic Alliance)": 0,
  },
  "Otzma Yehudit": {
    "Likud": 90,
    "Yesh Atid": 0,
    "National Unity Party": 5,
    "Together (Bennett-Lapid)": 5,
    "Bennett 2026": 5,
    "Yisrael Beiteinu": 5,
    "Democrats": 0,
    "Shas": 75,
    "United Torah Judaism": 75,
    "Otzma Yehudit": 100,
    "Religious Zionist": 95,
    "Yashar!": 5,
    "HaMiluimnikim": 15,
    "United Arab List (Ra'am)": 0,
    "United Arab Party": 0,
    "Hadash-Ta'al": 0,
    "Balad (National Democratic Alliance)": 0,
  },
  "Religious Zionist": {
    "Likud": 90,
    "Yesh Atid": 0,
    "National Unity Party": 10,
    "Together (Bennett-Lapid)": 10,
    "Bennett 2026": 15,
    "Yisrael Beiteinu": 10,
    "Democrats": 0,
    "Shas": 80,
    "United Torah Judaism": 80,
    "Otzma Yehudit": 95,
    "Religious Zionist": 100,
    "Yashar!": 10,
    "HaMiluimnikim": 20,
    "United Arab List (Ra'am)": 0,
    "United Arab Party": 0,
    "Hadash-Ta'al": 0,
    "Balad (National Democratic Alliance)": 0,
  },
  "United Arab List (Ra'am)": {
    "Likud": 20,
    "Yesh Atid": 65,
    "National Unity Party": 65,
    "Together (Bennett-Lapid)": 75,
    "Bennett 2026": 75,
    "Yisrael Beiteinu": 50,
    "Democrats": 80,
    "Shas": 45,
    "United Torah Judaism": 45,
    "Otzma Yehudit": 0,
    "Religious Zionist": 0,
    "United Arab List (Ra'am)": 100,
    "United Arab Party": 30,
    "Hadash-Ta'al": 30, // Arab party rivalry
    "Yashar!": 65,
    "HaMiluimnikim": 50,
    "Balad (National Democratic Alliance)": 10,
  },
  "United Arab Party": {
    "Likud": 20,
    "Yesh Atid": 65,
    "National Unity Party": 65,
    "Together (Bennett-Lapid)": 75,
    "Bennett 2026": 75,
    "Yisrael Beiteinu": 50,
    "Democrats": 80,
    "Shas": 45,
    "United Torah Judaism": 45,
    "Otzma Yehudit": 0,
    "Religious Zionist": 0,
    "United Arab List (Ra'am)": 30,
    "United Arab Party": 100,
    "Hadash-Ta'al": 30,
    "Yashar!": 65,
    "HaMiluimnikim": 50,
    "Balad (National Democratic Alliance)": 10,
  },
  "Hadash-Ta'al": {
    "Likud": 0,
    "Yesh Atid": 20,
    "National Unity Party": 25,
    "Together (Bennett-Lapid)": 15,
    "Bennett 2026": 15,
    "Yisrael Beiteinu": 0,
    "Democrats": 60,
    "Shas": 0,
    "United Torah Judaism": 0,
    "Otzma Yehudit": 0,
    "Religious Zionist": 0,
    "United Arab List (Ra'am)": 30,
    "United Arab Party": 30,
    "Hadash-Ta'al": 100,
    "Yashar!": 20,
    "HaMiluimnikim": 10,
    "Balad (National Democratic Alliance)": 40,
  },
  "Yashar!": {
    "Likud": 10,
    "Yesh Atid": 95,
    "National Unity Party": 90,
    "Together (Bennett-Lapid)": 85,
    "Bennett 2026": 80,
    "Yisrael Beiteinu": 80,
    "Democrats": 90,
    "Shas": 25,
    "United Torah Judaism": 25,
    "Otzma Yehudit": 5,
    "Religious Zionist": 10,
    "United Arab List (Ra'am)": 65,
    "United Arab Party": 65,
    "Hadash-Ta'al": 20,
    "Yashar!": 100,
    "HaMiluimnikim": 85,
    "Balad (National Democratic Alliance)": 0,
  },
  "HaMiluimnikim": {
    "Likud": 30,
    "Yesh Atid": 80,
    "National Unity Party": 85,
    "Together (Bennett-Lapid)": 85,
    "Bennett 2026": 85,
    "Yisrael Beiteinu": 85,
    "Democrats": 75,
    "Shas": 35,
    "United Torah Judaism": 35,
    "Otzma Yehudit": 15,
    "Religious Zionist": 20,
    "United Arab List (Ra'am)": 50,
    "United Arab Party": 50,
    "Hadash-Ta'al": 10,
    "Yashar!": 85,
    "HaMiluimnikim": 100,
    "Balad (National Democratic Alliance)": 0,
  },
  "Balad (National Democratic Alliance)": {
    "Likud": 0,
    "Yesh Atid": 0,
    "National Unity Party": 0,
    "Together (Bennett-Lapid)": 0,
    "Bennett 2026": 0,
    "Yisrael Beiteinu": 0,
    "Democrats": 15,
    "Shas": 0,
    "United Torah Judaism": 0,
    "Otzma Yehudit": 0,
    "Religious Zionist": 0,
    "United Arab List (Ra'am)": 10,
    "United Arab Party": 10,
    "Hadash-Ta'al": 40,
    "Yashar!": 0,
    "HaMiluimnikim": 0,
    "Balad (National Democratic Alliance)": 100,
  }
};

export interface StabilityAnalysis {
  score: number; // 0 to 100
  cohesionScore: number; // 0 to 100
  conflictPenalty: number;
  majorityCushion: number;
  status: 'highly_cohesive' | 'stable' | 'moderate' | 'high_friction' | 'unstable';
  conflicts: Conflict[];
  vetoes: string[];
  allies: string[];
}

/**
 * Calculates the overall PoliDash Stability Score for a proposed coalition.
 * Combines average pairwise affinity, ideological conflicts, and majority cushions.
 */
export const analyzeCoalitionStability = (coalition: string[], coalitionSeats: number): StabilityAnalysis => {
  if (coalition.length === 0) {
    return {
      score: 0,
      cohesionScore: 0,
      conflictPenalty: 0,
      majorityCushion: 0,
      status: 'unstable',
      conflicts: [],
      vetoes: [],
      allies: []
    };
  }

  if (coalition.length === 1) {
    return {
      score: 100,
      cohesionScore: 100,
      conflictPenalty: 0,
      majorityCushion: 0,
      status: 'highly_cohesive',
      conflicts: [],
      vetoes: [],
      allies: []
    };
  }

  let totalCompat = 0;
  let pairsCount = 0;
  const alliesSet = new Set<string>();
  const vetoesSet = new Set<string>();

  // Calculate Conservative Pairwise Cohesion
  for (let i = 0; i < coalition.length; i++) {
    for (let j = i + 1; j < coalition.length; j++) {
      const p1 = coalition[i];
      const p2 = coalition[j];

      // Retrieve symmetric scores
      const c1 = PARTY_COMPATIBILITY_MATRIX[p1]?.[p2];
      const c2 = PARTY_COMPATIBILITY_MATRIX[p2]?.[p1];
      
      // Default to 40 if unspecified, otherwise use lower of the two directional vectors (conservative)
      const compat = (c1 !== undefined && c2 !== undefined) 
        ? Math.min(c1, c2) 
        : (c1 ?? c2 ?? 40);

      totalCompat += compat;
      pairsCount++;

      if (compat >= 80) {
        alliesSet.add(`${p1} & ${p2}`);
      } else if (compat <= 15) {
        vetoesSet.add(`${p1} vs ${p2}`);
      }
    }
  }

  const cohesionScore = pairsCount > 0 ? totalCompat / pairsCount : 50;

  // Stance Conflicts (detectConflicts)
  const conflicts = detectConflicts(coalition);
  const conflictPenalty = conflicts.length * 8; // Subtract 8 points per stance conflict

  // Majority Cushion Multipliers
  let majorityCushion = 0;
  if (coalitionSeats < 61) {
    majorityCushion = -25; // Minority government, highly vulnerable (penalty)
  } else if (coalitionSeats === 61) {
    majorityCushion = 2;   // Thin majority, small positive bonus for building coalition
  } else if (coalitionSeats > 61 && coalitionSeats <= 63) {
    majorityCushion = 6;   // Slim majority, medium positive bonus
  } else if (coalitionSeats >= 64 && coalitionSeats <= 67) {
    majorityCushion = 12;  // Healthy working majority bonus
  } else if (coalitionSeats >= 68) {
    majorityCushion = 18;  // Robust cushion bonus
  }

  // Calculate final PoliDash Stability Score
  let score = cohesionScore - conflictPenalty + majorityCushion;
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Stability Classification
  let status: StabilityAnalysis['status'] = 'moderate';
  if (score >= 85) status = 'highly_cohesive';
  else if (score >= 68) status = 'stable';
  else if (score >= 48) status = 'moderate';
  else if (score >= 28) status = 'high_friction';
  else status = 'unstable';

  return {
    score,
    cohesionScore: Math.round(cohesionScore),
    conflictPenalty,
    majorityCushion,
    status,
    conflicts,
    vetoes: Array.from(vetoesSet),
    allies: Array.from(alliesSet)
  };
};
