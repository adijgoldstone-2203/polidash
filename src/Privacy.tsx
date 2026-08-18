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
                    1. מבוא ועמידה בדין (עפ"י תיקון 13 לחוק הגנת הפרטיות)
                  </h2>
                  <p>
                    פולידאש (PoliDash) הוא מיזם מידע עצמאי ובלתי תלוי למעקב אחר עמדות פוליטיות, המחוייב באופן מוחלט לשמירה על הפרטיות, השקיפות והניטרליות. האתר פועל בהתאם להוראות חוק הגנת הפרטיות, התשמ"א-1981, לרבות **תיקון מס' 13 לחוק הגנת הפרטיות, התשפ"ד-2024** (הנכנס לתוקף באוגוסט 2025). האתר תוכנן במבנה של Privacy by Design ואינו דורש הרשמה, יצירת חשבון או מסירת פרטים מזהים כלשהם.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    2. איסוף ואחסון מידע רגיש ונתוני משתמשים
                  </h2>
                  <p>
                    על פי הדין הישראלי, עמדות ודעות פוליטיות נחשבות כ**מידע רגיש**. אנו <strong>איננו</strong> אוספים, מעבירים לשרתים או שומרים במסד נתונים מרכזי את תשובות המשתמשים בשאלון ההתאמה הפוליטית או את עמדותיהם. כל הנתונים הנוצרים בעקבות המענה על השאלון נשמרים **בופן מקומי בלבד** בדפדפן המשתמש (Local Storage) ואינם מועברים לגורם שלישי כלשהו.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    3. עוגיות ואחסון מקומי (Cookies & Local Storage)
                  </h2>
                  <p>
                    אתר זה אינו משתמש בעוגיות מעקב (Tracking Cookies) או בעוגיות צד שלישי למטרות פרסום או פרופילינג. האחסון המקומי של הדפדפן שלך משמש אך ורק לשמירת העדפות ממשק בסיסיות (כגון בחירת שפה או העדפת מצב כהה) וכן לשמירת תוצאות שאלון ההתאמה המקומי במכשירך.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    4. איסוף מידע על אישי ציבור ורשומות פומביות
                  </h2>
                  <p>
                    כל המידע המוצג באתר לגבי מועמדים ואישי ציבור מתייחס исключительно לפעילותם הציבורית והפוליטית. המידע מבוסס על מקורות גלויים, רשומות הכנסת, מצעים רשמיים ופרסומים עיתונאיים מאומתים. האתר נמנע באופן מוחלט מאוסף או פרסום של מידע אישי פרטי (כגון כתובת מגורים, טלפון אישי, מידע רפואי או פרטי משפחה).
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    5. אירוח ואנליטיקה
                  </h2>
                  <p>
                    האתר מאוחסן ומורץ באמצעות פלטפורמת Vercel. שרתי האירוח עשויים לרשום מידע טכני בסיסי ולא מזהה (כמו סוג הדפדפן, מערכת ההפעלה, וזמן הגישה) כחלק מיומני השרת הרגילים לצורך אבטחה, ניטור ביצועים ומניעת שימוש לרעה.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    6. יצירת קשר ונוהל הודעה והסרה
                  </h2>
                  <p>
                    לכל שאלה, פנייה בנושא פרטיות או דיווח על אי-דיוקים, ניתן לפנות אלינו באמצעות <a href="#/reply" className="text-secondary font-bold underline">פורטל זכות התגובה ונוהל הודעה והסרה</a>. אנו מתחייבים לבדוק כל פנייה ולפעול לתיקון במידת הצורך בתוך 72 שעות.
                  </p>
                </section>
              </>
            ) : (
              // English Content
              <>
                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    1. Overview & Statutory Compliance (Amendment 13)
                  </h2>
                  <p>
                    PoliDash is an independent, non-partisan political intelligence platform operating under strict compliance with the Israeli Privacy Protection Law (5741-1981) and **Amendment No. 13 (5784-2024)**. Designed around strict Privacy-by-Design principles, our dashboard requires no user accounts, registration, or submission of personal identifiers.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    2. Sensitive Personal Data Protection
                  </h2>
                  <p>
                    Under Israeli law, political opinions and stances are explicitly categorized as **sensitive personal data**. PoliDash does <strong>not</strong> transmit, record, or store user quiz responses or political alignments on any remote database or server. All alignment calculations occur **strictly client-side** within your browser's memory and local storage.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    3. Cookies and Local Storage
                  </h2>
                  <p>
                    We do not deploy tracking cookies, fingerprinting pixels, or third-party advertising cookies. Local storage is used exclusively to retain basic UI preferences (language selection, dark mode) and temporary quiz calculations on your local device.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    4. Public Figure Data Restrictions
                  </h2>
                  <p>
                    All public figure profiles and stance maps on PoliDash reflect strictly public, official parliamentary records, party manifestos, and verified media broadcasts. We strictly omit all private personal details (such as home addresses, personal contacts, family data, or medical records).
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    5. Infrastructure & Security
                  </h2>
                  <p>
                    PoliDash is hosted on Vercel. Standard, non-identifying technical server logs (browser type, OS, timestamp) may be logged by Vercel solely for DDoS protection, infrastructure security, and system stability.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
                    6. Notice and Takedown Protocol
                  </h2>
                  <p>
                    For inquiries, data protection questions, or factual correction requests, please contact our editorial team via our <a href="#/reply" className="text-secondary font-bold underline">Right of Reply & Notice and Takedown Portal</a>. All requests are reviewed within 72 business hours.
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
