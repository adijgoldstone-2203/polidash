const fs = require('fs');

console.log('Renaming HaMiluimnikim to Trooper-Hendel across files...');

// 1. Update src/polls.ts
let polls = fs.readFileSync('src/polls.ts', 'utf8');
polls = polls.replaceAll('"HaMiluimnikim":', '"Trooper-Hendel":');
polls = polls.replaceAll('"HaMiluimnikim"', '"Trooper-Hendel"');
fs.writeFileSync('src/polls.ts', polls, 'utf8');
console.log('Updated src/polls.ts');

// 2. Update src/data.ts
let data = fs.readFileSync('src/data.ts', 'utf8');
data = data.replaceAll('"party": "HaMiluimnikim"', '"party": "Trooper-Hendel"');
data = data.replaceAll('leader of HaMiluimnikim (The Reservists)', 'leader of Trooper-Hendel');
data = data.replaceAll('HaMiluimnikim', 'Trooper-Hendel');
fs.writeFileSync('src/data.ts', data, 'utf8');
console.log('Updated src/data.ts');

// 3. Update src/i18n/data/en.ts
let en = fs.readFileSync('src/i18n/data/en.ts', 'utf8');
en = en.replaceAll('"HaMiluimnikim": "HaMiluimnikim"', '"Trooper-Hendel": "Trooper-Hendel",\n    "HaMiluimnikim": "Trooper-Hendel"');
en = en.replaceAll('leader of HaMiluimnikim (The Reservists)', 'leader of Trooper-Hendel');
en = en.replaceAll('HaMiluimnikim', 'Trooper-Hendel');
fs.writeFileSync('src/i18n/data/en.ts', en, 'utf8');
console.log('Updated src/i18n/data/en.ts');

// 4. Update src/i18n/data/he.ts
let he = fs.readFileSync('src/i18n/data/he.ts', 'utf8');
he = he.replaceAll('"HaMiluimnikim": "המילואימניקים"', '"Trooper-Hendel": "טרופר-הנדל",\n    "HaMiluimnikim": "טרופר-הנדל"');
he.replaceAll('תנועת המילואימניקים', 'רשימת טרופר-הנדל');
he = he.replaceAll('המילואימניקים', 'טרופר-הנדל');
fs.writeFileSync('src/i18n/data/he.ts', he, 'utf8');
console.log('Updated src/i18n/data/he.ts');

// 5. Update src/data/recent_statements.json
let st = fs.readFileSync('src/data/recent_statements.json', 'utf8');
st = st.replaceAll('"partyEn": "HaMiluimnikim"', '"partyEn": "Trooper-Hendel"');
st = st.replaceAll('"partyHe": "המילואימניקים"', '"partyHe": "טרופר-הנדל"');
fs.writeFileSync('src/data/recent_statements.json', st, 'utf8');
console.log('Updated src/data/recent_statements.json');

// 6. Update scripts
const scriptsToUpdate = ['add_new_polls.cjs', 'insert_new_polls.cjs', 'merge_new_polls.cjs', 'src/scripts/scrapeTheMadad.ts', 'src/scripts/generateEnData.ts'];
scriptsToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replaceAll("'HaMiluimnikim'", "'Trooper-Hendel'");
    content = content.replaceAll('"HaMiluimnikim"', '"Trooper-Hendel"');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

console.log('Done replacement!');
