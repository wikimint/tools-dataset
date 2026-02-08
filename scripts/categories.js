const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "data");
const OUT = path.resolve(__dirname, "..", "categories.json");

function toTitle(slug) {
  return slug
    .split("-")
    .map(w => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

let categories = [];

for (const dir of fs.readdirSync(ROOT)) {
  const full = path.join(ROOT, dir);
  if (!fs.statSync(full).isDirectory()) continue;

  let count = 0;

  for (const file of fs.readdirSync(full)) {
    if (file.endsWith(".json")) {
      const list = JSON.parse(fs.readFileSync(path.join(full, file), "utf8"));
      count += list.length;
    }
  }

  categories.push({
    slug: dir,
    name: toTitle(dir),
    count
  });
}

fs.writeFileSync(OUT, JSON.stringify(categories, null, 2));
console.log("✅ categories.json generated");
