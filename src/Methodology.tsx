import React from 'react';
import { AI_DISCLAIMER } from './data';

const Methodology: React.FC = () => {

  return (
    <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#162839] px-4 md:px-8 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Page Title */}
        <div className="border-b-2 border-[#162839] dark:border-slate-700 pb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>Data Integrity & Methodology</span>
          </div>
          <h1 className="font-['Newsreader'] text-4xl md:text-5xl font-bold text-[#162839] dark:text-[#fbf9f5] leading-tight">
            Where the numbers come from
          </h1>
          <p className="mt-3 text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            PoliDash runs no polls of its own. Every seat projection, trend line, and coalition math on this platform is derived from a transparent 3-step aggregation of published survey data and public record analysis.
          </p>
        </div>

        {/* 3 Step Calculation Cards */}
        <section className="space-y-6">
          <h2 className="font-['Newsreader'] text-2xl font-bold text-[#162839] dark:text-[#fbf9f5]">
            The 3-Step Poll Aggregation Model
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1f3448] p-6 rounded-xl border border-stone-200 dark:border-slate-800 space-y-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#162839] text-white font-bold text-sm">1</span>
              <h3 className="font-bold text-lg text-[#162839] dark:text-[#fbf9f5]">Daily Collection</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                We track every published poll from major Israeli pollsters (Midgam, Kantar, Direct Polls, Lazar) commissioned by networks (Channel 12, Kan 11, Channel 14, i24 News).
              </p>
            </div>

            <div className="bg-white dark:bg-[#1f3448] p-6 rounded-xl border border-stone-200 dark:border-slate-800 space-y-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#162839] text-white font-bold text-sm">2</span>
              <h3 className="font-bold text-lg text-[#162839] dark:text-[#fbf9f5]">10-Poll Window</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                We maintain a rolling average of the 10 most recent published polls, ordered strictly by fieldwork dates rather than broadcast dates.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1f3448] p-6 rounded-xl border border-stone-200 dark:border-slate-800 space-y-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#162839] text-white font-bold text-sm">3</span>
              <h3 className="font-bold text-lg text-[#162839] dark:text-[#fbf9f5]">House Bias Subtraction</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Each pollster's systematic standing lean over the last 30 surveys is calculated and subtracted prior to averaging, preventing sudden skew when one outlet publishes frequently.
              </p>
            </div>
          </div>
        </section>

        {/* Known Limitations */}
        <section className="space-y-6">
          <h2 className="font-['Newsreader'] text-2xl font-bold text-[#162839] dark:text-[#fbf9f5]">
            Known Limitations & Methodological Rules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-stone-100 dark:bg-[#1a2e40] p-5 rounded-xl border border-stone-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 block">Known Bias</span>
              <h4 className="font-bold text-base text-[#162839] dark:text-[#fbf9f5]">Omitted Parties Count as Zero</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Not all pollsters query every minor list. When a survey leaves out a party, our average registers 0 seats for that poll, which can depress averages for emerging lists.
              </p>
            </div>

            <div className="bg-stone-100 dark:bg-[#1a2e40] p-5 rounded-xl border border-stone-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Seat Estimation</span>
              <h4 className="font-bold text-base text-[#162839] dark:text-[#fbf9f5]">Seats are Modeling Guesses</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Pollsters convert vote percentages into seat allocations using proprietary assumptions regarding threshold compliance and surplus-vote agreements.
              </p>
            </div>

            <div className="bg-stone-100 dark:bg-[#1a2e40] p-5 rounded-xl border border-stone-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Historical Precedent</span>
              <h4 className="font-bold text-base text-[#162839] dark:text-[#fbf9f5]">Margin of Error & Volatility</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Historical elections demonstrate that final vote outcomes often deviate from final pre-election polling averages by 2–4 seats.
              </p>
            </div>
          </div>
        </section>

        {/* Source Citation & AI Disclosure */}
        <section className="bg-white dark:bg-[#1f3448] p-8 rounded-2xl border-2 border-[#162839]/10 dark:border-slate-700 shadow-md space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-secondary">verified</span>
            <div>
              <h3 className="font-['Newsreader'] text-2xl font-bold text-[#162839] dark:text-[#fbf9f5]">
                Platform Data & AI Disclosure
              </h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">
                Editorial & Data Transparency
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              Candidate profiles, platform summaries, and stance ratings on PoliDash are compiled and summarized from official party manifestos, public candidate statements, and official party websites using unbiased AI summarization.
            </p>
            <div className="bg-stone-50 dark:bg-[#162839] p-4 rounded-xl border-s-4 border-secondary space-y-2">
              <h4 className="font-bold text-[#162839] dark:text-[#fbf9f5]">AI Summarization Disclaimer</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {AI_DISCLAIMER.full}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500 font-medium">Are you a candidate or party representative?</span>
            <a
              href="#/reply"
              className="inline-flex items-center gap-2 bg-[#162839] dark:bg-secondary text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Right of Reply Protocol <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        </section>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 pt-6">
          PoliDash Methodology • Last updated August 2026 • Non-Partisan Educational Platform
        </div>
      </div>
    </div>
  );
};

export default Methodology;
