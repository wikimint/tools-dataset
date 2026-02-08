const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..", "data");

let totalTools = 0;
let categories = {};

function scan(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      scan(full);
    } else if (f.endsWith(".json")) {
      const list = JSON.parse(fs.readFileSync(full, "utf8"));
      const cat = path.basename(path.dirname(full));
      totalTools += list.length;
      categories[cat] = (categories[cat] || 0) + list.length;
    }
  }
}

scan(ROOT);

const hash = crypto
  .createHash("sha256")
  .update(JSON.stringify({ totalTools, categories }))
  .digest("hex");

const stats = {
  totalTools,
  categories,
  generatedAt: new Date().toISOString(),
  versionHash: hash
};

fs.writeFileSync(
  path.join(__dirname, "..", "stats.json"),
  JSON.stringify(stats, null, 2)
);

console.log("📊 Stats generated:");
console.log(stats);
