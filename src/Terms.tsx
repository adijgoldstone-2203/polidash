import React from 'react';
import { useLanguage } from './i18n';

const Terms: React.FC = () => {
  const { lang } = useLanguage();
  const isHe = lang === 'he';

  return (
    <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#162839] transition-colors duration-300 px-6 lg:px-12 pt-8 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
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
          <header className="mb-8 border-b border-stone-100 dark:border-slate-800 pb-6">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-secondary/15 text-secondary border border-secondary/20">
                {isHe ? 'תנאי שימוש והבהרות משפטיות' : 'Terms of Use & Legal Disclaimers'}
              </span>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
                {isHe ? 'פרויקט סטודנטיאלי • ללא כוונת רווח' : 'Non-Profit Academic Student Project'}
              </span>
            </div>
            <h1 className="font-['Newsreader'] text-3xl md:text-5xl font-bold text-primary dark:text-[#fbf9f5] mb-3 leading-tight">
              {isHe ? 'הבהרות משפטיות, תנאי שימוש ומתודולוגיה' : 'Legal Disclaimers, Terms of Use & Disclosures'}
            </h1>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-['Inter'] uppercase tracking-widest">
              {isHe ? 'עודכן לאחרונה: ספטמבר 2026' : 'Last updated: September 2026'}
            </p>
          </header>

          <div className="font-['Inter'] text-slate-600 dark:text-slate-300 leading-relaxed space-y-8 text-sm md:text-base">
            {isHe ? (
              // Hebrew Content
              <>
                <div className="bg-amber-50/70 dark:bg-amber-950/30 border-s-4 border-amber-500 p-4 rounded-r-xl text-xs md:text-sm text-amber-900 dark:text-amber-200 space-y-1">
                  <p className="font-bold">
                    הבהרה מרכזית: פרויקט סטודנטיאלי אקדמי ללא מטרות רווח
                  </p>
                  <p>
                    אתר פולידאש (PoliDash) פותח ומופעל אך ורק כ**פרויקט סטודנטיאלי אקדמי עצמאי וללא כוונת רווח**, למטרות מחקר אקדמי, חינוך אזרחי והנגשת מידע ציבורי לציבור הרחב. האתר אינו גוף מסחרי, אינו מפיק רווחים, ואינו ממומן, נתמך או מופעל על ידי מפלגה, סיעה, מועמד או מטה בחירות כלשהו.
                  </p>
                </div>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    1. מעמד משפטי ושקיפות בבחירות (סעיף 2א1 לחוק הבחירות)
                  </h2>
                  <p>
                    בהתאם להוראות סעיף 2א1 לחוק הבחירות (דרכי תעמולה), תשי"ט-1959, מובהר בזאת במפורש כי PoliDash הוא מיזם מידע עצמאי ובלתי תלוי לחלוטין. האתר אינו מקבל מימון פוליטי מכל סוג שהוא, אינו פועל מטעם רשימה או מועמד המתמודדים לכנסת, ואינו מהווה תעמולת בחירות מפלגתית או מסחרית. כל הצגת המידע נועדה לשירות הציבור, להגברת השקיפות ולמחקר בלבד.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    2. פרסום סקרי דעת קהל (סעיף 16ח לחוק הבחירות)
                  </h2>
                  <p>
                    PoliDash **אינו עורך סקרים משל עצמו**. האתר משמש כמנוע אגרגציה סטטיסטי המרכז ומציג סקרי דעת קהל שפורסמו כחוק בכלי התקשורת המרכזיים בישראל על ידי מכוני מחקר מוסמכים (מדגם/קנטאר/דיירקט פולס/לזר מחקרים).
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    בהתאם לסעיף 16ח לחוק הבחירות (דרכי תעמולה): לצד כל סקר המוצג באתר מופיעים נתוני המקור – שם מכון המחקר, הגוף המזמין, מועדי עבודת השדה, גודל המדגם וטעות הדגימה המרבית. ממוצע פולידאש המשוקלל הוא מודל מתמטי עצמאי המבוסס על סקרים שפורסמו, ואינו מהווה תחזית ודאית או התחייבות לתוצאות הבחירות בפועל.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    3. היעדר ייעוץ פוליטי או המלצה להצבעה (שאלון ההתאמה ומנועי ההשוואה)
                  </h2>
                  <p>
                    הכלים האינטראקטיביים באתר (לרבות שאלון ההתאמה הפוליטית, מנוע דיאגרמות וון ובונה הקואליציות) מהווים כלי המחשה חינוכיים בלבד. **השאלון אינו מהווה ייעוץ פוליטי, המלצה למי להצביע, או תמיכה במועמד או במפלגה כלשהם**.
                  </p>
                  <p>
                    ההתאמות מחושבות באמצעות אלגוריתם מתמטי שמשווה בין תשובות המשתמש לבין עמדות מפלגתיות רשמיות שהוצהרו בפומבי. שיקול הדעת והאחריות הבלעדית בעת ההצבעה בקלפי נתונים בידי המצביע בלבד.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    4. אי-תלות בוועדת הבחירות המרכזית (מדריך ההצבעה)
                  </h2>
                  <p>
                    המידע המוצג במדריך ההצבעה ("איך מצביעים", פתקי ההצבעה, ואחוזי החסימה) נועד להעשרה ולחינוך אזרחי בלבד. פולידאש אינו ועדת הבחירות המרכזית לכנסת ואינו מוסמך לקבוע כללים מחייבים.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    למידע רשמי ומחייב, בירור מיקום הקלפי האישית, זכאות הצבעה, רשימת הפתקים המאושרים ודיני הבחירות – יש לפנות לאתר הרשמי של ועדת הבחירות המרכזית בכתובת: <a href="https://www.bechirot.gov.il" target="_blank" rel="noreferrer" className="text-secondary font-bold underline">bechirot.gov.il</a>.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    5. איסור לשון הרע, תום לב וזכות תגובה (נוהל הודעה והסרה)
                  </h2>
                  <p>
                    עמדות המועמדים וסיכומי המדיניות המוצגים באתר מבוססים על מקורות גלויים, מצעי מפלגות רשמיים, פרוטוקולי הכנסת ופרסומים עיתונאיים מהימנים, ומוגשים בתום לב מוחלט במסגרת הבעת דעה על אישי ציבור ודיווח עובדתי (סעיפים 14 ו-15 לחוק איסור לשון הרע, תשכ"ה-1965).
                  </p>
                  <p>
                    אנו מפעילים <a href="#/reply" className="text-secondary font-bold underline">נוהל הודעה והסרה וזכות תגובה</a> מהיר ופתוח לכל מועמד, מפלגה או אזרח. כל פנייה בנוגע לאי-דיוק, שינוי עמדה רשמי או בקשת הבהרה נבדקת ונבחנת מול מקורות רשמיים בתוך 72 שעות.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    6. הגנת הפרטיות ואי-איסוף מידע רגיש (תיקון 13)
                  </h2>
                  <p>
                    על פי חוק הגנת הפרטיות, התשמ"א-1981 (לרבות תיקון מס' 13), דעות פוליטיות והעדפות הצבעה מוגדרות כ**מידע רגיש**. אתר פולידאש אינו אוסף, אינו משדר לשרתים חיצוניים, ואינו שומר במסד נתונים את תשובות המשתמשים לשאלון. החישוב מתבצע כולו במכשירך האישי (Client-side בלבד).
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    7. זכויות יוצרים, שימוש הוגן וייחוס מאגרי מידע
                  </h2>
                  <p>
                    השימוש בציטוטים, תמונות מועמדים ברשות הציבור (ויקישיתוף), וסמלי מפלגות נעשה במסגרת עקרון השימוש ההוגן (סעיף 19 לחוק זכות יוצרים, תשס"ח-2007) למטרות מחקר, ביקורת, סקירה והוראה אקדמית ללא מטרת רווח. נתוני המפות מבוססים על OpenStreetMap (רישיון ODbL) ו-CARTO, תוצאות הבחירות ההיסטוריות מבוססות על פרסומי ועדת הבחירות המרכזית, ונתוני האשכולות החברתיים-כלכליים מקורם בלשכה המרכזית לסטטיסטיקה (למ"ס).
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    8. הגבלת אחריות ושימוש "כמות שהוא" (AS IS)
                  </h2>
                  <p>
                    האתר, התכנים, הנתונים והכלים המוצגים בו ניתנים לשימוש "כמות שהם" (AS IS) ו"כפי שהם זמינים" (AS AVAILABLE), ללא כל מצג, אחריות מפורשת או מכללא. מפעילי האתר הסטודנטיאלי אינם נושאים באחריות לכל נזק ישיר, עקיף או תוצאתי שעלול להיגרם עקב הסתמכות על הנתונים או השימוש באתר. הדין החל על תנאי שימוש אלה הוא הדין הישראלי, וסמכות השיפוט הבלעדית נתונה לבתי המשפט המוסמכים במחוז תל אביב-יפו.
                  </p>
                </section>
              </>
            ) : (
              // English Content
              <>
                <div className="bg-amber-50/70 dark:bg-amber-950/30 border-s-4 border-amber-500 p-4 rounded-r-xl text-xs md:text-sm text-amber-900 dark:text-amber-200 space-y-1">
                  <p className="font-bold">
                    Core Notice: Academic, Non-Profit Student Project
                  </p>
                  <p>
                    PoliDash is developed and operated strictly as an **independent, non-profit academic student project** for educational, civic literacy, and university research purposes. It is not a commercial enterprise, generates no revenue, and is not funded, sponsored, or operated by any political candidate, party list, or election campaign.
                  </p>
                </div>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    1. Independence & Non-Partisan Status (Section 2A1, Elections Law)
                  </h2>
                  <p>
                    Pursuant to Section 2A1 of the Israeli Elections Law (Propaganda Methods) 5719-1959, PoliDash is an independent civic education platform. We receive zero political funding, represent no political slate or candidate, and do not publish commercial or paid election propaganda. All content is provided solely for public education, non-profit research, and democratic transparency.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    2. Polling Aggregation Transparency (Section 16H, Elections Law)
                  </h2>
                  <p>
                    PoliDash **does not conduct proprietary opinion polls**. The platform functions as a mathematical aggregation engine that tracks published public opinion surveys conducted by accredited Israeli polling institutes (Midgam, Kantar, Lazar Research, Direct Polls) and broadcast by licensed news networks.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pursuant to Section 16H of the Elections Law: All surveys displayed indicate the original pollster, commissioning media outlet, sample size, fieldwork dates, and statistical margin of error. The PoliDash weighted average is a mathematical aggregation and does not constitute a prediction or guarantee of actual election outcomes.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    3. No Voting Advice or Endorsement (Quiz & Visual Alignment Tools)
                  </h2>
                  <p>
                    The interactive tools on PoliDash (including the Alignment Quiz, Venn Engine, and Coalition Builder) are educational visualization models. **The quiz does not constitute voting advice, an endorsement of any candidate or party, or instructions on how to cast a ballot.**
                  </p>
                  <p>
                    Matches are computed via mathematical alignment between user answers and publicly declared party manifestos. All voting decisions remain the sole and exclusive responsibility of the individual voter.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    4. Disassociation from the Central Elections Committee (Civic Guide)
                  </h2>
                  <p>
                    The Voting Guide provided on PoliDash is an informational summary created for civic educational purposes. PoliDash is not the Israeli Central Elections Committee (CEC) and has no official authority.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    For legally binding voting instructions, voter registry queries, polling station locators, and official ballot slips, citizens should consult the official government portal at <a href="https://www.bechirot.gov.il" target="_blank" rel="noreferrer" className="text-secondary font-bold underline">bechirot.gov.il</a>.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    5. Defamation Law, Public Figures & Statutory Right of Reply
                  </h2>
                  <p>
                    Candidate profiles, stance ratings, and policy summaries reflect verified public voting logs, parliamentary records, and official party manifestos. These are synthesized in good faith for public review of public figures (Sections 14 and 15 of the Defamation Law 5725-1965).
                  </p>
                  <p>
                    We maintain an expedited <a href="#/reply" className="text-secondary font-bold underline">Notice and Takedown & Right of Reply protocol</a>. Candidates, parties, or citizens may report factual discrepancies or context updates, which our editorial student team reviews against primary records within 72 hours.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    6. Privacy Protection & Zero Sensitive Data Storage (Amendment 13)
                  </h2>
                  <p>
                    Under Israeli Privacy Protection Law (including Amendment No. 13), political views constitute **sensitive personal data**. PoliDash does not record, transmit, or store quiz responses or political alignments on remote servers. All calculations execute strictly in your local device browser memory.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    7. Copyright, Fair Use & Open Data Citations
                  </h2>
                  <p>
                    Quotations, party logos, and candidate public domain photos (Wikimedia Commons) are utilized under the Fair Use doctrine (Section 19 of the Copyright Law 5768-2007) for non-profit academic research, reporting, and civic education. Map data is derived from OpenStreetMap (ODbL) and CARTO; historical election returns originate from the Central Elections Committee; and socioeconomic clusters are published by the Central Bureau of Statistics (CBS).
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    8. Limitation of Liability & "AS IS" Provision
                  </h2>
                  <p>
                    The website, data, tools, and content are provided strictly "AS IS" and "AS AVAILABLE" without warranties of any kind, whether express or implied. The student creators and operators disclaim all liability for any direct, indirect, incidental, or consequential damages resulting from reliance on the platform. These terms are governed solely by Israeli law, and exclusive jurisdiction is granted to the competent courts of Tel Aviv-Yafo, Israel.
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

export default Terms;
