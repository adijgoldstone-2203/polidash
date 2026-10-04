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
                    אתר פולידאש (PoliDash) פותח ומופעל אך ורק כ<strong>פרויקט סטודנטיאלי אקדמי עצמאי וללא כוונת רווח</strong>, למטרות מחקר אקדמי, חינוך אזרחי והנגשת מידע ציבורי לציבור הרחב. האתר אינו גוף מסחרי, אינו מפיק רווחים, ואינו ממומן, נתמך או מופעל על ידי מפלגה, סיעה, מועמד או מטה בחירות כלשהו.
                  </p>
                </div>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    1. מטרת מידע כללי בלבד והיעדר ייעוץ מקצועי
                  </h2>
                  <p>
                    כל התכנים, הכלים והנתונים באתר PoliDash ניתנים אך ורק למטרות מידע כללי, מחקר אקדמי וחינוך אזרחי. דבר בפלטפורמה זו אינו מהווה ייעוץ משפטי, פיננסי, פוליטי, אלקטורלי או ייעוץ מקצועי מכל סוג שהוא, ואין להסתמך על תכני האתר כתחליף למחקר עצמאי, בדיקה ביקורתית או התייעצות עם גורמי מקצוע מוסמכים.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    2. עצמאות פוליטית, היעדר מימון ושקיפות (סעיף 2א1 לחוק הבחירות)
                  </h2>
                  <p>
                    PoliDash הוא מיזם סטודנטיאלי אקדמי עצמאי ובלתי תלוי לחלוטין. האתר אינו קשור, אינו מופעל מטעם, אינו מאושר, ממומן או נתמך על ידי מפלגה פוליטית, סיעה, רשימה לכנסת, מועמד, מטה בחירות, גוף ממשלתי או כלי תקשורת כלשהו, ואינו מקבל תרומות או מימון פוליטי מכל גורם שהוא.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    בהתאם להוראות סעיף 2א1 לחוק הבחירות (דרכי תעמולה), תשי״ט-1959: האתר אינו מהווה תעמולת בחירות מפלגתית או מודעה בתשלום. שמות מפלגות, אותיות פתקי הצבעה, סמלילים (לוגואים), מצעים וציטוטים מוצגים אך ורק לשם זיהוי, מחקר, שקיפות ופרשנות אזרחית לציבור הרחב.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    3. היעדר ייעוץ הצבעה, המלצה או תמיכה פוליטית
                  </h2>
                  <p>
                    PoliDash אינו ממליץ, אינו תומך, אינו מתנגד ואינו מייעץ בעד או נגד מפלגה, רשימה, מועמד, קואליציה או פתק הצבעה כלשהו.
                  </p>
                  <p>
                    שאלון ההתאמה האזרחית (Civic Alignment Quiz), בונה הקואליציות (Coalition Builder), מנוע דיאגרמות וון, ניתוחי הספקטרום הפוליטי וכל כלי ההשוואה והסימולציה באתר מהווים כלי המחשה חינוכיים בלבד. הפלטים, הציונים ואחוזי ההתאמה אינם מהווים תחזיות, המלצות או הנחיות כיצד להצביע. שיקול הדעת והאחריות הבלעדית בבחירת פתק ההצבעה בקלפי נתונים בידי האזרח המצביע בלבד.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    4. תוכן שנוצר בבינה מלאכותית (AI) ומגבלות טכנולוגיות
                  </h2>
                  <p>
                    חלקים מפלטפורמה זו, לרבות תקצירי &ldquo;AI Intelligence Synthesis&rdquo; (סיכומי עמדות וסקירות מועמדים), נוצרים או מתומצתים באמצעות מודלים ממוחשבים של בינה מלאכותית (AI).
                  </p>
                  <p>
                    תוצרי בינה מלאכותית עלולים להכיל שגיאות, השמטות, מידע שאינו עדכני, אפיונים שגויים או הזיות מודל (&ldquo;hallucinations&rdquo;), וייתכן שאינם משקפים במדויק את עמדותיהם בפועל של מועמדים או מפלגות. סיכומי ה-AI אינם מייצגים את עמדות מפעילי PoliDash, ויש לאמת כל נתון באופן עצמאי מול מקורות ראשוניים.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    5. סיווג עמדות מדיניות כפרשנות עריכתית בלבד
                  </h2>
                  <p>
                    תוויות סיווג כגון &ldquo;תומך&rdquo;, &ldquo;מתנגד&rdquo; ו-&ldquo;עמום / לא הוכרע&rdquo; (Support / Oppose / Ambiguous) משקפות את הפרשנות העריכתית של PoliDash למקורות הציבוריים שהיו זמינים בנקודת זמן נתונה.
                  </p>
                  <p>
                    סיווגים אלה מהווים פישוט אנליטי של עמדות פוליטיות מורכבות, רב-ממדיות ודינמיות; הם עשויים להיות שנויים במחלוקת ואין לראות בהם קביעות עובדתיות סופיות, מוחלטות או מחייבות של עמדות מנהיג או מפלגה.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    6. נתוני סקרים, מודלים סטטיסטיים וטעות דגימה (סעיף 16ח לחוק הבחירות)
                  </h2>
                  <p>
                    PoliDash <strong>אינו עורך סקרים משל עצמו</strong>. נתוני הסקרים מרוכזים מסקרים שפורסמו כדין בכלי התקשורת בישראל על ידי מכוני מחקר מוסמכים (מדגם, קנטאר, דיירקט פולס, לזר מחקרים) ומוצגים למטרות עיון ומחקר אקדמי.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ממוצעי פולידאש המשוקללים, מודלי דעיכת הזמן (Time-decay) ותרחישי חלוקת המנדטים הם סימולציות מתמטיות הכפופות לטעויות דגימה סטטיסטיות ולהנחות מתודולוגיות. הם אינם מהווים תחזית, הבטחה או התחייבות לתוצאות הבחירות בפועל. בהתאם לסעיף 16ח לחוק הבחירות (דרכי תעמולה), לצד כל סקר מוצגים פרטי המקור: שם מכון המחקר, הגוף המזמין, מועדי עבודת השדה, גודל המדגם וטעות הדגימה המרבית. פולידאש אינו אחראי למתודולוגיה או לדיוק הנתונים של מכוני המחקר החיצוניים.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    7. דיוק, שלמות ושינוי עמדות פוליטיות לאורך זמן
                  </h2>
                  <p>
                    על אף ש-PoliDash שואף לרכז מידע ציבורי מאומת, מצעים רשמיים, פרוטוקולים פרלמנטריים וסקרים שפורסמו, מפעילי האתר אינם מציגים כל מצג ואינם מעניקים אחריות מפורשת או מכללא לגבי הדיוק, השלמות, העדכניות, המהימנות או ההתאמה למטרה כלשהי של תוכני האתר.
                  </p>
                  <p>
                    עמדות פוליטיות, פרטים ביוגרפיים, מבנה הרשימות ומצעי המפלגות משתנים ומתפתחים באופן תדיר לאורך זמן, ועשויים להתעדכן או להתחלף ללא הודעה מוקדמת.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    8. אי-תלות בוועדת הבחירות המרכזית (מדריך ההצבעה)
                  </h2>
                  <p>
                    המידע המוצג במדריך ההצבעה (&ldquo;איך מצביעים&rdquo;, פתקי ההצבעה, הסכמי עודפים ואחוז החסימה) נועד להעשרה ולחינוך אזרחי בלבד. PoliDash אינו ועדת הבחירות המרכזית לכנסת ואינו רשות ממשלתית רשמית.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    למידע רשמי ומחייב, בירור מיקום הקלפי האישית, בדיקת זכאות הצבעה, רשימת הפתקים המאושרים ודיני הבחירות – יש לפנות לאתר הרשמי של ועדת הבחירות המרכזית בכתובת: <a href="https://www.bechirot.gov.il" target="_blank" rel="noreferrer" className="text-secondary font-bold underline">bechirot.gov.il</a>.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    9. זכות תגובה ונוהל הודעה והסרה (בתוך 72 שעות)
                  </h2>
                  <p>
                    PoliDash מפעיל מנגנון זכות תגובה ונוהל הודעה והסרה שקוף ומהיר, המאפשר לנציגי מפלגות, מועמדים, גורמי ציבור ואזרחים להגיש בקשות תיקון, עדכון עמדות רשמיות או הבהרות עובדתיות.
                  </p>
                  <p>
                    התכנים באתר משקפים את המידע שהיה זמין בעת פרסומו. פניות המוגשות באמצעות <a href="#/reply" className="text-secondary font-bold underline">דף זכות התגובה ונוהל הודעה והסרה</a> נבדקות מול מקורות רשמיים ורשומות גלויות בתוך 72 שעות ממועד קבלתן.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    10. היעדר כוונת לשון הרע, אמת בדיווח ותום לב (סעיפים 14 ו-15)
                  </h2>
                  <p>
                    התכנים באתר מוגשים כסינתזה אובייקטיבית וכהבעת דעה הוגנת על עניינים ציבוריים בעלי חשיבות עליונה הנוגעים לדמויות ציבוריות המתמודדות על הנהגת המדינה. כל הנתונים נשענים על מצעים רשמיים, הצבעות מתועדות בכנסת, פרוטוקולים ופרסומים עיתונאיים מהימנים.
                  </p>
                  <p>
                    אין בפרסום כל כוונה לפגוע, להשמיץ או להציג מצג שווא כלפי אדם או ארגון כלשהו. הפרסום נעשה בתום לב מוחלט, ללא כוונת זדון, ותחת ההגנות הקבועות בסעיפים 14 (&ldquo;אמת בפרסום&rdquo;) ו-15 (&ldquo;תום לב בהבעת דעה על אישי ציבור&rdquo;) לחוק איסור לשון הרע, תשכ״ה-1965.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    11. מקורות צד שלישי וקישורים חיצוניים
                  </h2>
                  <p>
                    הפניות ומראי מקום למקורות חיצוניים (לרבות כלי תקשורת, אתרי מפלגות רשמיים, מאגרים אנציקלופדיים וספריות חוק) מובאים לצורכי ייחוס, שקיפות ונוחות המשתמש בלבד.
                  </p>
                  <p>
                    PoliDash אינו מפקח, אינו שולט ואינו נושא באחריות לתכנים, לדיוק, למדיניות הפרטיות או לזמינות של מקורות צד שלישי או אתרים מקושרים אלה, וציון הקישור אינו מהווה מתן חסות או תמיכה בתכניהם.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    12. קניין רוחני, שימוש הוגן וייחוס מאגרי מידע (סעיף 19)
                  </h2>
                  <p>
                    השימוש בציטוטים, תמציות טקסט, סמלי מפלגות ותמונות מועמדים ברשות הציבור (כגון ויקישיתוף) נעשה במסגרת עקרון השימוש ההוגן (סעיף 19 לחוק זכות יוצרים, תשס״ח-2007) למטרות מחקר, ביקורת, סקירה והוראה אקדמית ללא כוונת רווח.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    כל הסימנים המסחריים, השמות המסחריים, הסמלילים וזכויות היוצרים שייכים לבעליהם החוקיים. נתוני המפות מבוססים על OpenStreetMap (רישיון ODbL) ו-CARTO; תוצאות הבחירות ההיסטוריות מבוססות על פרסומי ועדת הבחירות המרכזית; ונתוני האשכולות החברתיים-כלכליים מקורם בלשכה המרכזית לסטטיסטיקה (למ״ס).
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    13. הגנת הפרטיות ואי-איסוף מידע רגיש (תיקון 13 לחוק הגנת הפרטיות)
                  </h2>
                  <p>
                    על פי חוק הגנת הפרטיות, התשמ״א-1981 (לרבות תיקון מס׳ 13), דעות פוליטיות והעדפות הצבעה מוגדרות כ<strong>מידע רגיש</strong>.
                  </p>
                  <p>
                    שאלון ההתאמה האזרחית וכל הכלים האינטראקטיביים באתר פועלים באופן מלא בצד הלקוח (Client-Side בלבד) על גבי מכשיר המשתמש. תשובות השאלון והעמדות הפוליטיות הנגזרות מהן אינן נשמרות, אינן מנוטרות ואינן משודרות לשרתים חיצוניים או למאגרי מידע כלשהם. המשתמש נושא באחריות הבלעדית לאבטחת הדפדפן והמכשיר שבאמצעותו הוא גולש.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    14. הגבלת אחריות ושימוש &ldquo;כמות שהוא&rdquo; (AS IS)
                  </h2>
                  <p>
                    האתר, כל התכנים, הנתונים, האלגוריתמים והכלים המוצגים בו ניתנים לשימוש &ldquo;כמות שהם&rdquo; (AS IS) ו-&ldquo;כפי שהם זמינים&rdquo; (AS AVAILABLE), ללא כל מצג, התחייבות או אחריות מכל סוג שהוא, מפורשת או מכללא.
                  </p>
                  <p>
                    במידה המרבית המותרת על פי דין, PoliDash, מפתחיו הסטודנטיאליים, מפעיליו והתורמים לו פטורים לחלוטין מכל אחריות לכל נזק ישיר, עקיף, מקרי, תוצאתי, עונשי או מיוחד שייגרם כתוצאה מהשימוש באתר, מאי-יכולת להשתמש בו, או מהסתמכות על תכניו או על תוצרי כלי ההשוואה והבינה המלאכותית.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    15. שינויים בתנאים, דין חל וסמכות שיפוט בלעדית
                  </h2>
                  <p>
                    PoliDash שומר לעצמו את הזכות לשנות, לעדכן, להוסיף או להסיר כל תוכן, כלי, סעיף או הבהרה משפטית באתר בכל עת וללא צורך בהודעה מוקדמת. המשך השימוש באתר לאחר פרסום שינויים כאמור מהווה הסכמה מלאה ובלתי חוזרת לתנאים המעודכנים.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    על תנאי שימוש אלה, על ההבהרות המשפטיות ועל כל שימוש באתר חלים אך ורק דיניה של מדינת ישראל. סמכות השיפוט הבלעדית והייחודית בכל סכסוך, תביעה או מחלוקת הנובעים מהאתר או הנוגעים לו נתונה לבתי המשפט המוסמכים בעיר תל אביב-יפו בלבד.
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
                    PoliDash is developed and operated strictly as an <strong>independent, non-profit academic student project</strong> for educational, civic literacy, and university research purposes. It is not a commercial enterprise, generates no revenue, and is not funded, sponsored, or operated by any political candidate, party list, or election campaign.
                  </p>
                </div>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    1. General Informational Purpose Only
                  </h2>
                  <p>
                    All content, tools, and data on PoliDash are provided solely for general informational, academic, and civic-educational purposes. Nothing on this platform constitutes legal, financial, electoral, political, or professional advice of any kind, and it should not be relied upon as a substitute for independent research, critical verification, or professional consultation.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    2. Political Independence & Campaign Transparency (Section 2A1, Elections Law)
                  </h2>
                  <p>
                    PoliDash is an independent, non-profit academic student project. It is not affiliated with, authorized by, sponsored by, or connected to any political party, candidate, campaign committee, government body, or commercial media outlet, and it receives zero political or partisan funding.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pursuant to Section 2A1 of the Israeli Elections Law (Propaganda Methods) 5719-1959: PoliDash is not partisan election propaganda or paid advertising. Any party names, ballot letters, logos, and quotations are displayed strictly for public identification, academic research, transparency, and civic commentary.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    3. No Voting Advice or Endorsements
                  </h2>
                  <p>
                    PoliDash does not recommend, endorse, oppose, or advise for or against any political party, candidate, list, coalition, or ballot choice.
                  </p>
                  <p>
                    The Civic Alignment Quiz, Coalition Builder, Venn diagram engine, spectrum analyses, and all comparative and simulation tools are illustrative educational instruments only. Their algorithmic outputs, scores, and match percentages are not predictions, recommendations, endorsements, or instructions on how to vote. All voting decisions remain the sole and exclusive responsibility of the individual citizen.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    4. AI-Generated Content & Technical Limitations (Hallucinations)
                  </h2>
                  <p>
                    Portions of this platform, including the &ldquo;AI Intelligence Synthesis&rdquo; candidate overviews and policy summaries, are generated or synthesized using automated artificial intelligence (AI) models.
                  </p>
                  <p>
                    AI output may contain errors, omissions, outdated information, mischaracterizations, or model &ldquo;hallucinations,&rdquo; and may not accurately reflect any individual&rsquo;s or party&rsquo;s actual real-world positions. AI summaries do not represent the editorial stance or personal views of PoliDash and should always be independently verified against primary source records.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    5. Policy Stance Classifications as Editorial Interpretation
                  </h2>
                  <p>
                    Labels such as &ldquo;Support,&rdquo; &ldquo;Oppose,&rdquo; and &ldquo;Ambiguous&rdquo; reflect PoliDash&rsquo;s editorial interpretation of publicly available sources at a specific point in time.
                  </p>
                  <p>
                    These classifications are analytical simplifications of complex, multi-faceted, and evolving political positions; they may be subject to debate and contestation, and should not be treated as definitive or authoritative factual statements of any leader&rsquo;s or party&rsquo;s comprehensive views.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    6. Polling Data Aggregation, Projections & Margins of Error (Section 16H, Elections Law)
                  </h2>
                  <p>
                    PoliDash <strong>does not conduct proprietary public opinion polls</strong>. Polling figures are reproduced for academic reference from public surveys conducted by accredited polling institutes (such as Midgam, Kantar, Direct Polls, Lazar Research) and broadcast by licensed Israeli media outlets.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    The weighted averages, seat projections, time-decay adjustments, and baseline allocations are mathematical simulations subject to statistical sampling errors and methodological assumptions. They are not forecasts, guarantees, or predictions of any electoral outcome. Pursuant to Section 16H of the Israeli Elections Law (Propaganda Methods), each displayed survey discloses the polling institute, commissioning media body, fieldwork dates, sample size, and maximum margin of error. PoliDash is not responsible for the methodology, execution, or statistical accuracy of third-party pollsters.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    7. Accuracy, Completeness & Evolution of Stances Over Time
                  </h2>
                  <p>
                    While PoliDash strives to aggregate verified public records, official party platforms, parliamentary transcripts, and published polling, it makes no representation or warranty, express or implied, regarding the accuracy, completeness, currency, reliability, or fitness for any purpose of any content.
                  </p>
                  <p>
                    Political positions, biographical details, candidate lists, and party platforms evolve dynamically over time and may be superseded, revised, or abandoned without prior notice.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    8. Disassociation from the Central Elections Committee (Civic Guide)
                  </h2>
                  <p>
                    The voting information presented on PoliDash (including voting day guidelines, ballot slips, surplus-vote agreements, and electoral thresholds) is provided solely for civic educational enrichment. PoliDash is not affiliated with the Israeli Central Elections Committee (CEC) and carries no statutory authority.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    For legally binding instructions, voter registry queries, polling station locations, approved ballot slips, and statutory election procedures, citizens must consult the official government portal at <a href="https://www.bechirot.gov.il" target="_blank" rel="noreferrer" className="text-secondary font-bold underline">bechirot.gov.il</a>.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    9. Statutory Right of Reply & Notice-and-Takedown Protocol (72 Hours)
                  </h2>
                  <p>
                    PoliDash operates an expedited Right of Reply (נוהל הודעה והסרה) and correction mechanism, enabling political parties, candidates, public representatives, and citizens to submit updates, verified corrections, or formal position clarifications.
                  </p>
                  <p>
                    Content reflects public information available prior to any submission. Inquiries submitted via the platform&rsquo;s <a href="#/reply" className="text-secondary font-bold underline">Right of Reply and Notice-and-Takedown portal</a> are reviewed against primary records and resolved within 72 hours where appropriate.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    10. Absence of Defamatory Intent & Good Faith Fair Comment (Sections 14 & 15, Defamation Law)
                  </h2>
                  <p>
                    Platform content is presented as objective synthesis, civic commentary, and fair comment on matters of substantial public concern regarding public figures seeking democratic office. All profiles are constructed from official party manifestos, parliamentary voting records, transcripts, and established media reports.
                  </p>
                  <p>
                    No statement is intended to defame, disparage, malign, or mischaracterize any individual or organization. Publication is conducted in good faith without malice, in accordance with the protections of Sections 14 (&ldquo;Truth in Publication&rdquo;) and 15 (&ldquo;Good Faith Fair Comment on Public Figures&rdquo;) of the Israeli Defamation Law 5725-1965.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    11. Third-Party Sources and External Links
                  </h2>
                  <p>
                    Citations and links to external resources (including news organizations, official party portals, encyclopedic repositories, and public databases) are provided strictly for attribution and user convenience.
                  </p>
                  <p>
                    PoliDash does not control, supervise, or endorse, and is not responsible for the content, factual accuracy, privacy practices, or availability of any third-party website or external source, and inclusion does not imply affiliation or sponsorship.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    12. Intellectual Property, Fair Use & Data Attribution (Section 19, Copyright Law)
                  </h2>
                  <p>
                    Quotations, party logos, policy excerpts, and public domain candidate imagery (Wikimedia Commons) are utilized under the Fair Use doctrine (Section 19 of the Israeli Copyright Law 5768-2007) for non-profit academic research, reporting, criticism, and civic education.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    All trademarks, campaign names, symbols, and copyrights remain the exclusive property of their respective owners. Geographic map data is derived from OpenStreetMap (ODbL) and CARTO; historical electoral returns originate from Central Elections Committee records; and socioeconomic municipal cluster data is sourced from the Central Bureau of Statistics (CBS).
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    13. Privacy Protection & Zero Sensitive Data Logging (Amendment 13)
                  </h2>
                  <p>
                    Under the Israeli Privacy Protection Law 5741-1981 (including Amendment No. 13), political views and voting choices constitute <strong>sensitive personal data</strong>.
                  </p>
                  <p>
                    The Civic Alignment Quiz and associated interactive tools operate entirely client-side within the user&rsquo;s local browser memory. Quiz responses and inferred political orientations are never logged, stored in databases, or transmitted to remote servers. Users remain responsible for their own local device and browser security.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    14. Limitation of Liability & &ldquo;AS IS&rdquo; Provision
                  </h2>
                  <p>
                    The platform and all content, algorithms, models, and tools are provided strictly &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE,&rdquo; without warranties of any kind, whether express or implied.
                  </p>
                  <p>
                    To the fullest extent permitted by applicable law, PoliDash, its student developers, contributors, and operators disclaim all liability for any direct, indirect, incidental, consequential, punitive, or special damages arising out of the use of, inability to use, or reliance on the platform, its analytical models, or its AI-generated content.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-['Newsreader'] text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    15. Changes to Terms, Governing Law & Exclusive Jurisdiction
                  </h2>
                  <p>
                    PoliDash reserves the right to modify, update, append, or remove any content, tool, disclosure, or term of use at any time without prior notice. Continued access or use of the platform following the posting of modifications constitutes full and irrevocable acceptance of the revised terms.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    These disclaimers and terms of use are governed exclusively by the laws of the State of Israel. Exclusive jurisdiction over any dispute, claim, or controversy arising out of or relating to the platform is vested solely in the competent courts of Tel Aviv-Yafo, Israel.
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
