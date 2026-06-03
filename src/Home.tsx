import React, { useEffect } from 'react';
import { useLanguage } from './i18n';

interface HomeProps {
  currentPath: string;
}

const Home: React.FC<HomeProps> = ({ currentPath }) => {
  const { t } = useLanguage();

  useEffect(() => {
    if (currentPath === '#/transparency') {
      const timer = setTimeout(() => {
        const el = document.getElementById('transparency');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentPath]);

  return (
    <>
      <div className="flex min-h-screen">
        {/* Main Content */}
        <main className="flex-grow bg-surface transition-colors duration-300">
          {/* Hero Section */}
          <section className="relative min-h-[716px] flex items-center justify-center overflow-hidden px-12">
            <div className="absolute inset-0 z-0 opacity-10">
              <img alt="The Knesset building in Jerusalem with the Israeli flag" className="w-full h-full object-cover grayscale" src="https://upload.wikimedia.org/wikipedia/commons/e/eb/Knesset_front_side_-_2022.jpg" />
            </div>
            <div className="relative z-10 max-w-4xl text-center flex flex-col items-center">
              <h1 className="font-headline text-6xl md:text-8xl font-black text-primary leading-none tracking-tighter mb-8">
                {t('home.hero.title1')}<br />
                <span className="italic text-secondary">{t('home.hero.title2')}</span>
              </h1>
              <p className="font-body text-lg text-on-surface-variant max-w-2xl leading-relaxed mb-12">
                <span className="font-['Newsreader'] italic font-bold text-xl">PoliDash</span> {t('home.hero.description')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="#/issues" className="px-8 py-4 bg-primary text-white font-label font-bold text-lg rounded-sm hover:bg-secondary hover:shadow-xl transition-all flex items-center justify-center cursor-pointer">
                  {t('home.hero.exploreBtn')}
                </a>
                <button 
                  onClick={() => document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-white text-primary border border-primary/20 font-label font-bold text-lg rounded-sm hover:bg-stone-100 hover:shadow-lg transition-all flex items-center justify-center cursor-pointer"
                >
                  {t('home.hero.workflowBtn')}
                </button>
              </div>
            </div>
          </section>
          {/* 3-Step Breakdown */}
          <section id="workflow" className="py-24 px-12 bg-white border-y border-stone-100">
            <div className="max-w-7xl mx-auto text-center mb-16">
              <h3 className="font-headline text-4xl font-bold text-primary tracking-tight">
                {t('home.workflow.title')}
              </h3>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl" data-icon="description">description</span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-primary mb-3">
                  {t('home.workflow.data.title')}
                </h3>
                <p className="font-body text-on-surface-variant leading-relaxed">
                  {t('home.workflow.data.desc')}
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl" data-icon="auto_awesome">auto_awesome</span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-primary mb-3">
                  {t('home.workflow.ai.title')}
                </h3>
                <p className="font-body text-on-surface-variant leading-relaxed">
                  {t('home.workflow.ai.desc')}
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl" data-icon="filter_tilt_shift">filter_tilt_shift</span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-primary mb-3">
                  {t('home.workflow.neutral.title')}
                </h3>
                <p className="font-body text-on-surface-variant leading-relaxed">
                  {t('home.workflow.neutral.desc')}
                </p>
              </div>
            </div>
          </section>
          {/* CTA Section */}
          <section className="py-24 px-12">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
              {/* Top Row: 3 Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="bg-white p-10 rounded-xl apple-shadow flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                  <div>
                    <h3 className="font-headline text-3xl font-bold text-primary mb-6">
                      {t('home.cta.profiles.title')}
                    </h3>
                    <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-8">
                      {t('home.cta.profiles.desc')}
                    </p>
                  </div>
                  <a href="#/profiles" className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all text-center inline-block">
                    {t('home.cta.profiles.btn')}
                  </a>
                </div>
                {/* Card 2 */}
                <div className="bg-white p-10 rounded-xl apple-shadow flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                  <div>
                    <h3 className="font-headline text-3xl font-bold text-primary mb-6">
                      {t('home.cta.issues.title')}
                    </h3>
                    <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-8">
                      {t('home.cta.issues.desc')}
                    </p>
                  </div>
                  <a href="#/issues" className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all text-center inline-block">
                    {t('home.cta.issues.btn')}
                  </a>
                </div>
                {/* Card 3 */}
                <div className="bg-white p-10 rounded-xl apple-shadow flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                  <div>
                    <h3 className="font-headline text-3xl font-bold text-primary mb-4">
                      {t('home.cta.quiz.title')}
                    </h3>
                    <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-6">
                      {t('home.cta.quiz.desc')}
                    </p>
                  </div>
                  <a href="#/quiz" className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all text-center inline-block">
                    {t('home.cta.quiz.btn')}
                  </a>
                </div>
              </div>
              
              {/* Bottom Row: 2 Cards Centered */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
                {/* Card 4 */}
                <div className="bg-white p-10 rounded-xl apple-shadow flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                  <div>
                    <h3 className="font-headline text-3xl font-bold text-primary mb-4">
                      {t('home.cta.polls.title')}
                    </h3>
                    <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-6">
                      {t('home.cta.polls.desc')}
                    </p>
                  </div>
                  <a href="#/polls" className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all text-center inline-block">
                    {t('home.cta.polls.btn')}
                  </a>
                </div>
                {/* Card 5 */}
                <div className="bg-white p-10 rounded-xl apple-shadow flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                  <div>
                    <h3 className="font-headline text-3xl font-bold text-primary mb-4">
                      {t('home.cta.coalition.title')}
                    </h3>
                    <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-6">
                      {t('home.cta.coalition.desc')}
                    </p>
                  </div>
                  <a href="#/coalition" className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all text-center inline-block">
                    {t('home.cta.coalition.btn')}
                  </a>
                </div>
              </div>
            </div>
          </section>
          {/* Disclaimer Footer */}
          <section id="transparency" className="bg-stone-50 py-24 px-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-headline text-3xl font-bold text-primary mb-6">
                {t('home.reply.title')}
              </h2>
              <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-10 max-w-2xl mx-auto">
                {t('home.reply.desc')}
              </p>
              <a href="#/reply" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-label font-bold text-lg rounded-sm hover:shadow-xl transition-all group mx-auto">
                {t('home.reply.btn')}
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
              </a>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Home;
