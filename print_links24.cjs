const cheerio = require('cheerio');

async function main() {
  const url = 'https://www.paamon.co.il/knesset-24-votes-by-scocio-economic-cluster/';
  console.log(`Fetching links from ${url}...`);
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    $('article a').each((i, el) => {
      console.log(`Text: ${$(el).text().trim()} | Link: ${$(el).attr('href')}`);
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
