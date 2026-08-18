const fs = require('fs');
const cheerio = require('cheerio');

// Read existing polls.ts
let pollsTsContent = fs.readFileSync('src/polls.ts', 'utf8');

// Find existing poll IDs
const existingIds = new Set();
const idRegex = /id:\s*"([^"]+)"/g;
let match;
while ((match = idRegex.exec(pollsTsContent)) !== null) {
  existingIds.add(match[1]);
}

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
    const engKey = partyMapping[h];
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

// Sort newest first
newPolls.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));

if (newPolls.length === 0) {
  console.log('No new polls to insert.');
  process.exit(0);
}

console.log(`Inserting ${newPolls.length} new polls into src/polls.ts...`);

// Format TS string for new polls
let formattedTs = '';
newPolls.forEach(p => {
  formattedTs += `  {\n`;
  formattedTs += `    id: "${p.id}",\n`;
  formattedTs += `    source: "${p.source}",\n`;
  formattedTs += `    date: "${p.date}",\n`;
  formattedTs += `    dateISO: "${p.dateISO}",\n`;
  formattedTs += `    sampleSize: ${p.sampleSize},\n`;
  formattedTs += `    data: {\n`;
  Object.entries(p.data).forEach(([key, val]) => {
    formattedTs += `      "${key}": ${val},\n`;
  });
  formattedTs += `    }\n`;
  formattedTs += `  },\n`;
});

const targetMarker = 'export const POLL_DATA: Poll[] = [\n';
const insertIndex = pollsTsContent.indexOf(targetMarker);

if (insertIndex === -1) {
  console.error('Error: Could not find marker in src/polls.ts');
  process.exit(1);
}

const newContent = pollsTsContent.slice(0, insertIndex + targetMarker.length) + formattedTs + pollsTsContent.slice(insertIndex + targetMarker.length);

fs.writeFileSync('src/polls.ts', newContent, 'utf8');
console.log(`Successfully updated src/polls.ts! Added poll IDs: ${newPolls.map(p => p.id).join(', ')}`);
