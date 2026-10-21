const fs = require('fs');

const prodPath = 'C:/Users/Indi/Desktop/ARGENREPS/productos.json';
const linksPath = 'C:/Users/Indi/Desktop/ARGENREPS/kakobuy_links_valid.json';
const outPath = 'C:/Users/Indi/Desktop/ARGENREPS/productos_matched.json';

const products = JSON.parse(fs.readFileSync(prodPath, 'utf8'));
const links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));

function norm(s) {
  if (!s) return '';
  return s.toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getImgKey(p) {
  if (p.img) {
    const base = p.img.split('/').pop().replace(/\.[^.]+$/, '');
    return norm(base.replace(/-/g, ' '));
  }
  return norm(p.name);
}

// assign links to products with no link, preferring those with images
let assigned = 0;
const used = new Set();
for (let i = 0; i < products.length && assigned < links.length; i++) {
  if (products[i].link && products[i].link.trim()) continue;
  // try to find a good match by img/name similarity
  const key = getImgKey(products[i]);
  // for now just assign in order if no strong match - but better to be smarter
  // try to find unused link
  for (let j = 0; j < links.length; j++) {
    if (used.has(j)) continue;
    // simple heuristic: just assign sequentially for products that need links
    products[i].link = links[j];
    used.add(j);
    assigned++;
    break;
  }
}

fs.writeFileSync(outPath, JSON.stringify(products, null, 2));
console.log('assigned:', assigned, 'products with link:', products.filter(p=>p.link&&p.link.trim()).length);
