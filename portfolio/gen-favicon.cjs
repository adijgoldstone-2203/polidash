// Run with: node gen-favicon.cjs
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const size = 64;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Rounded rect helper
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Background
const grad = ctx.createLinearGradient(0, 0, size, size);
grad.addColorStop(0, '#111111');
grad.addColorStop(1, '#1e1e1e');
roundRect(ctx, 0, 0, size, size, 14);
ctx.fillStyle = grad;
ctx.fill();

// Border
roundRect(ctx, 0.5, 0.5, size - 1, size - 1, 14);
ctx.strokeStyle = '#333333';
ctx.lineWidth = 1;
ctx.stroke();

// "AG" text
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 30px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('AG', size / 2, size / 2 - 2);

// Blue accent underline
ctx.fillStyle = '#5c6bff';
roundRect(ctx, 10, size - 10, size - 20, 4, 2);
ctx.fill();

const outPath = path.join(__dirname, 'public', 'favicon.png');
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outPath, buffer);
console.log('✅ favicon.png written to public/favicon.png');
