async function main() {
  const url = 'https://www.paamon.co.il/content/files/2023/05/group_by_party_cluster.csv';
  console.log(`Fetching CSV from ${url}...`);
  try {
    const res = await fetch(url);
    const text = await res.text();
    console.log("=== CSV CONTENT ===");
    console.log(text);
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
