import React from 'react';
import { useLanguage } from './i18n';

const Privacy: React.FC = () => {
  const { lang } = useLanguage();

  const isHe = lang === 'he';

  return (
    <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#162839] transition-colors duration-300 px-6 lg:px-12 pt-8 pb-20">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <div className="mb-12">
          <a 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors cursor-pointer" 
            href="#/"
          >
            <span className="material-symbols-outlined text-base">
              {isHe ? 'arrow_forward' : 'arrow_back'}
            </span> 
            {isHe ? 'חזרה לדף הבית' : 'Back to Home'}
          </a>
        </div>

        {/* Article Container */}
        <article className="bg-white dark:bg-[#1b2a3a] border border-stone-200/50 dark:border-slate-800/50 rounded-2xl p-8 md:p-12 shadow-md transition-colors duration-300" dir={isHe ? 'rtl' : 'ltr'}>
          <header className="mb-8 border-b border-stone-100 dark:border-slate-850 pb-6">
            <h1 className="font-['Newsreader'] text-4xl md:text-5xl font-bold text-primary dark:text-[#fbf9f5] mb-3 leading-none">
              {isHe ? 'מדיניות פרטיות' : 'Privacy Policy'}
            </h1>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-['Inter'] uppercase tracking-widest">
              {isHe ? 'עודכן לאחרונה: 11 ביוני 2026' : 'Last updated: June 11, 2026'}
            </p>
          </header>

          <div className="font-['Inter'] text-slate-600 dark:text-slate-300 leading-relaxed space-y-8 text-sm md:text-base">
            {isHe ? (
              // Hebrew Content
              <>
                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    1. מבוא וסקירה כללית
                  </h2>
                  <p>
                    פולידאש (PoliDash) הוא פלטפורמה עצמאית למעקב אחר עמדות פוליטיות, מחויב לשקיפות וניטרליות. אנו מאמינים בשמירה על פרטיות המשתמשים שלנו, ולכן האתר בנוי כך שאינו דורש הרשמה, יצירת חשבון או מסירת פרטים מזהים כלשהם.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    2. איסוף נתונים אישיים
                  </h2>
                  <p>
                    אנו <strong>איננו</strong> אוספים, שומרים או מעבדים מידע אישי מזהה (כגון שם, כתובת אימייל, מספר טלפון או מיקום) של המבקרים באתר. הגלישה בפולידאש היא אנונימית לחלוטין.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    3. עוגיות ואחסון מקומי (Cookies & Storage)
                  </h2>
                  <p>
                    אתר זה אינו משתמש בעוגיות מעקב (Tracking Cookies) או בעוגיות צד שלישי למטרות פרסום. אנו עשויים להשתמש באחסון המקומי של הדפדפן שלך (Local Storage) אך ורק כדי לשמור העדפות ממשק בסיסיות (כמו בחירת שפה או העדפת מצב כהה) וכן כדי לשמור את התוצאות של שאלון התאמת העמדות המקומי שלך, כך שחוויית הגלישה שלך תישמר בביקור הבא. מידע זה נשאר מקומית על המכשיר שלך ואינו מועבר לשרתים שלנו.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    4. אירוח ואנליטיקה
                  </h2>
                  <p>
                    האתר מאוחסן ומורץ באמצעות פלטפורמת Vercel. שרתי האירוח עשויים לרשום מידע טכני בסיסי ולא מזהה (כמו סוג הדפדפן, מערכת ההפעלה, וזמן הגישה) כחלק מיומני השרת הרגילים לצורך אבטחה, ניטור ביצועים ומניעת שימוש לרעה, בהתאם למדיניות הפרטיות של Vercel.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    5. נתוני אישי ציבור ועמדות
                  </h2>
                  <p>
                    כל המידע המוצג באתר לגבי אישי ציבור, מפלגות ועמדותיהם מבוסס על מקורות גלויים לציבור, רשומות רשמיות של הכנסת, מצעי מפלגות ופרסומים עיתונאיים מאומתים. אנו מקפידים לצרף קישורים למקורות הרלוונטיים ומתחייבים לפעול על פי פרוטוקול "זכות התגובה" למתן אפשרות לתיקון או הבהרת מידע במידת הצורך.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    6. יצירת קשר
                  </h2>
                  <p>
                    לכל שאלה או פנייה בנושא פרטיות או דיוק הנתונים המוצגים באתר, ניתן לפנות אלינו באמצעות ערוצי יצירת הקשר הרשמיים או דרך מנגנון זכות התגובה שברובריקה התחתונה של האתר.
                  </p>
                </section>
              </>
            ) : (
              // English Content
              <>
                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    1. Overview
                  </h2>
                  <p>
                    PoliDash is an independent political tracking platform dedicated to transparency and political clarity. We believe in preserving user anonymity, which is why our platform is built without the need for user accounts, registration, or the submission of personal identifiers.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    2. Data Collection
                  </h2>
                  <p>
                    We do <strong>not</strong> collect, store, or process any personally identifiable information (PII) such as names, email addresses, phone numbers, or physical locations from our visitors. Your browsing session is entirely anonymous.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    3. Cookies and Local Storage
                  </h2>
                  <p>
                    We do not use tracking cookies or third-party advertising cookies. We may utilise your browser's local storage (Local Storage) solely to preserve basic user preferences (such as your language selection or dark mode setting) and to temporarily cache your local political quiz answers so your progress is saved on your device for your next visit. This data stays on your machine and is never transmitted to our servers.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    4. Hosting and Server Logs
                  </h2>
                  <p>
                    Our platform is hosted on Vercel. Standard, non-identifying server logs (such as user-agent, operating system, and request timestamp) may be automatically logged by Vercel for security monitoring, performance analysis, and abuse prevention, in accordance with Vercel's privacy guidelines.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    5. Public Figure Data and Attributions
                  </h2>
                  <p>
                    All public figure profiles, statements, and policy stance maps displayed on this website are aggregated from public records, Knesset transcripts, official party platforms, and verified media articles. We link to source materials for verification and remain fully committed to the "Right of Reply" protocol to ensure objective reporting.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    6. Contact
                  </h2>
                  <p>
                    If you have any questions or feedback regarding this policy or the accuracy of our public stance tracking, please reach out via the Right of Reply protocol located in the footer of our dashboard.
                  </p>
                </section>
              </>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default Privacy;
