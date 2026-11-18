import * as fs from "fs";
import { BANK, PASSAGES } from "./bank";
import { SENT, READS, GROUPS, STRETCH } from "./garden";
import { clean } from "./voice";
import { LESSONS } from "./lessons";
const out = new Set<string>(); const add = (s?: string) => { if (!s) return; const c = clean(s); if (/[A-Za-z0-9]/.test(c)) out.add(c); };
for (const f of ["app.tsx", "garden.tsx"]) { const src = fs.readFileSync(f, "utf8"); const re = /S\("((?:[^"\\]|\\.)*)"\)/g; let m; while ((m = re.exec(src))) add(JSON.parse('"' + m[1] + '"')); }
SENT.forEach((s) => { add("~" + s); add("^" + s); }); READS.forEach((s) => add("~" + s)); GROUPS.forEach((g) => g.words.forEach((w) => add("~" + w))); STRETCH.forEach((w) => add("≈" + w));
BANK.forEach((q) => { add(q.say); q.steps.forEach((s) => add(s.say)); }); PASSAGES.forEach((p) => p.read && add(p.text));
LESSONS.forEach((l) => { l.s.forEach((x) => add(x.say)); add(l.tr.say); });
const words = new Set<string>(); const tok = (t: string) => t.split(/\s+/).forEach((w) => { const core = (w.match(/[A-Za-z0-9'’]+/g) || []).join("").toLowerCase().replace(/[’]/g, "'").replace(/^'+|'+$/g, ""); if (core && /[a-z0-9]/.test(core)) words.add(core); });
BANK.forEach((q) => { if (q.kind !== "spell" && !(q.kind === "sign" && q.ask !== "word")) tok(q.txt); }); PASSAGES.forEach((p) => tok(p.text));
words.forEach((w) => out.add("w|" + w));
fs.writeFileSync("keys.json", JSON.stringify([...out].sort())); console.log("keys", out.size, "words", words.size);
