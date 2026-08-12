const fs = require('fs');
const path = require('path');
const geobuf = require('geobuf');
const { PbfReader } = require('pbf');

const geobufPath = "/Users/adigoldstone/.gemini/antigravity/brain/af8d3c88-15b2-4e40-a392-54351a9808eb/scratch/underscore_7";
const outputPath = path.join(__dirname, "../data/israel_towns.geojson");

console.log("Reading geobuf file from:", geobufPath);
if (!fs.existsSync(geobufPath)) {
  console.error("Geobuf file not found at:", geobufPath);
  process.exit(1);
}

try {
  const buffer = fs.readFileSync(geobufPath);
  console.log("Buffer loaded, size:", buffer.length, "bytes. Decoding...");
  
  const pbf = new PbfReader(buffer);
  const geojson = geobuf.decode(pbf);


  
  console.log("Decoding complete! Writing to:", outputPath);
  fs.writeFileSync(outputPath, JSON.stringify(geojson));
  console.log("Success! GeoJSON file written. File size:", fs.statSync(outputPath).size, "bytes.");
} catch (e) {
  console.error("Failed to decode geobuf:", e);
  process.exit(1);
}
