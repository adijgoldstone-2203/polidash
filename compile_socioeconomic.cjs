const fs = require('fs');
const path = require('path');

// Robust CSV parser handling quoted fields containing newlines
function parseCSV(text) {
  const lines = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(cell.trim());
      cell = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && text[i + 1] === '\n') {
        i++; // skip \n
      }
      row.push(cell.trim());
      lines.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }
  if (cell.trim() || row.length > 0) {
    row.push(cell.trim());
    lines.push(row);
  }

  if (lines.length === 0) return [];
  // Clean headers (remove extra whitespace/newlines)
  const headers = lines[0].map(h => h.replace(/\s+/g, ' '));
  
  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const r = lines[i];
    if (r.length === headers.length) {
      const rec = {};
      headers.forEach((h, idx) => {
        rec[h] = r[idx];
      });
      records.push(rec);
    }
  }
  return records;
}

async function main() {
  const url25 = 'https://www.paamon.co.il/content/files/2023/05/group_by_party_cluster.csv';
  const url24 = 'https://www.paamon.co.il/content/files/2022/08/group_by_party_cluster.csv';
  
  try {
    console.log('Fetching Knesset 25 data...');
    const res25 = await fetch(url25);
    const text25 = await res25.text();
    const records25 = parseCSV(text25);
    console.log(`Parsed ${records25.length} records for Knesset 25.`);

    console.log('Fetching Knesset 24 data...');
    const res24 = await fetch(url24);
    const text24 = await res24.text();
    const records24 = parseCSV(text24);
    console.log(`Parsed ${records24.length} records for Knesset 24.`);

    const compiledData = {
      "25": [],
      "24": []
    };

    // Process Knesset 25 (vote counts -> percentages)
    records25.forEach(rec => {
      const clusterVal = parseFloat(rec['cluster2017']);
      if (isNaN(clusterVal)) return;

      const clusterObj = { cluster: Math.round(clusterVal) };
      
      // Calculate total votes in this cluster
      let totalVotes = 0;
      Object.entries(rec).forEach(([key, val]) => {
        if (key !== 'cluster2017') {
          totalVotes += parseInt(val) || 0;
        }
      });

      // Calculate percentage for each party
      Object.entries(rec).forEach(([key, val]) => {
        if (key !== 'cluster2017') {
          const votes = parseInt(val) || 0;
          const pct = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
          const cleanKey = key.replace(/\s+/g, ' ');
          clusterObj[cleanKey] = parseFloat(pct.toFixed(2));
        }
      });
      compiledData["25"].push(clusterObj);
    });

    // Process Knesset 24 (percentages)
    records24.forEach(rec => {
      const clusterVal = parseFloat(rec['cluster2017']);
      if (isNaN(clusterVal)) return;

      const clusterObj = { cluster: Math.round(clusterVal) };
      Object.entries(rec).forEach(([key, val]) => {
        if (key !== 'cluster2017') {
          const cleanKey = key.replace(/\s+/g, ' ');
          clusterObj[cleanKey] = parseFloat(parseFloat(val).toFixed(2)) || 0;
        }
      });
      compiledData["24"].push(clusterObj);
    });

    const outputPath = path.join(__dirname, 'public/socioeconomic_data.json');
    fs.writeFileSync(outputPath, JSON.stringify(compiledData, null, 2), 'utf8');
    console.log(`Successfully compiled socioeconomic data to ${outputPath}`);
  } catch (err) {
    console.error('Error compiling socioeconomic data:', err);
  }
}

main();
