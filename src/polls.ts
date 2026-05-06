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
    source: "Channel 12 News",
    date: "April 28, 2026",
    sampleSize: 512,
    data: {
      "Likud": 22,
      "National Unity Party": 28,
      "Yesh Atid": 14,
      "Yisrael Beiteinu": 12,
      "Shas": 11,
      "United Torah Judaism": 7,
      "Otzma Yehudit": 9,
      "Religious Zionist": 4,
      "Democrats": 8,
      "Ra'am": 5,
    }
  },
  {
    id: "kan-11-april-2026",
    source: "Kan 11 Public Broadcast",
    date: "April 15, 2026",
    sampleSize: 620,
    data: {
      "Likud": 20,
      "National Unity Party": 30,
      "Yesh Atid": 15,
      "Yisrael Beiteinu": 11,
      "Shas": 10,
      "United Torah Judaism": 8,
      "Otzma Yehudit": 8,
      "Religious Zionist": 5,
      "Democrats": 8,
      "Ra'am": 5,
    }
  }
];

export const MAJORITY_THRESHOLD = 61;
export const TOTAL_SEATS = 120;
