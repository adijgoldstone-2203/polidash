import React, { useState } from 'react';
import { AI_DISCLAIMER } from './data';

interface RaceCandidate {
  id: string;
  name: string;
  party: string;
  ballotLetters: string;
  imageUrl: string;
  role: string;
  keyStance: string;
  seats: string;
}

interface CabinetRace {
  id: string;
  title: string;
  description: string;
  candidates: RaceCandidate[];
}

const RACES_DATA: CabinetRace[] = [
  {
    id: "prime-minister",
    title: "The Race for Prime Minister",
    description: "The top executive role leading the 26th Knesset government and cabinet decisions.",
    candidates: [
      {
        id: "benjamin-netanyahu",
        name: "Benjamin Netanyahu",
        party: "Likud",
        ballotLetters: "מחל",
        imageUrl: "assets/politicians/benjamin-netanyahu.avif",
        role: "Incumbent Prime Minister",
        keyStance: "Security control over Gaza, Abraham Accords expansion, opposes Palestinian statehood.",
        seats: "24"
      },
      {
        id: "naftali-bennett",
        name: "Naftali Bennett",
        party: "Together",
        ballotLetters: "פה",
        imageUrl: "assets/politicians/naftali-bennett.avif",
        role: "Former Prime Minister",
        keyStance: "National unity coalition, high-tech economic growth, preemptive security doctrine.",
        seats: "12"
      },
      {
        id: "yair-lapid",
        name: "Yair Lapid",
        party: "Together",
        ballotLetters: "פה",
        imageUrl: "assets/politicians/yair-lapid.avif",
        role: "Former Prime Minister & Opposition Leader",
        keyStance: "Liberal democracy, core education requirements, cost-of-living ministry.",
        seats: "12"
      },
      {
        id: "benny-gantz",
        name: "Benny Gantz",
        party: "Blue & White",
        ballotLetters: "כן",
        imageUrl: "assets/politicians/benny-gantz.avif",
        role: "Former Defense Minister & Chief of Staff",
        keyStance: "Mamlachtiyut (Stateliness), regional defense pacts, universal civil service.",
        seats: "12"
      },
      {
        id: "yair-golan",
        name: "Yair Golan",
        party: "The Democrats",
        ballotLetters: "מרצ",
        imageUrl: "assets/politicians/yair-golan.avif",
        role: "Democrats Leader & Maj. Gen. (res.)",
        keyStance: "Social democracy, two-state security framework, immediate Haredi draft.",
        seats: "10"
      }
    ]
  },
  {
    id: "defense",
    title: "The Race for Defense Ministry",
    description: "Authority over the IDF, security apparatus, borders, and regional operations.",
    candidates: [
      {
        id: "israel-katz",
        name: "Israel Katz",
        party: "Likud",
        ballotLetters: "מחל",
        imageUrl: "assets/politicians/israel-katz.avif",
        role: "Defense Minister",
        keyStance: "Hawkish defense posture, pressure on adversary infrastructure.",
        seats: "24"
      },
      {
        id: "gadi-eisenkot",
        name: "Gadi Eisenkot",
        party: "Yashar!",
        ballotLetters: "ישר",
        imageUrl: "assets/politicians/gadi-eisenkot.avif",
        role: "Former IDF Chief of General Staff",
        keyStance: "Deterrence restoration, strategic planning, mandatory universal draft.",
        seats: "22"
      },
      {
        id: "yoaz-hendel",
        name: "Yoaz Hendel",
        party: "Zionist Home",
        ballotLetters: "ז",
        imageUrl: "assets/politicians/yoaz-hendel.avif",
        role: "Reservists Party Leader",
        keyStance: "Miluimnikim rights, national service mandate, Zionist security doctrine.",
        seats: "N/A"
      }
    ]
  },
  {
    id: "finance",
    title: "The Race for Finance Ministry",
    description: "Control over state budget, taxation, price controls, and cost of living policies.",
    candidates: [
      {
        id: "bezalel-smotrich",
        name: "Bezalel Smotrich",
        party: "Religious Zionist",
        ballotLetters: "טב",
        imageUrl: "assets/politicians/bezalel-smotrich.avif",
        role: "Incumbent Finance Minister",
        keyStance: "Deregulation, free-market roots, funding for settlements and peripheral regions.",
        seats: "5"
      },
      {
        id: "avigdor-lieberman",
        name: "Avigdor Lieberman",
        party: "Yisrael Beiteinu",
        ballotLetters: "ל",
        imageUrl: "assets/politicians/avigdor-lieberman.avif",
        role: "Former Finance Minister",
        keyStance: "Privatization of ports/airports, breaking importer monopolies, secular tax reform.",
        seats: "9"
      }
    ]
  },
  {
    id: "justice",
    title: "The Race for Justice Ministry",
    description: "Authority over judicial appointments, basic laws, and court balance of powers.",
    candidates: [
      {
        id: "yariv-levin",
        name: "Yariv Levin",
        party: "Likud",
        ballotLetters: "מחל",
        imageUrl: "assets/politicians/yariv-levin.avif",
        role: "Incumbent Justice Minister",
        keyStance: "Judicial overhaul, Knesset override clause, Judicial Selection Committee reform.",
        seats: "24"
      },
      {
        id: "yair-golan",
        name: "Yair Golan",
        party: "The Democrats",
        ballotLetters: "מרצ",
        imageUrl: "assets/politicians/yair-golan.avif",
        role: "Democrats Faction Leader",
        keyStance: "Supreme Court independence, Basic Law: Equality, constitutional protections.",
        seats: "10"
      }
    ]
  }
];

