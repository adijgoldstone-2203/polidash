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
  'ש"ס': 'Shas',
  'כחול לבן': 'Blue and White',
  'המחנה הממלכתי': 'National Unity Party',
  'יש עתיד': 'Yesh Atid',
  'חדש תע״ל': "Hadash-Ta'al",
  'חד"ש תע"ל': "Hadash-Ta'al",
  'ישראל ביתנו': 'Yisrael Beiteinu',
  'הדמוקרטים': 'Democrats',
  'הדמוקרטים ': 'Democrats',
  'הציונות הדתית': 'Religious Zionist',
  'רע״מ': "Ra'am",
  'רע"ם': "Ra'am",
  '‏רשימה ערבית מאוחדת': 'United Arab Party',
  'בל״ד': 'Balad',
  'עוצמה יהודית': 'Otzma Yehudit',
  'ביחד (בנט ולפיד)': 'Together (Bennett-Lapid)',
  'ישר!': 'Yashar!',
  'המילואימניקים': 'Trooper-Hendel',
  'טרופר-הנדל': 'Trooper-Hendel',
  'בית ציוני-המילואימניקים': 'Trooper-Hendel',
  'הרשימה המשותפת': 'Joint List',
  'עופר וינטר': 'Ofer Winter',
  'מפלגה בראשות גלעד ארדן ויולי אדלשטיין': 'Erdan-Edelstein'
};

// Function to convert DD/MM/YYYY to YYYY-MM-DD
function parseDateString(dateStr: string): string {
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
}

import { execSync } from 'child_process';

async function fetchHtml(): Promise<string> {
  console.log('🌐 Fetching https://themadad.com/allpolls/ via curl...');
  try {
    const html = execSync(
      'curl -s -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "https://themadad.com/allpolls/"',
      { encoding: 'utf8' }
    );
    if (html.includes('<table')) {
      return html;
    }
  } catch (err) {
    console.warn('⚠️ Direct curl fetch failed:', err);
  }
  throw new Error('Failed to fetch polls page HTML');
}

async function run() {
  console.log('🚀 Starting TheMadad Poll Scraper...');
  const html = await fetchHtml();
  console.log('📄 Extracting HTML table...');
  
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
  console.log('--- Scraped Headers ---', headers);
  console.log('--- Scraped Top Rows ---');
  for (let i = 1; i <= Math.min(5, rows.length - 1); i++) {
    console.log(`Row ${i}:`, rows[i]);
  }
  const pollsFile = path.join(process.cwd(), 'src/polls.ts');
  let currentContent = fs.readFileSync(pollsFile, 'utf8');
  
  // Default cutoff is Jan 1, 2025
  const cutoffDate = "2025-01-01";
  let latestDate = cutoffDate;

  // Extract latest date from existing polls
  const dateRegex = /dateISO:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = dateRegex.exec(currentContent)) !== null) {
    const iso = match[1];
    if (iso > latestDate) latestDate = iso;
  }

  // Extract all existing poll IDs
  const existingIds = new Set<string>();
  const idRegex = /id:\s*['"]([^'"]+)['"]/g;
  let idMatch;
  while ((idMatch = idRegex.exec(currentContent)) !== null) {
    existingIds.add(idMatch[1]);
  }
  
  console.log(`📊 Found latest poll date in local DB: ${latestDate}`);
  console.log(`📊 Found ${existingIds.size} existing polls in local DB`);
  
  const newPolls: any[] = [];
  const oneYearAgoStr = cutoffDate;
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 4) continue;
    
    // Row mapping: [0] ID, [1] Date, [2] Respondents, [3] Source, [4] Pollster, [5...] Parties
    const id = row[0];
    if (existingIds.has(id)) {
      continue;
    }
    
    const dateStr = row[1];
    const dateISO = parseDateString(dateStr);
    
    if (dateISO < oneYearAgoStr) {
      continue;
    }
    
    const source = row[3];
    const dateFormatted = new Date(dateISO).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const data: Record<string, number> = {};
    
    for (let j = 5; j < headers.length; j++) {
      const hebParty = headers[j];
      const val = parseInt(row[j], 10);
      if (!isNaN(val) && val > 0) {
        const engParty = PARTY_MAP[hebParty] || hebParty.trim();
        if (engParty) {
          data[engParty] = val;
        }
      }
    }
    
    const sampleSizeNum = parseInt(row[2], 10);
    const sampleSize = !isNaN(sampleSizeNum) && sampleSizeNum > 0 ? sampleSizeNum : undefined;

    newPolls.push({
      id: row[0],
      source: `${source} (${dateFormatted})`,
      date: dateFormatted,
      dateISO: dateISO,
      sampleSize,
      data
    });
  }
  
  if (newPolls.length === 0) {
    console.log('✅ Local database is already up to date!');
    return;
  }

  // Sort new polls descending by dateISO, then by id descending
  newPolls.sort((a, b) => {
    if (a.dateISO !== b.dateISO) {
      return b.dateISO.localeCompare(a.dateISO);
    }
    return parseInt(b.id, 10) - parseInt(a.id, 10);
  });
  
  console.log(`📥 Found ${newPolls.length} new polls to add!`);
  
  // Format new polls for insertion
  const newPollsString = newPolls.map(p => {
    let dataStr = '{\n';
    for (const [k, v] of Object.entries(p.data)) {
      dataStr += `      "${k}": ${v},\n`;
    }
    dataStr += '    }';
    
    const sampleSizeStr = p.sampleSize ? `\n    sampleSize: ${p.sampleSize},` : '';
    return `  {
    id: "${p.id}",
    source: "${p.source}",
    date: "${p.date}",
    dateISO: "${p.dateISO}",${sampleSizeStr}
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
