const fs = require("fs");
const path = require("path");

const replacements = [
  [/text-\[#2E75B6\]/g, "text-primary-dark"],
  [/hover:text-\[#2E75B6\]/g, "hover:text-primary-dark"],
  [/bg-\[#2E75B6\]/g, "bg-primary"],
  [/border-\[#2E75B6\]/g, "border-primary"],
  [/ring-\[#2E75B6\]/g, "ring-primary"],
  [/from-\[#2E75B6\]/g, "from-primary"],
  [/hover:border-\[#2E75B6\]/g, "hover:border-primary"],
  [/border-primary bg-blue-50/g, "border-primary bg-primary-muted"],
  [/bg-blue-50 text-primary-dark/g, "bg-primary-muted text-ink"],
  [/hover:bg-blue-50/g, "hover:bg-primary-muted"],
  [/bg-primary text-white/g, "bg-primary text-primary-foreground"],
  [/defaultValue="#2E75B6"/g, 'defaultValue="#FED318"'],
  [/to-blue-800/g, "to-ink"],
  [/to-blue-900/g, "to-ink"],
  [/bg-blue-100 text-blue-800/g, "bg-primary-muted text-ink"],
];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full);
    } else if (/\.(tsx|ts)$/.test(entry.name)) {
      let content = fs.readFileSync(full, "utf8");
      if (!content.includes("#2E75B6") && !content.includes("blue-800") && !content.includes("blue-50 text-primary")) continue;
      const original = content;
      for (const [from, to] of replacements) {
        content = content.replace(from, to);
      }
      if (content !== original) {
        fs.writeFileSync(full, content);
        console.log(full);
      }
    }
  }
}

["apps", "packages"].forEach((d) => walk(path.join(__dirname, "..", d)));
