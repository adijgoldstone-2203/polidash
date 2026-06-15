import * as fs from 'fs';
import * as path from 'path';
import { politicians, ISSUE_DEFINITIONS } from '../data';

// We can run this file directly with tsx to generate src/i18n/data/en.ts
const enData = {
  partyNames: {
    "Likud": "Likud",
    "National Unity Party": "National Unity Party",
    "Blue and White": "Blue and White",
    "Yesh Atid": "Yesh Atid",
    "Yisrael Beiteinu": "Yisrael Beiteinu",
    "Shas": "Shas",
    "United Torah Judaism": "United Torah Judaism",
    "Otzma Yehudit": "Otzma Yehudit",
    "Religious Zionist": "Religious Zionist",
    "Democrats": "Democrats",
    "Ra'am": "Ra'am",
    "United Arab Party": "United Arab Party",
    "Hadash-Ta'al": "Hadash-Ta'al",
    "Together (Bennett-Lapid)": "Together (Bennett-Lapid)",
    "Yashar!": "Yashar!",
    "Bennett 2026": "Bennett 2026",
    "HaMiluimnikim": "HaMiluimnikim",
    "Balad (National Democratic Alliance)": "Balad (National Democratic Alliance)",
    "Labor": "Labour"
  },
  politicianNames: {
    "Benjamin Netanyahu": "Benjamin Netanyahu",
    "Naftali Bennett": "Naftali Bennett",
    "Benny Gantz": "Benny Gantz",
    "Gadi Eisenkot": "Gadi Eisenkot",
    "Yair Golan": "Yair Golan",
    "Aryeh Deri": "Aryeh Deri",
    "Mansour Abbas": "Mansour Abbas",
    "Yair Lapid": "Yair Lapid",
    "Yoaz Hendel": "Yoaz Hendel",
    "Ayman Odeh": "Ayman Odeh",
    "Yitzhak Goldknopf": "Yitzhak Goldknopf",
    "Itamar Ben Gvir": "Itamar Ben Gvir",
    "Avigdor Lieberman": "Avigdor Lieberman",
    "Sami Abu Shehadeh": "Sami Abu Shehadeh",
    "Bezalel Smotrich": "Bezalel Smotrich"
  },
  issueNames: {
    "Free Market Priority": "Free Market Priority",
    "Two-State Separation": "Two-State Separation",
    "Judicial Override": "Judicial Override",
    "Universal Enlistment": "Universal Enlistment",
    "State Commission (Oct 7)": "State Commission (Oct 7)",
    "Shabbat Public Transit": "Shabbat Public Transit",
    "West Bank Annexation": "West Bank Annexation",
    "Rabbinical Court Power": "Rabbinical Court Power",
    "Basic Law: Equality": "Basic Law: Equality"
  },
  intelligenceTopics: {
    "Gaza & Security": "Gaza & Security",
    "Cost of Living": "Cost of Living",
    "Judicial Reform": "Judicial Reform",
    "Haredi Draft": "Haredi Draft",
    "Religion & Public Space": "Religion & Public Space",
    "Arab-Israeli Integration": "Arab-Israeli Integration",
    "Palestinian Statehood": "Palestinian Statehood",
    "Internal Cohesion": "Internal Cohesion",
    "Settlements": "Settlements",
    "Foreign Relations": "Foreign Relations"
  },
  issueDefinitions: ISSUE_DEFINITIONS,
  stances: {
    "Support": "Support",
    "Oppose": "Oppose",
    "Ambiguous": "Ambiguous"
  },
  blocNames: {
    "Right/Religious": "Right/Religious",
    "Center/Left/Arab": "Centre/Left/Arab"
  },
  pollSources: {
    "מעריב": "Maariv",
    "כאן חדשות": "Kan News",
    "חדשות 12": "Channel 12 News",
    "חדשות 13": "Channel 13 News",
    "ערוץ 14": "Channel 14",
    "זמן ישראל": "Times of Israel",
    "ישראל היום": "Israel Hayom",
    "i24 news": "i24 News",
    "i24 News": "i24 News"
  },
  politicians: politicians.reduce((acc, p) => {
    acc[p.id] = {
      biography: p.biography,
      quote: p.quote,
      facts: p.facts,
      intelligence: p.intelligence
    };
    return acc;
  }, {} as Record<string, any>)
};

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '../i18n/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'en.ts'),
  `export const enData = ${JSON.stringify(enData, null, 2)};\n`
);

console.log('Successfully generated src/i18n/data/en.ts');
