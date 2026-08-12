import React from 'react';
import { politicians, AI_DISCLAIMER } from './data';

const VotingGuide: React.FC = () => {

  // Deduplicate parties and extract ballot letters with leader ID
  const partyCards = Array.from(
    new Map(
      politicians.map((p) => [
        p.party,
        {
          id: p.id,
          party: p.party,
          leader: p.name,
          letters: p.ballotLetters,
          seats: p.seats,
          website: p.partyWebsite
        }
      ])
    ).values()
  );

  return (
    <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#162839] px-4 md:px-8 py-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="border-b-2 border-[#162839] dark:border-slate-700 pb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>Civic Guide • Israel Legislative Election 2026</span>
          </div>
          <h1 className="font-['Newsreader'] text-4xl md:text-5xl font-bold text-[#162839] dark:text-[#fbf9f5] leading-tight">
            How to Vote in Israel: <br className="hidden sm:block" />
            <span className="italic">Every slip ("Petek"), explained.</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            On election day for the 26th Knesset (27 October 2026), your entire vote is a single printed paper slip placed inside a sealed blue envelope. Here is how the system works and what slip stands for which list.
          </p>
        </div>

        {/* 3 Step Voting Process */}
        <section className="space-y-6">
          <h2 className="font-['Newsreader'] text-2xl font-bold text-[#162839] dark:text-[#fbf9f5]">
            The 3 Steps at the Polling Station
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1f3448] p-6 rounded-xl border border-stone-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-3 end-3 text-3xl font-black text-slate-200 dark:text-slate-700 select-none">01</div>
              <span className="material-symbols-outlined text-secondary text-3xl mb-3">badge</span>
              <h3 className="font-bold text-lg text-[#162839] dark:text-[#fbf9f5] mb-2">Check In with Official ID</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Present a valid Israeli Passport, Teudat Zehut (ID Card), or Israeli Driver's License to the polling committee. You will receive an official stamped blue envelope.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1f3448] p-6 rounded-xl border border-stone-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-3 end-3 text-3xl font-black text-slate-200 dark:text-slate-700 select-none">02</div>
              <span className="material-symbols-outlined text-secondary text-3xl mb-3">note_stack</span>
              <h3 className="font-bold text-lg text-[#162839] dark:text-[#fbf9f5] mb-2">Select Your Party Slip ("Petek")</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Behind the privacy screen, pick exactly ONE paper slip featuring the Hebrew letters of your chosen party. Seal it inside the blue envelope.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1f3448] p-6 rounded-xl border border-stone-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-3 end-3 text-3xl font-black text-slate-200 dark:text-slate-700 select-none">03</div>
              <span className="material-symbols-outlined text-secondary text-3xl mb-3">how_to_vote</span>
              <h3 className="font-bold text-lg text-[#162839] dark:text-[#fbf9f5] mb-2">Cast Your Ballot</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Drop the sealed envelope into the blue ballot box in front of the committee. Your vote is registered for both the party list and its leader.
              </p>
            </div>
          </div>
        </section>

        {/* Hebrew Ballot Slips Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-200 dark:border-slate-800 pb-3">
            <h2 className="font-['Newsreader'] text-2xl font-bold text-[#162839] dark:text-[#fbf9f5]">
              Official Party Slips ("HaPetek")
            </h2>
            <span className="text-xs text-slate-500 font-medium">Click any card to view politician profile & platform</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {partyCards.map((card, i) => (
              <a
                key={i}
                href={`#/profile/${card.id}`}
                className="group bg-white dark:bg-[#1f3448] p-4 rounded-xl border-2 border-[#162839]/10 dark:border-slate-700 hover:border-[#162839] dark:hover:border-secondary transition-all duration-200 flex flex-col justify-between h-40 shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.seats !== "N/A" ? `${card.seats} seats` : 'New List'}</span>
                  <span lang="he" dir="rtl" className="font-['Suez_One'] text-3xl font-black text-[#162839] dark:text-[#fbf9f5] group-hover:scale-110 transition-transform">
                    {card.letters}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#162839] dark:text-[#fbf9f5] leading-snug group-hover:text-secondary transition-colors">
                    {card.party}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Led by <span className="font-semibold text-slate-700 dark:text-slate-200">{card.leader}</span>
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Special Voting Circumstances & Threshold */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-stone-100 dark:bg-[#1a2e40] p-6 rounded-xl border border-stone-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-lg text-[#162839] dark:text-[#fbf9f5] flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">military_tech</span>
              Reserve Soldiers & Special Stations
            </h3>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc ps-5 leading-relaxed">
              <li><strong>Reserve Duty (Miluimnikim):</strong> Mobile military polling stations ("Kalfi Chayalim") are set up across all IDF bases and operational zones. Double envelope voting applies.</li>
              <li><strong>Diplomatic Service:</strong> Israeli diplomats and overseas official envoys vote at Israeli embassies and consulates 12 days before national polling day.</li>
              <li><strong>Hospital & Accessibility:</strong> Accessible polling stations are available in all major public hospitals and designated municipal centers.</li>
            </ul>
          </div>

          <div className="bg-stone-100 dark:bg-[#1a2e40] p-6 rounded-xl border border-stone-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-lg text-[#162839] dark:text-[#fbf9f5] flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">percent</span>
              The 3.25% Electoral Threshold
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To enter the 120-seat Knesset, a party list must receive at least <strong>3.25%</strong> of the total valid votes nationwide (~4 seats). Any party receiving less than 3.25% is eliminated, and its votes are not counted toward seat allocation.
            </p>
            <div className="pt-2 text-xs font-semibold text-slate-500 uppercase tracking-widest border-t border-stone-200 dark:border-slate-700">
              Bader-Ofer Method regulates surplus vote distribution among eligible parties.
            </div>
          </div>
        </div>

        {/* AI Disclaimer Footer */}
        <div className="border-t border-stone-200 dark:border-slate-800 pt-6 mt-12 text-center text-xs text-slate-500 space-y-2">
          <p className="font-medium text-slate-600 dark:text-slate-400">
            {AI_DISCLAIMER.full}
          </p>
          <p className="italic">
            PoliDash is an independent, non-partisan educational guide. Official ballot information is governed by the Israeli Central Elections Committee (CEC).
          </p>
        </div>
      </div>
    </div>
  );
};

export default VotingGuide;
