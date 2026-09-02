const fs = require('fs');
const cheerio = require('cheerio');

// Read existing polls.ts
const pollsTsContent = fs.readFileSync('src/polls.ts', 'utf8');

// Find existing poll IDs
const existingIds = new Set();
const idRegex = /id:\s*"([^"]+)"/g;
let match;
while ((match = idRegex.exec(pollsTsContent)) !== null) {
  existingIds.add(match[1]);
}

console.log(`Existing Poll IDs count in polls.ts: ${existingIds.size}`);

// Read madad_raw.html
const html = fs.readFileSync('madad_raw.html', 'utf8');
const $ = cheerio.load(html);

const rows = [];
$('table tr').each((i, el) => {
  const row = [];
  $(el).find('td, th').each((j, td) => {
    row.push($(td).text().trim());
  });
  if (row.length > 0) rows.push(row);
});

const headers = rows[0];

const partyMapping = {
  'הליכוד': 'Likud',
  'יהדות התורה': 'United Torah Judaism',
  'ש״ס': 'Shas',
  'ש"ס': 'Shas',
  'כחול לבן': 'Blue and White',
  'יש עתיד': 'Yesh Atid',
  'חדש תע״ל': "Hadash-Ta'al",
  'חד"ש תע"ל': "Hadash-Ta'al",
  'ישראל ביתנו': 'Yisrael Beiteinu',
  'הדמוקרטים': 'Democrats',
  'הדמוקרטים ': 'Democrats',
  'הציונות הדתית': 'Religious Zionist',
  'רע״מ': "Ra'am",
  'רע"ם': "Ra'am",
  'בל״ד': 'Balad',
  'עוצמה יהודית': 'Otzma Yehudit',
  'ביחד (בנט ולפיד)': 'Together (Bennett-Lapid)',
  'ישר!': 'Yashar!',
  'טרופר-הנדל': 'Trooper-Hendel',
  'המילואימניקים': 'Trooper-Hendel',
  'בית ציוני-המילואימניקים': 'Trooper-Hendel',
  'הרשימה המשותפת': 'Joint List',
  'עופר וינטר': 'Ofer Winter',
  'מפלגה בראשות גלעד ארדן ויולי אדלשטיין': 'Erdan-Edelstein',
  '‏רשימה ערבית מאוחדת': 'United Arab Party'
};

const newPolls = [];
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  if (!r || r.length < 5) continue;
  
  const poll = {};
  headers.forEach((h, idx) => {
    poll[h] = r[idx] || '';
  });
  
  const id = String(poll['מספרהסקר']).trim();
  if (!id || existingIds.has(id)) {
    continue; // Skip existing
  }
  
  // Format Date: DD/MM/YYYY
  const dateStr = poll['תאריך'];
  const parts = dateStr.split('/');
  if (parts.length !== 3) continue;
  
  const day = parts[0].padStart(2, '0');
  const month = parts[1].padStart(2, '0');
  const year = parts[2];
  const dateISO = `${year}-${month}-${day}`;
  
  // We only want polls strictly newer than the latest poll in polls.ts (2026-07-17)
  if (dateISO <= '2026-07-17') {
    continue;
  }
  
  const monthIdx = parseInt(month, 10) - 1;
  const monthName = monthNames[monthIdx] || 'Jul';
  const displayDate = `${monthName} ${parseInt(day, 10)}, ${year}`;
  
  const media = poll['כליתקשורת'] || 'סקר';
  const source = `${media} (${displayDate})`;
  
  const sampleSize = parseInt(poll['משיבים'], 10) || 500;
  
  const data = {};
  headers.slice(5).forEach(h => {
    const seats = parseInt(poll[h], 10);
    const engKey = partyMapping[h] || h.trim();
    if (engKey && seats > 0) {
      data[engKey] = seats;
    }
  });
  
  newPolls.push({
    id,
    source,
    date: displayDate,
    dateISO,
    sampleSize,
    data
  });
}

// Sort newPolls in descending order (newest first)
newPolls.sort((a, b) => b.id.localeCompare(a.id));

console.log(`Found ${newPolls.length} NEW polls since July 17, 2026:`);
console.dir(newPolls, { depth: null });