const CabinetRaces: React.FC = () => {
  const [selectedRace, setSelectedRace] = useState<string>("prime-minister");
  const activeRace = RACES_DATA.find((r) => r.id === selectedRace) || RACES_DATA[0];

  return (
    <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#162839] px-4 md:px-8 py-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Hero Header */}
        <div className="border-b-2 border-[#162839] dark:border-slate-700 pb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>Cabinet Positions • Israel Election 2026</span>
          </div>
          <h1 className="font-['Newsreader'] text-4xl md:text-5xl font-bold text-[#162839] dark:text-[#fbf9f5] leading-tight">
            The Cabinet Job Races
          </h1>
          <p className="mt-3 text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Head-to-head comparison of declared candidates and party leaders competing for key ministerial posts in the 26th Knesset government.
          </p>
        </div>

        {/* Race Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-stone-200 dark:border-slate-800 pb-4">
          {RACES_DATA.map((race) => {
            const isActive = race.id === selectedRace;
            return (
              <button
                key={race.id}
                onClick={() => setSelectedRace(race.id)}
                className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#162839] text-white shadow-md dark:bg-secondary'
                    : 'bg-white dark:bg-[#1f3448] text-slate-700 dark:text-slate-200 border border-stone-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                <span>{race.title.replace('The Race for ', '')}</span>
                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                  {race.candidates.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Race Detail */}
        <div className="space-y-6">
          <div>
            <h2 className="font-['Newsreader'] text-3xl font-bold text-[#162839] dark:text-[#fbf9f5]">
              {activeRace.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {activeRace.description}
            </p>
          </div>

          {/* Candidate Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeRace.candidates.map((cand) => (
              <div
                key={cand.id}
                className="bg-white dark:bg-[#1f3448] p-6 rounded-2xl border-2 border-stone-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:shadow-lg transition-shadow"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={cand.imageUrl}
                        alt={cand.name}
                        className="w-14 h-14 rounded-full object-cover object-top border-2 border-stone-200 dark:border-slate-700"
                      />
                      <div>
                        <h3 className="font-bold text-lg text-[#162839] dark:text-[#fbf9f5] leading-snug">
                          {cand.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {cand.party} • {cand.seats} seats
                        </p>
                      </div>
                    </div>
                    <span lang="he" dir="rtl" className="font-['Suez_One'] text-2xl font-black text-secondary">
                      {cand.ballotLetters}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="bg-stone-50 dark:bg-[#162839] p-2.5 rounded-lg border border-stone-100 dark:border-slate-800">
                      <span className="font-bold text-slate-500 uppercase tracking-widest block text-[9px]">Current Standing</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{cand.role}</span>
                    </div>

                    <div className="bg-stone-50 dark:bg-[#162839] p-2.5 rounded-lg border border-stone-100 dark:border-slate-800">
                      <span className="font-bold text-slate-500 uppercase tracking-widest block text-[9px]">Key Policy Stance</span>
                      <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{cand.keyStance}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`#/profile/${cand.id}`}
                  className="w-full text-center bg-stone-100 dark:bg-[#162839] hover:bg-[#162839] hover:text-white dark:hover:bg-secondary text-[#162839] dark:text-slate-200 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors block"
                >
                  View Full Profile & Stances →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* AI Disclaimer Footer */}
        <div className="border-t border-stone-200 dark:border-slate-800 pt-6 text-center text-xs text-slate-500">
          <p>{AI_DISCLAIMER.short}</p>
        </div>
      </div>
    </div>
  );
};

export default CabinetRaces;
