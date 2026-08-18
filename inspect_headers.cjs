const fs = require('fs');
const cheerio = require('cheerio');

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
console.log('Headers:', headers);

console.log('\nRecent polls parsed:');
for (let i = 1; i <= 15; i++) {
  if (!rows[i]) break;
  const poll = {};
  headers.forEach((h, idx) => {
    poll[h] = rows[i][idx] || '';
  });
  console.log(`Poll ID: ${poll['מספרהסקר']}, Date: ${poll['תאריך']}, Media: ${poll['כליתקשורת']}, Pollster: ${poll['עורךמשאלים']}`);
  headers.slice(5).forEach(h => {
    if (poll[h] && poll[h] !== '0') {
      console.log(`   ${h}: ${poll[h]}`);
    }
  });
}
