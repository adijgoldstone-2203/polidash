const cheerio = require('cheerio');

async function main() {
  const url = 'https://www.paamon.co.il/knesset-25-votes-by-socio-econimic-cluster/';
  console.log(`Fetching ${url}...`);
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    console.log("=== ARTICLE TEXT ===");
    $('article p, article table').each((i, el) => {
      console.log($(el).text().trim());
      console.log("------------------------");
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
