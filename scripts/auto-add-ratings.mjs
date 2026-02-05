import fs from "fs/promises";
import path from "path";

const contentDirs = ["projects", "services", "blog"].map((d) =>
  path.resolve("src/content", d),
);

const positive5 = [
  "excelente",
  "superó",
  "supero",
  "impecable",
  "perfecto",
  "perfect",
  "increíble",
  "increible",
  "recomiendo",
  "recomendamos",
  "sobresaliente",
  "formidable",
  "maravilloso",
  "excepcional",
];
const positive4 = [
  "muy profesional",
  "muy bien",
  "altamente profesional",
  "profesional",
  "excelente trabajo",
];
const neutral3 = ["bien", "satisfactorio", "cumplió", "cumplio", "adecuado"];
const negative = [
  "malo",
  "problema",
  "retraso",
  "defecto",
  "insatisfecho",
  "insatisfactoria",
];

function scoreTestimonial(text) {
  const t = text.toLowerCase();
  if (positive5.some((w) => t.includes(w))) return 5;
  if (positive4.some((w) => t.includes(w))) return 4;
  if (negative.some((w) => t.includes(w))) return 2;
  if (neutral3.some((w) => t.includes(w))) return 3;
  // fallback: if testimonial exists, assume positive 4
  return 4;
}

async function processFile(filePath) {
  const raw = await fs.readFile(filePath, "utf-8");
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!fmMatch) return { updated: false };
  const fm = fmMatch[1];
  if (/^rating:\s*\d+/m.test(fm)) return { updated: false }; // already has rating

  // find first blockquote
  const quoteMatch = raw.match(/(^>\s?.+(?:\n>.*)*)/m);
  if (!quoteMatch) return { updated: false };
  const quote = quoteMatch[0]
    .split("\n")
    .map((l) => l.replace(/^>\s?/, ""))
    .join(" ")
    .trim();
  const rating = scoreTestimonial(quote);

  // insert rating into frontmatter before the closing ---
  const before = raw.slice(0, fmMatch.index);
  const after = raw.slice(fmMatch.index + fmMatch[0].length);
  const newFrontmatter = `---\n${fm}\nrating: ${rating}\n---\n`;
  const newContent = before + newFrontmatter + after;
  await fs.writeFile(filePath, newContent, "utf-8");
  return { updated: true, rating };
}

async function run() {
  const results = [];
  for (const dir of contentDirs) {
    try {
      const files = await fs.readdir(dir);
      for (const f of files.filter(
        (x) => x.endsWith(".md") || x.endsWith(".mdx"),
      )) {
        const full = path.join(dir, f);
        try {
          const r = await processFile(full);
          if (r.updated) results.push({ file: full, rating: r.rating });
        } catch (err) {
          console.error("error processing", full, err.message);
        }
      }
    } catch (e) {
      // skip missing directories
    }
  }

  console.log(`Processed ${results.length} files with new ratings:`);
  results.forEach((r) => console.log(`${r.file} -> rating: ${r.rating}`));
}

if (
  import.meta.url ===
  `file://${process.cwd()}/${path.relative(process.cwd(), process.argv[1] || "")}`
) {
  // invoked directly
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
