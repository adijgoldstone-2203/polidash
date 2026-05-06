import React from 'react';

const Home: React.FC = () => {
  return (
    <>
      <div className="flex min-h-screen">
        {/* Main Content */}
        <main className="flex-grow bg-surface transition-colors duration-300">
          {/* Hero Section */}
          <section className="relative min-h-[716px] flex items-center justify-center overflow-hidden px-12">
            <div className="absolute inset-0 z-0 opacity-10">
              <img alt="Legislative chamber architectural detail" className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDztkE3h6L9By6v-q6ScNnajmjURbWMHaC4GCi33RhfJ4pgcWnQvuKEcLvv3DUSWFtndHgkY2_J5WDOfStKlRF204WI41w99rFFgbuBQWyw-jY0kDsObzsevlgouAYlt4DaI2N9vzV4Zh0QSzJn83TH8DGhnN9pkPf5Ddm-KcCYPh6CJjM5ZUJqJBZoc_RytGfiTjzMeBf8tbveQdBl46M-b04gvkCW3J35YPrjjCV5WS999h89z6YTWc86ACtjZclecJnh36yZOU" />
            </div>
            <div className="relative z-10 max-w-4xl text-center flex flex-col items-center">
              <h1 className="font-headline text-6xl md:text-8xl font-black text-primary leading-none tracking-tighter mb-8">
                See the stances.<br />
                <span className="italic text-secondary">Build the future.</span>
              </h1>
              <p className="font-headline text-2xl text-on-surface-variant max-w-2xl leading-relaxed mb-12">
                A neutral gateway to political clarity. We aggregate verified policy data and media sentiment to provide a synthesized perspective on the decisions shaping our collective tomorrow.
              </p>
              <div className="flex gap-4">
                <a href="#/issues" className="px-8 py-4 bg-primary text-white font-label font-bold text-lg rounded-sm hover:shadow-xl transition-all flex items-center justify-center">Explore the Issues</a>
                <a href="#workflow" className="px-8 py-4 bg-stone-100 text-primary font-label font-bold text-lg rounded-sm hover:bg-stone-200 transition-all flex items-center justify-center">Our Workflow</a>
              </div>
            </div>
          </section>
          {/* 3-Step Breakdown */}
          <section id="workflow" className="py-24 px-12 bg-white border-y border-stone-100">
            <div className="max-w-7xl mx-auto text-center mb-16">
              <h3 className="font-headline text-4xl font-bold text-primary tracking-tight">Our Workflow</h3>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl" data-icon="description">description</span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-primary mb-3">Verified Data</h3>
                <p className="font-body text-on-surface-variant leading-relaxed">We aggregate manifestos, voting records, and official transcripts.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl" data-icon="auto_awesome">auto_awesome</span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-primary mb-3">AI Synthesis</h3>
                <p className="font-body text-on-surface-variant leading-relaxed">Advanced models generate concise, source-grounded summaries.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl" data-icon="filter_tilt_shift">filter_tilt_shift</span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-primary mb-3">Neutral Clarity</h3>
                <p className="font-body text-on-surface-variant leading-relaxed">We map standings without bias to clarify positions.</p>
              </div>
            </div>
          </section>
          {/* CTA Section (3-Card Grid) */}
          <section className="py-24 px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white p-10 rounded-xl apple-shadow flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                <div>
                  <h3 className="font-headline text-3xl font-bold text-primary mb-6">PolitiScan Profiles</h3>
                  <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-8">View AI summaries and manifestos of all major politicians.</p>
                </div>
                <a href="#/profiles" className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all text-center inline-block">Explore Profiles</a>
              </div>
              {/* Card 2 */}
              <div className="bg-white p-10 rounded-xl apple-shadow flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                <div>
                  <h3 className="font-headline text-3xl font-bold text-primary mb-6">Issue Pivot</h3>
                  <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-8">Compare where every politician stands on key dynamic issues (e.g., Judicial Reform, Economy).</p>
                </div>
                <a href="#/issues" className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all text-center inline-block">Compare Issues</a>
              </div>
              {/* Card 3 */}
              <div className="bg-white p-10 rounded-xl apple-shadow flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                <div>
                  <h3 className="font-headline text-3xl font-bold text-primary mb-4">Standings Quiz</h3>
                  <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-6">Define your stance on the nine pillars of modern national governance.</p>
                </div>
                <a href="#/quiz" className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all text-center inline-block">Take Quiz</a>
              </div>
            </div>
          </section>
          {/* Disclaimer Footer */}
          <section className="bg-stone-50 py-24 px-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-headline text-3xl font-bold text-primary mb-6">Transparency &amp; Accountability</h2>
              <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-10 max-w-2xl mx-auto">
                PoliDash uses AI to synthesize public records. Every summary includes a direct link to the original document. Fact-checking and source verification are fundamental.
              </p>
              <button className="px-8 py-4 border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all rounded-lg">
                Submit a Right of Reply Correction
              </button>
            </div>
          </section>
          {/* Footer */}
          <footer className="w-full flex flex-col md:flex-row justify-between items-center px-12 gap-8 py-12 border-t border-stone-200/50 dark:border-slate-800/50 bg-[#fbf9f5] dark:bg-[#162839]">
            <div className="flex flex-col gap-2">
              <p className="font-['Inter'] text-xs uppercase tracking-widest text-[#162839] dark:text-[#fbf9f5] font-bold">© 2024 PoliDash Intelligence. AI-Generated Synthesis.</p>
            </div>
            <div className="flex gap-8">
              <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white underline decoration-1" href="#">AI Methodology</a>
              <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white underline decoration-1" href="#">Right of Reply Protocol</a>
              <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white underline decoration-1" href="#">Privacy</a>
              <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white underline decoration-1" href="#">Terms</a>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
};

export default Home;
