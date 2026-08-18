const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const cheerio = require('cheerio');

(async () => {
  console.log('Launching browser with stealth plugin...');
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
  });

  console.log('Navigating to https://themadad.com/allpolls/ ...');
  await page.goto('https://themadad.com/allpolls/', { waitUntil: 'networkidle2' });
  
  const html = await page.content();
  fs.writeFileSync('madad_raw.html', html);
  console.log('Saved to madad_raw.html');

  const $ = cheerio.load(html);
  const rows = [];
  $('table tr').each((i, el) => {
    const row = [];
    $(el).find('td, th').each((j, td) => {
      row.push($(td).text().trim());
    });
    if (row.length > 0) rows.push(row);
  });

  console.log('Total table rows:', rows.length);
  if (rows.length > 0) {
    console.log('Headers:', rows[0]);
    console.log('Top 15 rows:');
    for (let i = 1; i <= Math.min(15, rows.length - 1); i++) {
      console.log(`Row ${i}:`, rows[i]);
    }
  }

  await browser.close();
})();
