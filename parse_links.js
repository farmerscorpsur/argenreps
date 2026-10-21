const fs = require('fs');

const txtPath = 'C:/Users/Indi/Downloads/solo_kakobuy (1).txt';
const outPath = 'C:/Users/Indi/Desktop/ARGENREPS/kakobuy_links_valid.json';

const txt = fs.readFileSync(txtPath, 'utf8');
const lines = txt.split(/\r?\n/);

const links = [];
for (let l of lines) {
  l = l.trim();
  if (!l) continue;
  const low = l.toLowerCase();
  if (low.includes('1:1')) continue;
  if (low.includes('batch')) continue;
  if (low.includes('original packaging')) continue;
  if (low.includes('includes')) continue;
  if (low.includes('nozzles')) continue;

  // look for weidian itemID with digits
  const m1 = l.match(/itemID%3D([0-9]{6,})/i);
  const m2 = l.match(/itemID=([0-9]{6,})/i);
  const m = m1 || m2;
  if (m) {
    links.push(l);
  }
}

const uniq = [...new Set(links)];
fs.writeFileSync(outPath, JSON.stringify(uniq, null, 2));
console.log('count:', uniq.length);
console.log('first:', uniq[0]);
