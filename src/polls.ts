export interface Poll {
  id: string;
  source: string;
  date: string;
  sampleSize: number;
  data: Record<string, number>; // Party Name -> Seat Count
}

export const POLL_DATA: Poll[] = [
  {
    id: "channel-12-april-2026",
    source: "Channel 12 (Midgam)",
    date: "April 28, 2026",
    sampleSize: 500,
    data: {
      "Together (Bennett-Lapid)": 26,
      "Likud": 25,
      "National Unity Party": 12,
      "Shas": 10,
      "Yisrael Beiteinu": 10,
      "United Torah Judaism": 7,
      "Otzma Yehudit": 7,
      "Yashar!": 6,
      "Hadash": 5,
      "United Arab List (Ra'am)": 5,
      "Democrats": 4,
      "Religious Zionist": 3
    }
  },
  {
    id: "kan-11-april-2026",
    source: "Kan 11 (Kantar)",
    date: "April 27, 2026",
    sampleSize: 500,
    data: {
      "Likud": 26,
      "Together (Bennett-Lapid)": 24,
      "National Unity Party": 14,
      "Shas": 10,
      "Yisrael Beiteinu": 10,
      "Yashar!": 8,
      "United Torah Judaism": 8,
      "Otzma Yehudit": 6,
      "Democrats": 5,
      "Hadash": 5,
      "United Arab List (Ra'am)": 4,
      "Religious Zionist": 0
    }
  },
  {
    id: "maariv-april-2026",
    source: "Maariv (Lazar)",
    date: "April 26, 2026",
    sampleSize: 500,
    data: {
      "Together (Bennett-Lapid)": 27,
      "Likud": 24,
      "National Unity Party": 13,
      "Yisrael Beiteinu": 11,
      "Shas": 9,
      "United Torah Judaism": 7,
      "Otzma Yehudit": 7,
      "Democrats": 6,
      "Yashar!": 6,
      "Hadash": 5,
      "United Arab List (Ra'am)": 5,
      "Religious Zionist": 0
    }
  },
  {
    id: "channel-14-april-2026",
    source: "Channel 14 (Direct Polls)",
    date: "April 25, 2026",
    sampleSize: 500,
    data: {
      "Likud": 29,
      "Together (Bennett-Lapid)": 22,
      "National Unity Party": 11,
      "Shas": 10,
      "Yisrael Beiteinu": 9,
      "Otzma Yehudit": 9,
      "United Torah Judaism": 8,
      "Yashar!": 6,
      "Hadash": 6,
      "Religious Zionist": 5,
      "Democrats": 5,
      "United Arab List (Ra'am)": 0
    }
  }
];

export const MAJORITY_THRESHOLD = 61;
export const TOTAL_SEATS = 120;
