const fs = require('fs');
const path = require('path');
const https = require('https');

// Auto-load .env from root directory if present
const envPath = path.join(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = (match[2] || '').trim().replace(/^"|"$/g, '');
      if (!process.env[key]) process.env[key] = value;
    }
  });
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY environment variable is required.");
  console.error("Please add GEMINI_API_KEY=your_key_here to your .env file.");
  process.exit(1);
}

const statementsPath = path.join(__dirname, '../data/recent_statements.json');
const existingStatements = JSON.parse(fs.readFileSync(statementsPath, 'utf8'));

const systemPrompt = `You are an automated political intelligence agent for PoliDash tracking Israeli political quotes.
Search recent news sources (N12, Kan 11, Ynet, Haaretz, Times of Israel, Israel Hayom, Knesset transcripts) from the past 48 hours for 5 new verified direct quotes from Israeli party leaders.
Output ONLY a valid JSON array of statement objects matching this exact structure:
[{
  "id": "q...",
  "politicianId": "benjamin-netanyahu",
  "nameEn": "Benjamin Netanyahu",
  "nameHe": "בנימין נתניהו",
  "partyEn": "Likud",
  "partyHe": "הליכוד",
  "partyColor": "#1E3A8A",
  "quoteEn": "We must manufacture our own armaments and build defense independence.",
  "quoteHe": "אנחנו צריכים מערכת ייצור נשק עצמאית משלנו.",
  "topicEn": "Security",
  "topicHe": "ביטחון",
  "sourceEn": "Knesset Plenum Speech",
  "sourceHe": "נאום במליאת הכנסת",
  "sourceUrl": "https://www.knesset.gov.il",
  "timestampEn": "August 12, 2026",
  "timestampHe": "12 באוגוסט 2026"
}]`;

async function callGemini() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const payload = JSON.stringify({
    contents: [
      {
        parts: [
          { text: `${systemPrompt}\n\nTask: Fetch 5 new high-impact Israeli political quotes from the past 48 hours and return as JSON array.` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json"
    }
  });

  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const req = https.request({
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.error) {
            return reject(new Error(json.error.message || "Gemini API Error"));
          }
          const text = json.candidates[0].content.parts[0].text;
          const parsedQuotes = JSON.parse(text);
          resolve(parsedQuotes);
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  try {
    console.log("Fetching daily political quotes via Google Gemini API...");
    const newQuotes = await callGemini();
    console.log(`Received ${newQuotes.length} quotes from Gemini API.`);

    const existingIds = new Set(existingStatements.map(s => s.id));
    const toAdd = newQuotes.filter(q => q.id && !existingIds.has(q.id));

    if (toAdd.length === 0) {
      console.log("No new unique quotes to add.");
      return;
    }

    const updated = [...toAdd, ...existingStatements];
    fs.writeFileSync(statementsPath, JSON.stringify(updated, null, 2));
    console.log(`Successfully added ${toAdd.length} new statements to recent_statements.json!`);
  } catch (err) {
    console.error("Error in daily quotes scraper:", err);
    process.exit(1);
  }
}

run();
