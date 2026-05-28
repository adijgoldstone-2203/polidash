import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

puppeteer.use(StealthPlugin());

const PARTY_MAP: Record<string, string> = {
  'הליכוד': 'Likud',
  'יהדות התורה': 'United Torah Judaism',
  'ש״ס': 'Shas',
  'כחול לבן': 'National Unity Party',
  'המחנה הממלכתי': 'National Unity Party',
  'יש עתיד': 'Yesh Atid',
  'חדש תע״ל': 'Hadash-Ta\'al',
  'ישראל ביתנו': 'Yisrael Beiteinu',
  'הדמוקרטים': 'Democrats',
  'הציונות הדתית': 'Religious Zionist',
  'רע״מ': 'United Arab List (Ra\'am)',
  '‏רשימה ערבית מאוחדת': 'United Arab List (Ra\'am)',
  'בל״ד': 'Balad',
  'עוצמה יהודית': 'Otzma Yehudit',
  'ביחד (בנט ולפיד)': 'Together (Bennett-Lapid)',
  'ישר!': 'Yashar!',
  'המילואימניקים': 'The Reservists'
};

// Function to convert DD/MM/YYYY to YYYY-MM-DD
function parseDateString(dateStr: string): string {
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
}

async function run() {
  console.log('🚀 Starting TheMadad Poll Scraper (Stealth Mode)...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
  });

  console.log('🌐 Navigating to https://themadad.com/allpolls/ ...');
  await page.goto('https://themadad.com/allpolls/', { waitUntil: 'networkidle2' });
  
  console.log('📄 Extracting HTML table...');
  const html = await page.content();
  await browser.close();
  
  const $ = cheerio.load(html);
  const rows: string[][] = [];
  
  $('table tr').each((_, el) => {
    const row: string[] = [];
    $(el).find('td, th').each((_, td) => {
      row.push($(td).text().trim());
    });
    if (row.length > 0) rows.push(row);
  });
  
  if (rows.length < 2) {
    console.error('❌ Failed to find data table. Cloudflare might be blocking the request.');
    process.exit(1);
  }
  
  const headers = rows[0];
  const pollsFile = path.join(process.cwd(), 'src/polls.ts');
  let currentContent = fs.readFileSync(pollsFile, 'utf8');
  
  // Default cutoff is exactly 1 year ago from today
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  let latestDate = oneYearAgo.toISOString().split('T')[0];

  // Extract latest date from existing polls
  const dateRegex = /date:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = dateRegex.exec(currentContent)) !== null) {
    const d = new Date(match[1]);
    if (!isNaN(d.getTime())) {
      const iso = d.toISOString().split('T')[0];
      if (iso > latestDate) latestDate = iso;
    }
  }
  
  console.log(`📊 Found latest poll date in local DB: ${latestDate}`);
  
  const newPolls: any[] = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 4) continue;
    
    // Row mapping: [0] ID, [1] Date, [2] Respondents, [3] Source, [4] Pollster, [5...] Parties
    const dateStr = row[1];
    const dateISO = parseDateString(dateStr);
    
    if (dateISO <= latestDate) {
      // Reached polls we already have
      break;
    }
    
    const source = row[3];
    const dateFormatted = new Date(dateISO).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const data: Record<string, number> = {};
    for (let j = 5; j < headers.length; j++) {
      const hebParty = headers[j];
      const val = parseInt(row[j], 10);
      if (!isNaN(val) && val > 0) {
        const engParty = PARTY_MAP[hebParty];
        if (engParty) {
          data[engParty] = val;
        } else {
          console.warn(`⚠️ Unknown party header: ${hebParty}`);
        }
      }
    }
    
    newPolls.push({
      id: row[0],
      source: `${source} (${dateFormatted})`,
      date: dateFormatted,
      dateISO: dateISO,
      data
    });
  }
  
  if (newPolls.length === 0) {
    console.log('✅ Local database is already up to date!');
    return;
  }
  
  console.log(`📥 Found ${newPolls.length} new polls to add!`);
  
  // Format new polls for insertion
  const newPollsString = newPolls.map(p => {
    let dataStr = '{\n';
    for (const [k, v] of Object.entries(p.data)) {
      dataStr += `      "${k}": ${v},\n`;
    }
    dataStr += '    }';
    
    return `  {
    id: "${p.id}",
    source: "${p.source}",
    date: "${p.date}",
    dateISO: "${p.dateISO}",
    data: ${dataStr}
  }`;
  }).join(',\n');
  
  // Inject into POLL_DATA array
  if (currentContent.includes('export const POLL_DATA: Poll[] = [];')) {
    currentContent = currentContent.replace(
      'export const POLL_DATA: Poll[] = [];',
      `export const POLL_DATA: Poll[] = [\n${newPollsString}\n];`
    );
  } else {
    const insertionPoint = 'export const POLL_DATA: Poll[] = [\n';
    currentContent = currentContent.replace(insertionPoint, `${insertionPoint}${newPollsString},\n`);
  }
  
  fs.writeFileSync(pollsFile, currentContent);
  console.log('🎉 Successfully updated src/polls.ts!');
}

run().catch(console.error);
