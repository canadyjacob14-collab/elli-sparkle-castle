import { useState, useEffect, useRef } from "react";
import type { ReactNode, CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import { PINK, DEEP, LAV, INK, btn, card } from "./data";
import { say, sayWord, S, stopAudio, unlockAudio } from "./voice";
import { BANK, SKILLS, PASSAGES } from "./bank";
import type { Q, Skill } from "./bank";
import { LESSONS, LBY } from "./lessons";
import type { Lesson } from "./lessons";
import Garden from "./garden";
import { ALBUMS, STICKERS, hint, newly, migrate } from "./stickers";
import type { Sticker } from "./stickers";
export const VERSION = "v4.2";
const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const shuffle = <T,>(a: T[]): T[] => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const QBY: Record<string, Q> = {}; BANK.forEach((q) => (QBY[q.id] = q));
const SK: Record<string, Skill> = {}; SKILLS.forEach((s) => (SK[s.id] = s));
const PAS: Record<string, { id: string; title: string; text: string; read: boolean }> = {}; PASSAGES.forEach((p) => (PAS[p.id] = p));

/* ---------- spoken lines (each one is a single natural Aria clip) ---------- */
export const DAD = [S("Your dad is so proud of you, Elli!"), S("You worked hard on that one, and your dad noticed!"), S("Your dad believes in you, princess!"), S("Look how much you're learning! Your dad loves seeing it."), S("You didn't give up, and that makes your dad so proud!"), S("Your dad knew you could do it!"), S("You're getting smarter every day, Elli!"), S("Your dad is cheering for you right now!"), S("That brain of yours is amazing! Your dad thinks so too."), S("You make your dad smile so big!"), S("You're doing awesome, Elli! Keep going!"), S("Your dad loves how you keep trying!"), S("You figured it out all by yourself! Your dad is so proud."), S("You're a superstar learner, princess!"), S("Your dad says you're unstoppable!"), S("Every time you practice, you get stronger. Your dad sees it!"), S("You should be proud of yourself, Elli! Your dad sure is."), S("You're shining bright today! Your dad loves it."), S("Your dad is sending you the biggest hug for that one!"), S("You can do hard things, Elli! Your dad believes in you.")];
const DAD_STICKER = [S("Your dad is so proud! You earned a brand new sticker, Elli!"), S("A new sticker for a sweet girl! Your dad loves you!")];
const DAD_RARE: Record<string, string[]> = { common: [], rare: [S("A rare sticker! Your dad is so proud of how hard you worked, Elli!"), S("You unlocked a rare sticker, princess! Your dad says you earned every bit of it!")], sparkly: [S("A sparkly sticker! Your dad is cheering so loud for you, Elli!"), S("Ooh, a sparkly one! Your dad loves how you keep practicing!")], legendary: [S("A legendary sticker! You finished a whole album, Elli! Your dad is so proud of you!")] };
const SHORT = [S("Yes!"), S("Awesome!"), S("Great job, Elli!"), S("You got it!"), S("Woo hoo!"), S("Super!")];
const TRY = [S("Oops! Try again."), S("Not quite. Try again, you can do it!"), S("Hmm, try another one!")];
const AFTER = S("You got it! Let's keep going.");
const REVEAL = S("Here's the answer. Look at it carefully, then put it in to keep going.");
const SIGN_LOOK = S("Look at the sign first! Is it plus or minus?");
const SIGN_WORD = S("Read it carefully, detective. Do we add or subtract?");
const SIGN_YES_ADD = S("Yes! Plus means add. The answer gets bigger.");
const SIGN_YES_SUB = S("Yes! Minus means take away. The answer gets smaller.");
const SIGN_YES_WADD = S("Yes! In this story, the parts are put together, so we add.");
const SIGN_YES_WSUB = S("Yes! In this story, some are taken away, so we subtract.");
const SIGN_NO = S("Look again, detective. Check the sign carefully.");
const SIGN_OOPS_ADDED = S("Uh oh! You added. Look at the sign first! This one says take away.");
const SIGN_OOPS_SUBBED = S("Uh oh! You took away. Look at the sign first! This one says add.");
const THINK = S("Take your time. Think first, then answer.");
const SHOW_INTRO = S("Let's figure it out together, step by step.");
const SHOW_END = S("Now you try it! This one will come back later so you can get a star.");
const RIM_INTRO = S("This is Read It Myself. On the test, nobody will read the questions to you. Read it two times, find the question, and tap key words to underline them. You can do it!");
const RIM_HINT = S("Tap one word you want to hear.");
const TAP_WORD = S("Read it yourself first. If you get stuck, tap a word to hear it.");
const CHECK_INTRO = S("It's Check-Up time! Do your best. No hints this time, just like a real test.");
const CHECK_DONE = S("You finished your Check-Up! Your dad is so proud of how hard you worked!");
const ROUND_DONE = S("You finished the round, Elli! Great work!");
const ROUND_PERFECT = S("A perfect round! Every answer right on the first try! Your dad is so proud!");
const QUEST_INTRO = S("Here's today's quest! A little bit of everything, princess.");
const WELCOME = S("Hi Elli! Welcome to your Sparkle Castle! Pick something fun to learn.");
const SIGN_INTRO = S("Welcome, Sign Detective! First find the sign. Then solve the problem.");
const SPELL_TIP = S("Type the word, then tap check.");
const BLD_INTRO = S("Build It Different Ways! Use hundreds, tens, and ones, just like your snap cubes.");
const BLD_KEPT = S("Oops! When you trade a hundred for 10 tens, the hundred goes away. Take it off!");
const BLD_TENS = S("Count the tens again. Then add it back up to check!");
const BLD_DROP = S("Uh oh! The hundred went away, but where are the 10 new tens? Add them to the tens.");
const BLD_SAME = S("That way is already on your list. Find a different way!");
const BLD_BLANK = S("Fill in every box. Use a zero if there are none.");
const BLD_REGULAR = S("That still makes the number, but make the trade the question asks for!");
const BLD_NOCHECK = S("Add it back up. Does it still make the number? Not this time!");
const BLD_CHECK = S("Add it back up. Does it still make the number?");
const TRADE_H = S("You traded 1 hundred for 10 tens. The number stays the same!");
const TRADE_T = S("You traded 1 ten for 10 ones. The number stays the same!");
const THREE_TIP = S("Number tip! A three looks like the letter B without its straight line. Both bumps face the right side.");
const MASTER = S("You mastered a skill, Elli! Your dad is doing a happy dance!");

/* ---------- progress (local only) ---------- */
type Item = { a: number; c: number; m: number; h: number; last: number; flag: boolean; ok: number };
type Check = { d: string; n: number; c: number; per: Record<string, { t: number; c: number }> };
type Prog = { v: 4; stars: number; best: number; run: number; first: number; perfect: number; days: string[]; questDays: string[]; stickers: string[]; acc: string; lvl: "core" | "chal"; items: Record<string, Item>; sk: Record<string, { t: number; c: number; rec: number[]; last: string }>; sign: { t: number; m: number; log: [string, number][] }; checks: Check[]; readMode: "fade" | "always" | "self"; hints: number; shows: number; garden: number; mastered: string[]; bld: { t: number; e: Record<string, number>; log: [string, string][] }; lessons: Record<string, { v: number; done: boolean; last: string }> };
const KEY = "elli-sparkle-v4";
const today = (): string => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const blank = (): Prog => ({ v: 4, stars: 0, best: 0, run: 0, first: 0, perfect: 0, days: [], questDays: [], stickers: [], acc: "", lvl: "core", items: {}, sk: {}, sign: { t: 0, m: 0, log: [] }, checks: [], readMode: "fade", hints: 0, shows: 0, garden: 0, mastered: [], bld: { t: 0, e: {}, log: [] }, lessons: {} });
function store(): Storage | null { try { const ls = window.localStorage; ls.setItem("__t", "1"); ls.removeItem("__t"); return ls; } catch (e) { return null; } }
function load(): Prog {
  const b = blank(); const ls = store(); if (!ls) return b;
  try { const s = ls.getItem(KEY); if (s) { const d = JSON.parse(s); return { ...b, ...d, sign: { ...b.sign, ...(d.sign || {}) }, bld: { ...b.bld, ...(d.bld || {}) } }; } } catch (e) { /* */ }
  try { const o = ls.getItem("elli-sparkle-v2"); if (o) { const d = JSON.parse(o); // keep her stars & stickers from the old castle
    b.stars = d.stars || 0; b.best = d.best || 0; b.perfect = d.perfect || 0; b.acc = d.acc || ""; b.days = Array.isArray(d.days) ? d.days : []; b.questDays = Array.isArray(d.todayDays) ? d.todayDays : [];
    const st: string[] = Array.isArray(d.stickers) ? d.stickers : []; b.stickers = st.some((x) => !x.includes(":")) ? Array.from(new Set([...st.filter((x) => x.includes(":")), ...migrate(st)])) : st;
    if (d.subj) b.first = ["math", "reading", "spelling"].reduce((n, k) => n + ((d.subj[k] && d.subj[k].c) || 0), 0); } } catch (e) { /* */ }
  return b;
}
function save(p: Prog) { try { const ls = store(); if (ls) ls.setItem(KEY, JSON.stringify(p)); } catch (e) { /* */ } }
function runDays(days: string[]): number { const set = new Set(days); let n = 0; const d = new Date(); const k = (x: Date) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`; if (!set.has(k(d))) d.setDate(d.getDate() - 1); while (set.has(k(d))) { n++; d.setDate(d.getDate() - 1); } return n; }
const masteredCount = (p: Prog) => Object.values(p.sk).filter((s) => s.t >= 15 && s.c / s.t >= 0.8).length;
const stats = (p: Prog) => ({ stars: p.stars, first: p.first, perfect: p.perfect, best: p.best, master: masteredCount(p), today: runDays(p.questDays) });

/* ---------- read-aloud fading (getting ready for January 2027 tests) ---------- */
export function fadePhase(d = today()): { pct: number; label: string } {
  if (d < "2026-12-01") return { pct: 100, label: "Warm-up: I read every question (until Dec 1)" };
  if (d < "2026-12-15") return { pct: 67, label: "Fading: I read 2 of every 3 questions (Dec 1–14)" };
  if (d < "2027-01-05") return { pct: 33, label: "Fading: I read 1 of every 3 questions (Dec 15–Jan 4)" };
  return { pct: 0, label: "Test-ready: she reads on her own (from Jan 5, 2027)" };
}
function autoRead(p: Prog, idx: number, rim: boolean): boolean {
  if (rim) return false; if (p.readMode === "always") return true; if (p.readMode === "self") return false;
  const pct = fadePhase().pct; return pct >= 100 ? true : pct <= 0 ? false : pct > 50 ? idx % 3 !== 2 : idx % 3 === 0;
}

/* ---------- picking questions: weak spots first, then new, then oldest ---------- */
function choose(p: Prog, skills: string[], n: number, avoid: Set<string> = new Set()): string[] {
  const now = Date.now(); const pool = BANK.filter((q) => skills.includes(q.sk) && !avoid.has(q.id));
  const tier = (q: Q) => { const it = p.items[q.id]; if (!it) return 1; if (it.flag && now - it.last > 3 * 60000) return 0; return 2 + it.last / 1e13; };
  const out: string[] = []; const by: Record<string, Q[]> = {}; shuffle(pool).sort((a, b) => tier(a) - tier(b)).forEach((q) => (by[q.sk] = by[q.sk] || []).push(q));
  let k = 0; const ks = shuffle(Object.keys(by)); while (out.length < n && ks.some((s) => by[s].length)) { const s = ks[k++ % ks.length]; const q = by[s].shift(); if (q) out.push(q.id); }
  return out;
}
const lvlSkills = (p: Prog, subj: string) => SKILLS.filter((s) => s.subj === subj && s.lv === p.lvl).map((s) => s.id);
function signRate(p: Prog, days = 7): { t: number; m: number } { const since = Date.now() - days * 864e5; const l = p.sign.log.filter(([d]) => new Date(d).getTime() >= since); return { t: l.length, m: l.filter(([, x]) => x).length }; }

/* ---------- visuals ---------- */
const box = (bg: string, extra?: CSSProperties): CSSProperties => ({ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 44, height: 50, borderRadius: 14, background: bg, fontSize: 28, fontWeight: 800, color: INK, margin: 3, padding: "0 8px", ...extra });
const PLC = ["#ffd1e8", "#e3d4ff", "#d4f4ff"];
function V(p: { v: any; ans?: string }): ReactNode {
  const v = p.v; if (!v) return null; const d = (n: number) => [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
  if (v.k === "num") return <div style={{ textAlign: "center", fontSize: 54, fontWeight: 900, letterSpacing: 4 }}>{String(v.n).split("").map((c: string, i: number) => <span key={i} style={{ color: v.hl === i ? DEEP : INK, textDecoration: v.hl === i ? "underline wavy " + PINK : "none" }}>{c}</span>)}</div>;
  if (v.k === "pv") return <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>{["Hundreds", "Tens", "Ones"].map((l, i) => <div key={l} style={{ textAlign: "center", border: v.hl === i ? "4px solid " + PINK : "4px solid transparent", borderRadius: 16, padding: 2 }}><div style={{ fontSize: 13, fontWeight: 800, color: DEEP }}>{l}</div><div style={box(PLC[i], { width: 64 })}>{d(v.n)[i]}</div></div>)}</div>;
  if (v.k === "blocks") return <BV h={v.h} t={v.t} o={v.o} />;
  if (v.k === "exp2") { const A = d(v.a), B = d(v.b); const cell = (x: number, i: number) => <span key={i} style={box(v.hl === i ? "#ffe066" : PLC[i], { fontSize: 20, minWidth: 40, height: 40 })}>{x}</span>;
    const row = (n: number, D: number[]) => <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "nowrap" }}><span style={{ fontWeight: 900, fontSize: 20, minWidth: 46 }}>{n} =</span>{cell(D[0] * 100, 0)}<b>+</b>{cell(D[1] * 10, 1)}<b>+</b>{cell(D[2], 2)}</div>;
    const S3 = [(A[0] + B[0]) * 100, (A[1] + B[1]) * 10, A[2] + B[2]];
    return <div style={{ textAlign: "center" }}>{row(v.a, A)}{row(v.b, B)}{v.hl >= 0 && <div style={{ fontWeight: 900, color: DEEP, fontSize: 18, marginTop: 4 }}>{S3.map((x, i) => (i <= v.hl ? x : "?")).join(" + ")}{v.hl >= 3 ? " = " + (v.a + v.b) : ""}</div>}</div>; }
  if (v.k === "hops") { const pts: number[] = v.pts; const N = pts.length; const X = (i: number) => (v.op === "-" ? 320 - (300 * i) / Math.max(1, N - 1) : 20 + (300 * i) / Math.max(1, N - 1)); const col = v.op === "-" ? "#e53935" : "#43a047";
    return <svg viewBox="0 0 340 120" style={{ width: "100%", maxWidth: 360, display: "block", margin: "0 auto" }}><line x1="8" y1="86" x2="332" y2="86" stroke={INK} strokeWidth="3" />
      {pts.slice(0, -1).map((p0, i) => i < v.step && <g key={"j" + i}><path d={`M${X(i)},84 Q${(X(i) + X(i + 1)) / 2},${i % 2 ? 40 : 24} ${X(i + 1)},84`} fill="none" stroke={col} strokeWidth="4" /><text x={(X(i) + X(i + 1)) / 2} y={i % 2 ? 46 : 30} textAnchor="middle" fontSize="15" fontWeight="800" fill={col}>{v.op === "-" ? "−" : "+"}{Math.abs(p0 - pts[i + 1])}</text></g>)}
      {pts.map((n, i) => (i <= v.step ? <g key={"p" + i}><line x1={X(i)} y1="78" x2={X(i)} y2="94" stroke={INK} strokeWidth="3" /><text x={X(i)} y="112" textAnchor="middle" fontSize="13" fontWeight="800" fill={i === N - 1 && v.step >= N - 1 ? DEEP : INK}>{n}</text></g> : null))}</svg>; }
  if (v.k === "cmp") return <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>{[v.a, v.b].map((n: number, r: number) => <div key={r}>{d(n).map((x, i) => <span key={i} style={box(v.hl === i ? "#ffe066" : PLC[i])}>{x}</span>)}</div>)}</div>;
  if (v.k === "list") return <div style={{ textAlign: "center" }}>{v.ns.map((n: number) => <span key={n} style={box("#ffe4f1")}>{n}</span>)}</div>;
  if (v.k === "seq") return <div style={{ textAlign: "center" }}>{v.seq.map((n: number, i: number) => <span key={i} style={box(i === v.miss ? "#ffe066" : "#ffe4f1", { fontSize: 20 })}>{i === v.miss ? "?" : n}</span>)}</div>;
  if (v.k === "sign") return <div style={{ textAlign: "center" }}><span style={{ display: "inline-flex", width: 84, height: 84, borderRadius: 42, border: "6px solid " + (v.op === "+" ? "#43a047" : "#e53935"), alignItems: "center", justifyContent: "center", fontSize: 64, fontWeight: 900, color: v.op === "+" ? "#2e7d32" : "#c62828", background: "#fff" }}>{v.op === "+" ? "+" : "−"}</span><div style={{ fontWeight: 800, color: INK }}>{v.op === "+" ? "PLUS = put together" : "MINUS = take away"}</div></div>;
  if (v.k === "line") { const { a, b, op } = v; const tens = Math.floor(b / 10) * 10, ones = b % 10; const mid = op === "+" ? a + tens : a - tens, end = op === "+" ? a + b : a - b; const pts = [a, mid, end]; const pos: Record<number, number> = op === "+" ? { [a]: 20, [mid]: ones && tens ? 235 : 320, [end]: 320 } : { [a]: 320, [mid]: ones && tens ? 105 : 20, [end]: 20 }; if (!tens) pos[a] = op === "+" ? 20 : 320; const X = (n: number) => pos[n]; const col = op === "+" ? "#43a047" : "#e53935";
    return <svg viewBox="0 0 340 110" style={{ width: "100%", maxWidth: 360, display: "block", margin: "0 auto" }}><line x1="10" y1="80" x2="330" y2="80" stroke={INK} strokeWidth="3" />
      {(v.step || 2) >= 1 && tens > 0 && <path d={`M${X(a)},78 Q${(X(a) + X(mid)) / 2},20 ${X(mid)},78`} fill="none" stroke={col} strokeWidth="4" />}
      {(v.step || 2) >= 2 && ones > 0 && <path d={`M${X(mid)},78 Q${(X(mid) + X(end)) / 2},40 ${X(end)},78`} fill="none" stroke={col} strokeWidth="4" strokeDasharray="6 4" />}
      {tens > 0 && <text x={(X(a) + X(mid)) / 2} y="38" textAnchor="middle" fontSize="16" fontWeight="800" fill={col}>{op === "+" ? "+" : "−"}{tens}</text>}
      {ones > 0 && (v.step || 2) >= 2 && <text x={(X(mid) + X(end)) / 2} y="56" textAnchor="middle" fontSize="16" fontWeight="800" fill={col}>{op === "+" ? "+" : "−"}{ones}</text>}
      {Array.from(new Set(pts)).map((n) => <g key={n}><line x1={X(n)} y1="72" x2={X(n)} y2="88" stroke={INK} strokeWidth="3" /><text x={X(n)} y="106" textAnchor="middle" fontSize="15" fontWeight="800" fill={n === end ? DEEP : INK}>{(v.step || 2) >= 2 || n !== end ? n : "?"}</text></g>)}</svg>; }
  if (v.k === "col") { const A = String(v.a).padStart(3, " "), B = String(v.b).padStart(3, " "); const hl = v.upto; const c = (i: number) => (hl >= 0 && 2 - i === hl ? "#ffe066" : PLC[i]);
    return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "monospace" }}><div>{A.split("").map((x, i) => <span key={i} style={box(c(i))}>{x}</span>)}</div><div><span style={{ fontSize: 36, fontWeight: 900, color: v.op === "+" ? "#2e7d32" : "#c62828", marginRight: 4 }}>{v.op === "+" ? "+" : "−"}</span>{B.split("").map((x, i) => <span key={i} style={box(c(i))}>{x}</span>)}</div><div style={{ width: 190, borderTop: "4px solid " + INK }} /></div>; }
  if (v.k === "groups") return <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6 }}>{Array.from({ length: v.g }).map((_, i) => <div key={i} style={{ border: "3px dashed " + PINK, borderRadius: 30, padding: 6, fontSize: 20, maxWidth: 90 }}>{Array(v.n).fill(v.e).join("")}</div>)}</div>;
  if (v.k === "array") return <div style={{ textAlign: "center", fontSize: 24, lineHeight: 1.2 }}>{Array.from({ length: v.rows }).map((_, i) => <div key={i}>{Array(v.cols).fill(v.e).join(" ")}</div>)}</div>;
  if (v.k === "round") { const X = (n: number) => 20 + ((n - v.lo) / (v.hi - v.lo)) * 300; return <svg viewBox="0 0 340 80" style={{ width: "100%", maxWidth: 360, display: "block", margin: "0 auto" }}><line x1="20" y1="40" x2="320" y2="40" stroke={INK} strokeWidth="3" />{[v.lo, (v.lo + v.hi) / 2, v.hi].map((n: number) => <g key={n}><line x1={X(n)} y1="32" x2={X(n)} y2="48" stroke={INK} strokeWidth="3" /><text x={X(n)} y="70" textAnchor="middle" fontSize="14" fontWeight="800" fill={INK}>{n}</text></g>)}<circle cx={X(v.n)} cy="40" r="9" fill={PINK} /><text x={X(v.n)} y="22" textAnchor="middle" fontSize="15" fontWeight="900" fill={DEEP}>{v.n}</text></svg>; }
  if (v.k === "letters") return <div style={{ textAlign: "center" }}>{v.w.split("").map((c: string, i: number) => { const on = v.hl && v.hl.includes(i); return <span key={i} style={box(on ? "#ffe066" : i % 2 ? "#ffe4f1" : "#f3e5ff", { minWidth: 34, fontSize: 26, animation: on ? "elliGlow 1.4s ease-in-out infinite" : undefined, border: on ? "3px solid #ffb300" : undefined })}>{c}</span>; })}</div>;
  if (v.k === "card") { const t: string = v.text; const at = v.hl ? t.indexOf(v.hl) : -1; return <div style={{ background: "#fffaf0", border: "2px solid #ffe0b2", borderRadius: 14, padding: 12, fontSize: 20, fontWeight: 700, color: INK, lineHeight: 1.5 }}>{at < 0 ? t : <>{t.slice(0, at)}<span style={{ background: "#fff59d", borderBottom: "4px solid " + PINK, borderRadius: 4, animation: "elliGlow 1.4s ease-in-out infinite" }}>{v.hl}</span>{t.slice(at + v.hl.length)}</>}</div>; }
  return null;
}


/* ---------- Build It Different Ways: base-ten blocks, trades, and worksheet rows ---------- */
function BV(p: { h: number; t: number; o: number; small?: boolean }): ReactNode {
  const cs = p.o > 40 ? 7 : 9; const tw = p.t > 16 ? 6 : 8;
  return <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 10, flexWrap: "wrap" }}>
    {p.h > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 3, maxWidth: 140 }}>{Array.from({ length: p.h }).map((_, i) => <div key={i} style={{ width: 32, height: 32, background: "repeating-linear-gradient(0deg,#ff8fc4 0 2px,#ffc2df 2px 3.2px),repeating-linear-gradient(90deg,#ff8fc4 0 2px,transparent 2px 3.2px)", border: "2px solid " + DEEP, borderRadius: 3 }} />)}</div>}
    {p.t > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 2, maxWidth: 160 }}>{Array.from({ length: p.t }).map((_, i) => <div key={i} style={{ width: tw, height: 40, background: "repeating-linear-gradient(0deg,#b39ddb 0 3px,#d1c4e9 3px 4px)", border: "1px solid #7e57c2", borderRadius: 2 }} />)}</div>}
    {p.o > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 2, maxWidth: p.o > 20 ? 170 : 60 }}>{Array.from({ length: p.o }).map((_, i) => <div key={i} style={{ width: cs, height: cs, background: "#81d4fa", border: "1px solid #0288d1" }} />)}</div>}
    <div style={{ width: "100%", textAlign: "center", fontSize: 14, color: DEEP, fontWeight: 700 }}>{p.h} {p.h === 1 ? "hundred" : "hundreds"} · {p.t} {p.t === 1 ? "ten" : "tens"} · {p.o} {p.o === 1 ? "one" : "ones"}</div></div>;
}
const total = (h: number, t: number, o: number) => h * 100 + t * 10 + o;
function Trade(p: { n: number }) {
  const d0 = [Math.floor(p.n / 100), Math.floor(p.n / 10) % 10, p.n % 10]; const [b, setB] = useState(d0);
  useEffect(() => setB(d0), [p.n]);
  const [h, t, o] = b; const tot = total(h, t, o);
  return <div data-trade="1" style={{ background: "#f7f3ff", border: "2px solid #d1c4e9", borderRadius: 18, padding: 10, margin: "8px 0" }}>
    <div style={{ fontWeight: 900, color: DEEP, fontSize: 15, marginBottom: 4 }}>🧊 Snap cubes: trade and watch</div><BV h={h} t={t} o={o} />
    <div data-total="1" style={{ textAlign: "center", fontWeight: 900, fontSize: 18, color: tot === p.n ? "#2e7d32" : DEEP, margin: "6px 0" }}>{[h * 100, t * 10, o].join(" + ")} = {tot} {tot === p.n ? `✓ still ${p.n}!` : ""}</div>
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
      <button disabled={h === 0} onClick={() => { setB([h - 1, t + 10, o]); say(TRADE_H); }} style={{ ...btn(PINK), padding: "8px 10px", fontSize: 14, opacity: h ? 1 : 0.4 }}>Trade 1 hundred for 10 tens</button>
      <button disabled={t === 0 || o > 150} onClick={() => { setB([h, t - 1, o + 10]); say(TRADE_T); }} style={{ ...btn(LAV), padding: "8px 10px", fontSize: 14, opacity: t ? 1 : 0.4 }}>Trade 1 ten for 10 ones</button>
      <button onClick={() => setB(d0)} style={{ ...btn("#fff"), color: INK, border: "2px solid #d1c4e9", padding: "8px 10px", fontSize: 14 }}>↺ Start over</button></div></div>;
}
type RowSt = { ok: boolean; err: string; tot: number | null };
function rowCheck(q: Q, vals: string[][]): RowSt[] {
  const n = q.n || 0; const rows = q.rows || []; const nums = rows.map((rw, i) => rw.g.map((g, j) => { if (g != null) return g; const x = ((vals[i] || [])[j] || "").trim(); return x === "" ? NaN : Number(x); }));
  return nums.map((r, i) => { const g = rows[i].g; if (r.some((x) => isNaN(x))) return { ok: false, err: "blank", tot: null };
    const tot = total(r[0], r[1], r[2]); if (g.some((x, j) => x != null && x !== r[j])) return { ok: false, err: "other", tot };
    if (tot !== n) { const df = tot - n; return { ok: false, err: df === 100 ? "kept" : df === 10 ? "keptTen" : df === -100 ? "drop" : df % 10 === 0 && Math.abs(df) <= 90 ? "tens" : "other", tot }; }
    if (rows[i].exact && q.sol && r.join("|") !== q.sol[i].join("|")) return { ok: false, err: "regular", tot };
    if (nums.some((o, j) => j < i && o.join("|") === r.join("|"))) return { ok: false, err: "same", tot };
    return { ok: true, err: "", tot }; });
}
function BuildRows(p: { q: Q; vals: string[][]; setVals: (v: string[][]) => void; st: RowSt[] | null; showTot: boolean; dis: boolean; onOk: () => void; noCheck: boolean; onCheck: () => void }) {
  const rows = p.q.rows || []; const L = ["hundreds", "tens", "ones"];
  return <div>{rows.map((r, i) => { const s = p.st && p.st[i]; const bd = s ? (s.ok ? "#43a047" : "#e53935") : "#ffc1e3";
    return <div key={i} data-row={i} style={{ display: "flex", alignItems: "center", gap: 4, background: s ? (s.ok ? "#e8f5e9" : "#ffebee") : "#fff", border: "3px solid " + bd, borderRadius: 16, padding: "6px 6px", margin: "6px 0" }}>
      {rows.length > 1 && <div style={{ fontWeight: 900, color: DEEP, width: 18, textAlign: "center" }}>{i + 1}</div>}
      {L.map((l, j) => { const g = r.g[j]; return <div key={l} style={{ flex: 1, textAlign: "center" }}>{g != null ? <div style={{ fontSize: 24, fontWeight: 900, height: 40, lineHeight: "40px", background: "#ffe4f1", borderRadius: 10, color: INK }}>{g}</div>
        : <input data-cell={`${i}-${j}`} disabled={p.dis} inputMode="numeric" pattern="[0-9]*" value={(p.vals[i] || [])[j] ?? ""} onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 3); const nv = rows.map((_, k) => [...(p.vals[k] || ["", "", ""])]); nv[i][j] = v; p.setVals(nv); }} style={{ width: "100%", maxWidth: 70, boxSizing: "border-box", height: 40, fontSize: 24, fontWeight: 900, textAlign: "center", border: "2px solid #f48fb1", borderRadius: 10, color: INK, fontFamily: "inherit" }} />}
        <div style={{ fontSize: 12, fontWeight: 700, color: DEEP }}>{l}</div></div>; })}
      {p.showTot && s && s.tot != null && <div style={{ fontSize: 13, fontWeight: 900, color: s.tot === p.q.n ? "#2e7d32" : "#c62828", minWidth: 44, textAlign: "center" }}>={s.tot}{s.tot === p.q.n ? "✓" : "✗"}</div>}</div>; })}
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 6, flexWrap: "wrap" }}>{!p.noCheck && <button onClick={p.onCheck} disabled={p.dis} style={{ ...btn(LAV), padding: "8px 12px", fontSize: 15 }}>🧮 Add it back up</button>}<button disabled={p.dis} onClick={p.onOk} style={btn("#43a047")}>✓ Check</button></div></div>;
}
function ThreeTip() {
  return <div data-tip3="1" style={{ display: "flex", alignItems: "center", gap: 8, background: "#fffde7", border: "2px dashed #ffd54f", borderRadius: 14, padding: "6px 10px", margin: "6px 0", fontSize: 13, color: INK }}>
    <span style={{ fontSize: 30, fontWeight: 900, color: "#2e7d32" }}>3 ✓</span><span style={{ fontSize: 30, fontWeight: 900, color: "#c62828", display: "inline-block", transform: "scaleX(-1)" }}>3</span><span style={{ color: "#c62828", fontWeight: 900 }}>✗</span>
    <span style={{ flex: 1 }}>✏️ Writing a 3? Both bumps face the <b>right</b>, like a B without its straight line.</span><button onClick={() => say(THREE_TIP)} style={{ ...btn(LAV), padding: "4px 8px", fontSize: 13 }}>🔊</button></div>;
}


/* ---------- Learn It: step-by-step lessons (not scored) ---------- */
function LessonView(p: { l: Lesson; upd: (f: (p: Prog) => void) => void; onPractice: () => void; onBack: () => void }) {
  const { l } = p; const N = l.s.length; const [k, setK] = useState(0); const [wrong, setWrong] = useState<string[]>([]); const [got, setGot] = useState(false);
  const cur = k < N ? l.s[k] : null; const line = cur ? cur.say : l.tr.say;
  useEffect(() => { say(line); if (k === N) p.upd((g) => { const x = g.lessons[l.sk] || { v: 0, done: false, last: "" }; x.done = true; x.last = today(); g.lessons[l.sk] = x; }); }, [k]);
  useEffect(() => { p.upd((g) => { const x = g.lessons[l.sk] || { v: 0, done: false, last: "" }; x.v++; x.last = today(); g.lessons[l.sk] = x; }); return () => stopAudio(); }, []);
  const pickT = (c: string) => { if (got) return; if (c === l.tr.ans) { setGot(true); say(pick(SHORT)); } else { setWrong((w) => [...w, c]); say(pick(TRY)); } };
  return <div style={{ padding: 14 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><button onClick={() => { stopAudio(); p.onBack(); }} style={{ ...btn(LAV), padding: "6px 12px", fontSize: 15 }}>📚 Lessons</button><div style={{ fontWeight: 800, color: DEEP, fontSize: 15 }}>{SK[l.sk] ? SK[l.sk].icon : ""} Learn It: {l.title}</div></div>
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 8 }}>{Array.from({ length: N + 1 }).map((_, i) => <span key={i} style={{ width: 12, height: 12, borderRadius: 6, background: i === k ? DEEP : i < k ? PINK : "#ffd1e8" }} />)}</div>
    <div style={card}>{cur ? <div key={k} data-lesson-step={k} style={{ animation: "elliIn .5s ease-out" }}>
        <div style={{ fontWeight: 900, color: DEEP, fontSize: 15 }}>Step {k + 1} of {N}</div>
        {cur.v && <div style={{ margin: "10px 0", animation: "elliPop .6s ease-out" }}>{V({ v: cur.v })}</div>}
        <div style={{ fontSize: 24, fontWeight: 900, color: INK, textAlign: "center", margin: "10px 0", whiteSpace: "pre-line" }}>{cur.t}</div>
        <div style={{ fontSize: 17, color: INK, textAlign: "center", background: "#fff4fa", borderRadius: 14, padding: 10 }}>{cur.say}</div></div>
      : <div key="try" data-lesson-try="1" style={{ animation: "elliIn .5s ease-out" }}><div style={{ fontWeight: 900, color: DEEP, fontSize: 18 }}>✨ Your turn! (just practice, no stars)</div>
        {l.tr.text && <div style={{ background: "#fffaf0", border: "2px solid #ffe0b2", borderRadius: 14, padding: 10, margin: "8px 0", fontSize: 19, fontWeight: 700 }}>{l.tr.text}</div>}
        <div style={{ fontSize: 22, fontWeight: 900, color: INK, margin: "8px 0" }}>{l.tr.q}</div>
        <div style={{ display: "grid", gap: 8 }}>{l.tr.ch.map((c) => <button key={c} disabled={got || wrong.includes(c)} onClick={() => pickT(c)} style={{ ...btn(got && c === l.tr.ans ? "#43a047" : PINK), opacity: wrong.includes(c) ? 0.3 : 1, fontSize: 18, padding: "12px 8px" }}>{c}</button>)}</div>
        {got && <div style={{ textAlign: "center", fontWeight: 900, color: "#2e7d32", fontSize: 20, margin: 8 }}>✅ You got it!</div>}
        {wrong.length > 0 && !got && <div style={{ textAlign: "center", fontWeight: 900, color: DEEP, margin: 6 }}>Try again 💗 You can tap Back to see the steps.</div>}
        <div style={{ textAlign: "center", marginTop: 10 }}><button onClick={() => { stopAudio(); p.onPractice(); }} style={btn("#43a047", true)}>Practice {l.title} ➜</button></div></div>}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}><button onClick={() => say(line)} style={btn(LAV)}>🔊 Replay</button>
        {k > 0 && <button onClick={() => setK(k - 1)} style={btn("#f48fb1")}>⬅ Back</button>}
        {k < N && <button onClick={() => setK(k + 1)} style={btn(PINK)}>{k + 1 < N ? "Next ➜" : "Your turn ✨"}</button>}</div></div></div>;
}

/* ---------- text you can tap (hear a word, or underline key words) ---------- */
function Words(p: { text: string; mode: "plain" | "tap" | "rim"; ul?: Set<string>; onUl?: (k: string) => void; armed?: boolean; onHint?: () => void; qhl?: boolean; size?: number; pfx: string }) {
  const sents = p.text.match(/[^.?!]+[.?!]*["”]?\s*/g) || [p.text];
  return <div style={{ fontSize: p.size || 22, lineHeight: 1.55, color: INK, fontWeight: 700 }}>{sents.map((s, si) => { const isQ = /\?/.test(s); return <span key={si} style={{ background: p.qhl && isQ ? "#fff59d" : "transparent", borderRadius: 8 }}>{s.split(/(\s+)/).map((w, wi) => { if (!w.trim()) return w; const k = p.pfx + si + "-" + wi; const core = (w.match(/[A-Za-z0-9'’]+/g) || []).join("");
    if (p.mode === "plain" || !core) return <span key={wi}>{w}</span>;
    const u = p.ul && p.ul.has(k);
    return <span key={wi} data-w={core} onClick={() => { if (p.mode === "tap") { sayWord(core); return; } if (p.armed) { sayWord(core); p.onHint && p.onHint(); return; } p.onUl && p.onUl(k); }} style={{ cursor: "pointer", borderBottom: u ? "4px solid " + PINK : "2px dotted rgba(194,24,91,.25)", background: u ? "#ffe0ef" : "transparent", borderRadius: 4 }}>{w}</span>; })}</span>; })}</div>;
}
function Pad(p: { val: string; set: (s: string) => void; ok: () => void; dis?: boolean }) {
  const k = (c: string) => { if (p.dis) return; if (c === "⌫") p.set(p.val.slice(0, -1)); else if (c === "✓") { if (p.val) p.ok(); } else if (p.val.length < 4) p.set(p.val + c); };
  return <div style={{ opacity: p.dis ? 0.35 : 1, transition: "opacity .4s" }}><div style={{ textAlign: "center", fontSize: 40, fontWeight: 900, color: DEEP, minHeight: 52, background: "#fff", borderRadius: 18, border: "3px solid #ffc1e3", margin: "6px auto", maxWidth: 220 }}>{p.val || " "}</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, maxWidth: 300, margin: "0 auto" }}>{["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"].map((c) => <button key={c} disabled={p.dis} onClick={() => k(c)} style={{ ...btn(c === "✓" ? "#43a047" : c === "⌫" ? LAV : PINK), padding: "12px 0", fontSize: 26 }}>{c}</button>)}</div></div>;
}
type Res = { id: string; sk: string; ok: boolean; help: boolean; sign: boolean };
export type Sess = { title: string; ids: string[]; kind: "practice" | "quest" | "check" | "rim" | "sign" };
const norm = (s: string) => s.trim().toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, " ");

function Play(p: { prog: Prog; upd: (f: (p: Prog) => void) => void; sess: Sess; onDone: (r: Res[]) => void; onExit: () => void; toast: (s: Sticker[]) => void; onLearn?: (sk: string) => void }) {
  const { prog, upd, sess } = p; const check = sess.kind === "check";
  const [ids, setIds] = useState<string[]>(sess.ids); const [i, setI] = useState(0); const q = QBY[ids[i]]; const sk = SK[q.sk];
  const rim = sk.subj === "rim";
  const [tries, setTries] = useState(0); const [wrong, setWrong] = useState<string[]>([]); const [help, setHelp] = useState(false); const [reveal, setReveal] = useState(false); const [done, setDone] = useState(false);
  const [phase, setPhase] = useState<"sign" | "think" | "ans">("ans"); const [val, setVal] = useState(""); const [ul, setUl] = useState<Set<string>>(new Set()); const [armed, setArmed] = useState(false); const [qhl, setQhl] = useState(false); const [chips, setChips] = useState<string[]>([]); const [bvals, setBvals] = useState<string[][]>([]); const [bst, setBst] = useState<RowSt[] | null>(null); const [showTot, setShowTot] = useState(false);
  const [steps, setSteps] = useState(-1); const [signPick, setSignPick] = useState<string>(""); const [msg, setMsg] = useState(""); const res = useRef<Res[]>([]); const recorded = useRef(false); const said = useRef<Record<string, boolean>>({});
  const read = autoRead(prog, i, rim); const readNow = read;
  const pas = q.pas ? PAS[q.pas] : null;
  try { (window as any).__elliQ = { id: q.id, ans: q.ans, op: q.op, kind: q.kind, a: (q as any).a, b: (q as any).b, ask: (q as any).ask, n: q.n, sol: q.sol, rows: q.rows, err: q.err, sk: q.sk }; } catch (e) { /* test hook */ }
  useEffect(() => {
    setTries(0); setWrong([]); setHelp(false); setReveal(false); setDone(false); setVal(""); setUl(new Set()); setArmed(false); setQhl(false); setChips([]); setSteps(-1); setSignPick(""); setMsg(""); recorded.current = false; setBvals((q.rows || []).map(() => ["", "", ""])); setBst(null); setShowTot(false);
    const lines: string[] = [];
    if (i === 0 && check) lines.push(CHECK_INTRO); if (i === 0 && sess.kind === "rim") lines.push(RIM_INTRO); if (i === 0 && sess.kind === "sign") lines.push(SIGN_INTRO); if (q.sk === "bld" && !check && !said.current.bld) { said.current.bld = true; lines.push(BLD_INTRO); }
    if (q.kind === "sign") { setPhase("sign"); if (q.ask === "word" && readNow && q.say) lines.push(q.say); lines.push(q.ask === "word" ? SIGN_WORD : SIGN_LOOK); }
    else { setPhase(q.op && !check ? "think" : "ans"); if (q.kind === "spell") lines.push(q.say || ""); else if (readNow) { const prev = i > 0 ? QBY[ids[i - 1]] : null; if (pas && pas.read && (!prev || prev.pas !== q.pas)) lines.push(pas.text); if (q.say) lines.push(q.say); } else if (!check && !rim && !said.current.tap) { said.current.tap = true; lines.push(TAP_WORD); } }
    if (lines.length) say(lines.filter(Boolean)); else stopAudio();
    let t = 0; if (q.op && q.kind !== "sign" && !check) t = window.setTimeout(() => setPhase("ans"), 1300);
    return () => window.clearTimeout(t);
  }, [i, ids[i]]);
  const record = (ok: boolean, isSign: boolean, viaHelp = false) => {
    if (recorded.current) return; recorded.current = true; res.current.push({ id: q.id, sk: q.sk, ok, help: viaHelp, sign: isSign });
    upd((g) => { const it = g.items[q.id] || { a: 0, c: 0, m: 0, h: 0, last: 0, flag: false, ok: 0 }; it.a++; it.last = Date.now(); if (ok) { it.c++; it.ok++; if (it.ok >= 2) it.flag = false; } else { it.ok = 0; it.flag = true; if (viaHelp) it.h++; else it.m++; } g.items[q.id] = it;
      if (!check) { const s = g.sk[q.sk] || { t: 0, c: 0, rec: [], last: "" }; s.t++; if (ok) s.c++; s.rec = [...s.rec, ok ? 1 : 0].slice(-20); s.last = today(); g.sk[q.sk] = s; }
      if (ok) { g.first++; g.stars++; g.run++; g.best = Math.max(g.best, g.run); } else g.run = 0;
      if (!g.days.includes(today())) g.days.push(today()); });
  };
  const logSign = (bad: boolean) => upd((g) => { g.sign.t++; if (bad) g.sign.m++; g.sign.log = [...g.sign.log, [new Date().toISOString(), bad ? 1 : 0] as [string, number]].slice(-400); });
  const extraSign = () => { if (check) return; const more = choose(prog, [prog.lvl === "chal" ? "sd3" : "sd"], 1, new Set(ids)); if (more.length) setIds((x) => [...x.slice(0, i + 2), more[0], ...x.slice(i + 2)]); };
  const logBld = (e: string) => upd((g) => { g.bld.t++; if (e !== "ok") g.bld.e[e] = (g.bld.e[e] || 0) + 1; g.bld.log = [...g.bld.log, [new Date().toISOString(), e] as [string, string]].slice(-400); });
  const extraBld = () => { if (check) return; const more = choose(prog, ["bld"], 1, new Set(ids)); if (more.length) setIds((x) => [...x.slice(0, i + 2), more[0], ...x.slice(i + 2)]); };
  const BLD_MSG: Record<string, [string, string]> = { kept: ["🔍 You kept the hundred! Take it away after you trade.", BLD_KEPT], drop: ["🔍 Where did the 10 new tens go?", BLD_DROP], tens: ["🔍 Count the tens again, then add it back up.", BLD_TENS], keptTen: ["🔍 Count again, then add it back up.", BLD_TENS], other: ["🔍 Add it back up. Does it make the number?", BLD_TENS], nocheck: ["🔍 Add it back up. It doesn't make the number!", BLD_NOCHECK] };
  function submitBuild() {
    if (done) return; const st = rowCheck(q, bvals); setBst(st); if (!check) setShowTot(true);
    if (st.every((x) => x.ok)) { const first = tries === 0 && !help && !reveal && !recorded.current; if (first) { record(true, false); logBld("ok"); } setDone(true); setMsg(first ? "⭐ First try! +1 star · Every row makes " + q.n : "✅ Every row makes " + q.n + "!"); say(first ? correctLine() : AFTER); return; }
    const bad = st.filter((x) => !x.ok).map((x) => x.err); const real = bad.filter((e) => !["blank", "same", "regular"].includes(e));
    if (!real.length) { const e = bad.includes("blank") ? "blank" : bad.includes("same") ? "same" : "regular"; setMsg(e === "blank" ? "Fill in every box (use 0 for none)." : e === "same" ? "That way is already on your list!" : "Make the trade the question asks for!"); say(e === "blank" ? BLD_BLANK : e === "same" ? BLD_SAME : BLD_REGULAR); return; }
    const e = real.includes("kept") ? "kept" : real.includes("drop") ? "drop" : real[0]; if (!recorded.current && !help) record(false, false); logBld(e); if (e === "kept") extraBld();
    setBvals((v) => v.map((r, k) => (st[k].ok ? r : ["", "", ""]))); const nt = tries + 1; setTries(nt);
    if (nt >= (check ? 2 : 3)) { setReveal(true); setBvals((q.rows || []).map((r) => r.g.map(() => ""))); setBst(null); setShowTot(false); setMsg("One way: " + (q.sol || []).map((r) => `${r[0]} H, ${r[1]} T, ${r[2]} O`).join(" · ") + ". Now you fill it in!"); say(e === "kept" ? [BLD_KEPT, REVEAL] : REVEAL); return; }
    const m = BLD_MSG[e] || BLD_MSG.other; setMsg(m[0]); say(m[1]);
  }
  const correctLine = () => { const n = res.current.filter((r) => r.ok).length; return n % 3 === 0 || Math.random() < 0.25 ? pick(DAD) : pick(SHORT); };
  function submit(v: string) {
    if (done) return; const ok = norm(v) === norm(q.ans);
    let signBad = false; if (!ok && q.op && q.a != null && q.b != null) { const other = q.op === "-" ? q.a + q.b : Math.abs(q.a - q.b); signBad = Number(v) === other; }
    if (ok) { const first = tries === 0 && !help && !reveal && !recorded.current; if (first) { record(true, false); if (q.op && q.kind !== "sign") logSign(false); if (q.sk === "bld") logBld("ok"); } setDone(true); setMsg(first ? "⭐ First try! +1 star" : "✅ You got it!");
      say(first ? correctLine() : AFTER); return; }
    const be = !ok && q.err ? q.err[v] || "other" : ""; if (q.sk === "bld" && !ok && !recorded.current && !help) { logBld(be); if (be === "kept") extraBld(); }
    if (!recorded.current && !help) { record(false, signBad); if (q.op && q.kind !== "sign") logSign(signBad); }
    if (signBad) { if (q.kind === "sign") logSign(true); extraSign(); }
    const nt = tries + 1; setTries(nt); if (q.kind === "mc") setWrong((w) => [...w, v]); else setVal("");
    if (nt >= (check ? 2 : 3)) { setReveal(true); setMsg("Answer: " + q.ans); say(signBad ? [q.op === "-" ? SIGN_OOPS_ADDED : SIGN_OOPS_SUBBED, REVEAL] : REVEAL); }
    else if (be && BLD_MSG[be]) { setMsg(BLD_MSG[be][0]); say(BLD_MSG[be][1]); }
    else { setMsg(signBad ? "🔍 Look at the sign first!" : "Try again 💗"); say(signBad ? (q.op === "-" ? SIGN_OOPS_ADDED : SIGN_OOPS_SUBBED) : pick(TRY)); }
  }
  function tapSign(op: string) {
    if (phase !== "sign") return; if (op === q.op) { if (!signPick) logSign(false); setSignPick(op); say(q.ask === "word" ? (op === "+" ? SIGN_YES_WADD : SIGN_YES_WSUB) : op === "+" ? SIGN_YES_ADD : SIGN_YES_SUB); setPhase("think"); window.setTimeout(() => setPhase("ans"), 2200); }
    else { setSignPick("x" + op); logSign(true); if (!recorded.current && !help) record(false, true); setTries((t) => t + 1); say(SIGN_NO); setMsg("🔍 Look again at the sign!"); }
  }
  function showMe() { if (check) return; if (!recorded.current) record(false, false, true); upd((g) => { g.shows++; }); setHelp(true); setSteps(0); say([SHOW_INTRO, q.steps[0].say]);
    if (!ids.slice(i + 1).includes(q.id)) setIds((x) => [...x.slice(0, Math.min(x.length, i + 4)), q.id, ...x.slice(Math.min(x.length, i + 4))]); }
  function next() { stopAudio(); if (i + 1 >= ids.length) { p.onDone(res.current); return; } setI(i + 1); }
  const sym = q.op === "+" ? "+" : "−"; const tapMode: "plain" | "tap" | "rim" = check ? "plain" : rim ? "rim" : read ? "plain" : "tap";
  const sumLine = <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><button onClick={() => { stopAudio(); p.onExit(); }} style={{ ...btn(LAV), padding: "6px 12px", fontSize: 15 }}>🏰 Home</button><div style={{ fontWeight: 800, color: DEEP, fontSize: 15 }}>{sk.icon} {sess.title} · {i + 1}/{ids.length}</div><div style={{ fontWeight: 800, color: DEEP }}>⭐{prog.stars}</div></div>;
  const progress = <div style={{ height: 10, background: "#ffe0ef", borderRadius: 5, marginBottom: 10 }}><div style={{ width: `${(i / ids.length) * 100}%`, height: 10, borderRadius: 5, background: "linear-gradient(90deg,#ff7eb3,#b39ddb)" }} /></div>;
  if (steps >= 0) { const st = q.steps[steps]; return <div style={{ padding: 14 }}>{sumLine}<div style={card}><div style={{ fontWeight: 900, color: DEEP, fontSize: 18 }}>💡 Show me how · step {steps + 1} of {q.steps.length}</div>
    <div style={{ fontSize: 16, color: INK, margin: "6px 0 10px", opacity: 0.8 }}>{q.txt}</div>{V({ v: st.v })}<div style={{ fontSize: 26, fontWeight: 900, color: INK, textAlign: "center", margin: "12px 0" }}>{st.t}</div>
    <div style={{ fontSize: 17, color: INK, textAlign: "center", background: "#fff4fa", borderRadius: 14, padding: 10 }}>{st.say}</div>
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}><button onClick={() => say(st.say)} style={btn(LAV)}>🔊 Again</button>
      {steps > 0 && <button onClick={() => { setSteps(steps - 1); say(q.steps[steps - 1].say); }} style={btn("#f48fb1")}>⬅ Back</button>}
      {steps + 1 < q.steps.length ? <button onClick={() => { setSteps(steps + 1); say(q.steps[steps + 1].say); }} style={btn(PINK)}>Next step ➜</button> : <button onClick={() => { setSteps(-1); say(SHOW_END); }} style={btn("#43a047")}>I'll try it! ✨</button>}</div></div></div>; }
  const choices = q.ch || []; const lockAns = q.kind === "sign" ? phase !== "ans" : phase === "think";
  const learnLink = !check && LBY[q.sk] && p.onLearn ? <div style={{ textAlign: "center", marginBottom: 8 }}><button onClick={() => { stopAudio(); p.onLearn && p.onLearn(q.sk); }} style={{ ...btn("#fff"), color: DEEP, border: "2px solid #ffc1e3", padding: "4px 12px", fontSize: 14 }}>📚 Learn It first: {LBY[q.sk].title}</button></div> : null;
  return <div style={{ padding: 14 }}>{sumLine}{progress}{learnLink}<div style={card}>
    {rim && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>{[["2x", "👀 Read it 2 times"], ["q", "❓ Find the question"], ["u", "✏️ Underline key words"]].map(([k, l]) => <button key={k} onClick={() => { setChips((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k])); if (k === "q") setQhl(!qhl); }} style={{ ...btn(chips.includes(k) ? "#43a047" : "#fff"), color: chips.includes(k) ? "#fff" : INK, border: "2px solid #ffc1e3", padding: "6px 10px", fontSize: 14 }}>{chips.includes(k) ? "✓ " : ""}{l}</button>)}</div>}
    {pas && <div style={{ background: "#fffaf0", border: "2px solid #ffe0b2", borderRadius: 18, padding: 12, marginBottom: 10 }}><div style={{ fontWeight: 900, color: DEEP, marginBottom: 4 }}>📜 {pas.title}</div><Words pfx="p" text={pas.text} mode={tapMode} ul={ul} onUl={(k) => setUl((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; })} armed={armed} onHint={() => { setArmed(false); upd((g) => { g.hints++; }); }} qhl={false} size={19} />
      {read && !check && pas.read && <button onClick={() => say(pas.text)} style={{ ...btn(LAV), padding: "6px 12px", fontSize: 14, marginTop: 6 }}>🔊 Read the story</button>}</div>}
    {q.kind === "sign" ? <div style={{ textAlign: "center" }}>{q.ask === "word" ? <Words pfx="s" text={q.txt} mode={tapMode} qhl={qhl} /> : <div style={{ fontSize: 50, fontWeight: 900, color: INK }}>{q.a} <span style={{ display: "inline-flex", width: 70, height: 70, borderRadius: 35, alignItems: "center", justifyContent: "center", border: signPick === q.op ? "6px solid " + (q.op === "+" ? "#43a047" : "#e53935") : "6px dashed #ffc1e3", color: q.op === "+" ? "#2e7d32" : "#c62828", transform: signPick === q.op ? "scale(1.15)" : "none", transition: "all .3s", background: "#fff" }}>{sym}</span> {q.b} = <span style={{ color: DEEP }}>?</span></div>}</div>
      : <div>{q.kind === "spell" ? <div style={{ textAlign: "center", fontSize: 22, fontWeight: 800, color: INK }}>🐝 {q.txt}</div> : <Words pfx="q" text={q.txt} mode={tapMode} ul={ul} onUl={(k) => setUl((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; })} armed={armed} onHint={() => { setArmed(false); upd((g) => { g.hints++; }); }} qhl={qhl} size={q.txt.length > 90 ? 20 : 24} />}
        {q.sk === "bld" && !check && /3/.test(String(q.n) + q.ans) && <ThreeTip />}
        {q.kind === "build" && !check ? <Trade n={q.n || 0} /> : q.v && <div style={{ margin: "10px 0" }}>{V({ v: q.v })}</div>}</div>}
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", margin: "8px 0" }}>
      {q.kind === "spell" && <button onClick={() => say(q.say || "")} style={{ ...btn(LAV), padding: "6px 12px", fontSize: 15 }}>🔊 Hear the word</button>}
      {!check && read && q.say && q.kind !== "spell" && <button onClick={() => say(q.say || "")} style={{ ...btn(LAV), padding: "6px 12px", fontSize: 15 }}>🔊 Read it again</button>}
      {rim && !check && <button onClick={() => { setArmed(true); say(RIM_HINT); }} style={{ ...btn(armed ? "#ffb300" : "#fff"), color: armed ? "#fff" : INK, border: "2px solid #ffd54f", padding: "4px 10px", fontSize: 13 }}>🔈 {armed ? "tap one word" : "hint: 1 word"}</button>}
      {!check && !done && <button onClick={showMe} style={{ ...btn("#ffb74d"), padding: "6px 12px", fontSize: 15 }}>💡 Show me how</button>}</div>
    {q.kind === "sign" && phase === "sign" && <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "8px 0" }}><button onClick={() => tapSign("+")} style={{ ...btn("#43a047", true), opacity: signPick === "x+" ? 0.4 : 1 }}>➕ {q.ask === "word" ? "Add" : "Plus"}</button><button onClick={() => tapSign("-")} style={{ ...btn("#e53935", true), opacity: signPick === "x-" ? 0.4 : 1 }}>➖ {q.ask === "word" ? "Subtract" : "Minus"}</button></div>}
    {phase === "think" && <div style={{ textAlign: "center", fontWeight: 900, color: DEEP, fontSize: 20, margin: 6 }}>🤔 Think first… {rim ? "" : q.op === "-" ? "take away = smaller" : q.op === "+" ? "add = bigger" : ""}</div>}
    {msg && <div style={{ textAlign: "center", fontWeight: 900, color: done ? "#2e7d32" : DEEP, fontSize: 20, margin: 6 }}>{msg}</div>}
    {!done && q.kind === "mc" && <div style={{ display: "grid", gridTemplateColumns: choices.some((c) => c.length > 14) ? "1fr" : "1fr 1fr", gap: 8 }}>{choices.map((c) => { const off = wrong.includes(c) || (reveal && c !== q.ans); return <button key={c} disabled={off || lockAns} onClick={() => submit(c)} style={{ ...btn(reveal && c === q.ans ? "#43a047" : PINK), opacity: off ? 0.3 : 1, fontSize: c.length > 20 ? 16 : 20, padding: "14px 10px" }}>{c}</button>; })}</div>}
    {!done && (q.kind === "num" || q.kind === "sign") && (q.kind !== "sign" || phase !== "sign") && <Pad val={val} set={setVal} ok={() => submit(val)} dis={lockAns} />}
    {!done && q.kind === "spell" && <Spell onOk={submit} />}
    {q.kind === "build" && <BuildRows q={q} vals={bvals} setVals={setBvals} st={bst} showTot={showTot} dis={done} noCheck={check} onOk={submitBuild} onCheck={() => { setBst(rowCheck(q, bvals)); setShowTot(true); say(BLD_CHECK); }} />}
    {done && <div style={{ textAlign: "center", marginTop: 8 }}><button onClick={next} style={btn("#43a047", true)}>{i + 1 >= ids.length ? "Finish 🎉" : "Next ➜"}</button></div>}
  </div></div>;
}
function Spell(p: { onOk: (s: string) => void }) {
  const [v, setV] = useState(""); const ref = useRef<HTMLInputElement>(null);
  return <div style={{ textAlign: "center" }}><input ref={ref} value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && v.trim()) { p.onOk(v); setV(""); } }} autoCapitalize="none" autoCorrect="off" autoComplete="off" spellCheck={false} placeholder="type here" style={{ fontSize: 30, fontWeight: 800, textAlign: "center", border: "3px solid #ffc1e3", borderRadius: 18, padding: 10, width: "80%", maxWidth: 280, color: INK, fontFamily: "inherit" }} />
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 8 }}><button onClick={() => setV(v + "'")} style={{ ...btn(LAV), padding: "8px 14px" }}>'</button><button onClick={() => { if (v.trim()) { p.onOk(v); setV(""); } }} style={btn("#43a047")}>✓ Check</button></div><div style={{ fontSize: 13, color: INK, opacity: 0.7, marginTop: 4 }}>{SPELL_TIP}</div></div>;
}

/* ---------- sessions ---------- */
function questIds(p: Prog): string[] {
  const L = p.lvl; const sr = signRate(p); const sign = sr.t >= 5 && sr.m / sr.t > 0.15 ? 4 : 3;
  const flagged = BANK.filter((q) => p.items[q.id] && p.items[q.id].flag && SK[q.sk].lv === L).sort((a, b) => p.items[a.id].last - p.items[b.id].last).slice(0, 3).map((q) => q.id);
  const used = new Set(flagged); const take = (sks: string[], n: number) => { const x = choose(p, sks, n, used); x.forEach((y) => used.add(y)); return x; };
  return [...flagged, ...take(lvlSkills(p, "sign"), sign), ...(L === "core" ? take(["bld"], 1) : []), ...take(lvlSkills(p, "math").filter((k) => k !== "bld"), 2), ...take(lvlSkills(p, "read"), 2), ...take(lvlSkills(p, "spell"), 2), ...take(lvlSkills(p, "rim"), 2)];
}
function checkIds(p: Prog): string[] {
  const L = p.lvl; const since = new Date(Date.now() - 14 * 864e5); const sinceS = `${since.getFullYear()}-${String(since.getMonth() + 1).padStart(2, "0")}-${String(since.getDate()).padStart(2, "0")}`;
  const recent = Object.entries(p.sk).filter(([k, s]) => SK[k] && SK[k].lv === L && s.last >= sinceS).sort((a, b) => (a[1].last < b[1].last ? 1 : -1)).map(([k]) => k);
  const must = [L === "chal" ? "sd3" : "sd", L === "chal" ? "rmw2" : "rmw", ...(L === "core" ? ["bld"] : [])]; const bySubj = ["math", "read", "spell"].map((s) => recent.find((k) => SK[k].subj === s) || lvlSkills(p, s)[0]);
  const skills = Array.from(new Set([...must, ...bySubj, ...recent])).slice(0, 6);
  const fresh = new Set(BANK.filter((q) => p.items[q.id] && Date.now() - p.items[q.id].last < 864e5).map((q) => q.id));
  const out: string[] = []; skills.forEach((k) => { let x = choose(p, [k], 2, new Set([...fresh, ...out])); if (x.length < 2) x = choose(p, [k], 2, new Set(out)); out.push(...x); });
  return shuffle(out);
}
export function mastery(p: Prog, sk: string): { label: string; e: string; c: number; t: number } {
  const ch = p.checks.filter((c) => c.per[sk]).slice(-3); const t = ch.reduce((n, c) => n + c.per[sk].t, 0), c = ch.reduce((n, x) => n + x.per[sk].c, 0);
  if (!t) return { label: "Not checked yet", e: "⚪", c, t }; const r = c / t;
  return r >= 0.85 && t >= 3 ? { label: "Mastered", e: "🌟", c, t } : r >= 0.6 ? { label: "Getting there", e: "🌱", c, t } : { label: "Needs practice", e: "💗", c, t };
}
function bldRate(p: Prog, days = 7) { const since = Date.now() - days * 864e5; const l = (p.bld ? p.bld.log : []).filter(([d]) => new Date(d).getTime() >= since); const c = (e: string) => l.filter(([, x]) => x === e).length; return { t: l.length, ok: c("ok"), kept: c("kept"), tens: c("tens") + c("keptTen"), drop: c("drop"), nocheck: c("nocheck") }; }
function weakSkills(p: Prog) { return Object.entries(p.sk).filter(([k, s]) => SK[k] && s.rec.length >= 3).map(([k, s]) => ({ k, acc: s.rec.reduce((a, b) => a + b, 0) / s.rec.length, n: s.rec.length, flagged: BANK.filter((q) => q.sk === k && p.items[q.id] && p.items[q.id].flag).length })).filter((x) => x.acc < 0.8 || x.flagged > 0).sort((a, b) => a.acc - b.acc); }

/* ---------- parent report text ---------- */
function reportText(p: Prog): string {
  const sr = signRate(p, 7), sa = signRate(p, 3650); const L: string[] = [];
  L.push(`Elli's Sparkle Castle — Parent Report (${VERSION}) — ${new Date().toLocaleString("en-US")}`);
  L.push(`Level: ${p.lvl === "core" ? "2nd grade (current GCPS units)" : "Challenge (Unit 5 + 3rd grade prep)"} · Read-aloud: ${p.readMode === "fade" ? fadePhase().label : p.readMode === "always" ? "always read to her" : "she reads on her own"}`);
  L.push(`Stars: ${p.stars} · First-try correct: ${p.first} · Best run: ${p.best} in a row · Quest streak: ${runDays(p.questDays)} day(s) · Days practiced: ${p.days.length} · Stickers: ${p.stickers.length}/${STICKERS.length}`);
  L.push(`Sign mistakes (added when it said subtract, or the reverse): last 7 days ${sr.m}/${sr.t}${sr.t ? ` (${Math.round((100 * sr.m) / sr.t)}%)` : ""} · all time ${sa.m}/${sa.t}`);
  { const b7 = bldRate(p, 7), ba = bldRate(p, 3650); L.push(`Build It Different Ways (hundreds/tens/ones, class worksheet 11/11): last 7 days ${b7.ok} right first try of ${b7.t} logged · "kept the hundred after trading" ${b7.kept} (all time ${ba.kept}) · miscounted tens ${b7.tens} · traded but lost the 10 tens ${b7.drop} · didn't add it back up ${b7.nocheck}`); }
  { const done = LESSONS.filter((l) => p.lessons[l.sk] && p.lessons[l.sk].done); L.push(`Learn It lessons watched: ${done.length} of ${LESSONS.length}${done.length ? " — " + done.map((l) => `${l.title} (${p.lessons[l.sk].v}x, ${p.lessons[l.sk].last})`).join(", ") : ""}`); }
  L.push(`"Show me how" used: ${p.shows} · Read It Myself word hints used: ${p.hints}`);
  L.push(""); L.push("CHECK-UPS:"); if (!p.checks.length) L.push("  none yet");
  p.checks.slice(-8).forEach((c) => L.push(`  ${c.d}: ${c.c}/${c.n} first-try (${Math.round((100 * c.c) / Math.max(1, c.n))}%) — ` + Object.entries(c.per).map(([k, v]) => `${SK[k] ? SK[k].name : k} ${v.c}/${v.t}`).join(", ")));
  L.push(""); L.push("MASTERY (from recent check-ups):"); const ck = Array.from(new Set(p.checks.flatMap((c) => Object.keys(c.per)))); if (!ck.length) L.push("  none yet");
  ck.forEach((k) => { const m = mastery(p, k); if (SK[k]) L.push(`  ${SK[k].name}: ${m.label} (${m.c}/${m.t})`); });
  L.push(""); L.push("WEAK SPOTS (practice accuracy, last 20 tries):"); const w = weakSkills(p); const bk = bldRate(p, 14); if (bk.kept) L.push(`  Kept the hundred after trading it for 10 tens: ${bk.kept} time(s) in 14 days (extra Build It practice added automatically)`); if (!w.length && !bk.kept) L.push("  none right now");
  w.slice(0, 8).forEach((x) => L.push(`  ${SK[x.k].name} [${SK[x.k].std}]: ${Math.round(x.acc * 100)}% · ${x.flagged} question(s) waiting for review`));
  const miss = BANK.filter((q) => p.items[q.id] && p.items[q.id].flag).sort((a, b) => p.items[b.id].m + p.items[b.id].h - (p.items[a.id].m + p.items[a.id].h)).slice(0, 6);
  if (miss.length) { L.push(""); L.push("Questions she missed most:"); miss.forEach((q) => L.push(`  • ${q.txt.slice(0, 90)} (answer: ${q.ans})`)); }
  return L.join("\n");
}
async function copyText(t: string): Promise<boolean> {
  try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(t); return true; } } catch (e) { /* fall back */ }
  try { const ta = document.createElement("textarea"); ta.value = t; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, t.length); const ok = document.execCommand("copy"); document.body.removeChild(ta); return ok; } catch (e) { return false; }
}

/* ---------- screens ---------- */
const ACCS: { e: string; n: string; cost: number }[] = [{ e: "", n: "Just me", cost: 0 }, { e: "🎀", n: "Pink bow", cost: 10 }, { e: "🌸", n: "Flower crown", cost: 25 }, { e: "👑", n: "Princess crown", cost: 45 }, { e: "🦋", n: "Butterfly friend", cost: 70 }, { e: "✨", n: "Sparkle cape", cost: 100 }, { e: "🌈", n: "Rainbow wings", cost: 140 }, { e: "💎", n: "Diamond tiara", cost: 200 }, { e: "🏰", n: "Castle tower", cost: 300 }];
const SUBJ = [{ k: "math", n: "Math Magic", e: "🦄", c: "linear-gradient(135deg,#ff7eb3,#ff5fa2)" }, { k: "read", n: "Reading Garden", e: "🦋", c: "linear-gradient(135deg,#c39bff,#9575cd)" }, { k: "spell", n: "Spelling Bee", e: "🐝", c: "linear-gradient(135deg,#ff9ecf,#f06292)" }];
const NOW = { math: "Unit 4: Place value to 1,000 — building numbers with hundreds, tens & ones (+ Unit 3 measuring review)", read: "EL Module 2: Fossils Tell of Earth's Changes", spell: "Skills Block: oi/oy, ou/ow, old/ind, doubling, -ed, oo/ew/ue, -tion" };
const NOW_CH = { math: "Unit 5 preview: add & subtract within 1,000, plus 3rd grade prep", read: "Main idea, inference & text features (3rd grade prep)", spell: "Module 3 preview: -le, -tch, -dge, prefixes & suffixes" };
function Hold(p: { onOpen: () => void }) {
  const [pr, setPr] = useState(0); const t = useRef(0);
  const start = () => { const st = Date.now(); window.clearInterval(t.current); t.current = window.setInterval(() => { const x = (Date.now() - st) / 3000; if (x >= 1) { window.clearInterval(t.current); setPr(0); p.onOpen(); } else setPr(x); }, 50); };
  const stop = () => { window.clearInterval(t.current); setPr(0); };
  return <button onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop} onContextMenu={(e) => e.preventDefault()} style={{ ...btn("#fff"), color: INK, border: "2px solid #e1bee7", fontSize: 14, padding: "8px 14px", position: "relative", overflow: "hidden", userSelect: "none", WebkitUserSelect: "none" } as CSSProperties}>
    <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pr * 100}%`, background: "#f8bbd0" }} /><span style={{ position: "relative" }}>👨 Grown-ups: hold 3 seconds</span></button>;
}
function App() {
  const [prog, setProg] = useState<Prog>(load); const [scr, setScr] = useState<string>("home"); const [sess, setSess] = useState<Sess | null>(null); const [sum, setSum] = useState<{ res: Res[]; kind: string; got: Sticker[] } | null>(null); const [sub, setSub] = useState("math"); const [toast, setToast] = useState<Sticker[]>([]); const [copied, setCopied] = useState(""); const [lsk, setLsk] = useState("bld"); const greeted = useRef(false);
  const upd = (f: (p: Prog) => void) => setProg((old) => { const n: Prog = JSON.parse(JSON.stringify(old)); f(n); save(n); return n; });
  useEffect(() => { const h = () => { unlockAudio(); if (!greeted.current) { greeted.current = true; } }; window.addEventListener("pointerdown", h, { capture: true }); window.addEventListener("touchend", h, { capture: true }); return () => { window.removeEventListener("pointerdown", h, { capture: true } as any); window.removeEventListener("touchend", h, { capture: true } as any); }; }, []);
  const start = (s: Sess) => { if (!s.ids.length) return; unlockAudio(); setSess(s); setScr("play"); if (s.kind === "quest") say(QUEST_INTRO); };
  const finish = (res: Res[]) => {
    const kind = sess ? sess.kind : "practice"; let got: Sticker[] = []; let newMaster = false;
    upd((g) => { if (kind !== "check" && res.length >= 8 && res.every((r) => r.ok)) g.perfect++; if (kind === "quest" && !g.questDays.includes(today())) g.questDays.push(today());
      if (kind === "check") { const per: Record<string, { t: number; c: number }> = {}; res.forEach((r) => { per[r.sk] = per[r.sk] || { t: 0, c: 0 }; per[r.sk].t++; if (r.ok) per[r.sk].c++; }); g.checks.push({ d: today(), n: res.length, c: res.filter((r) => r.ok).length, per }); g.checks = g.checks.slice(-60); }
      const ms = Object.entries(g.sk).filter(([, s]) => s.t >= 15 && s.c / s.t >= 0.8).map(([k]) => k); if (ms.some((k) => !g.mastered.includes(k))) newMaster = true; g.mastered = ms;
      got = newly(stats(g), g.stickers); got.forEach((s) => g.stickers.push(s.id)); });
    setTimeout(() => { setSum({ res, kind, got }); setScr("sum"); const perfect = kind !== "check" && res.length >= 8 && res.every((r) => r.ok); const lines = [kind === "check" ? CHECK_DONE : perfect ? ROUND_PERFECT : ROUND_DONE]; if (newMaster) lines.push(MASTER); if (got.length) { const RANK = { common: 0, rare: 1, sparkly: 2, legendary: 3 } as const; const top = got.reduce((a, b) => (RANK[b.rarity] > RANK[a.rarity] ? b : a)); lines.push(pick(top.rarity === "common" ? DAD_STICKER : DAD_RARE[top.rarity])); } say(lines); }, 30);
  };
  const acc = ACCS.find((a) => a.e === prog.acc) || ACCS[0];
  const wrap = (c: ReactNode) => <div style={{ maxWidth: 520, margin: "0 auto", minHeight: "100vh", fontFamily: "'Fredoka','Comic Sans MS','Chalkboard SE',system-ui,sans-serif", color: INK, paddingBottom: 30 }}>{c}</div>;
  const top = <div style={{ textAlign: "center", padding: "16px 10px 4px" }}><div style={{ fontSize: 54, lineHeight: 1 }}>🦄{acc.e}</div><div style={{ fontSize: 26, fontWeight: 900, color: DEEP, textShadow: "0 2px 0 #fff" }}>Princess Elli's Sparkle Castle</div>
    <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginTop: 6, fontWeight: 800 }}><span style={{ background: "#fff", borderRadius: 14, padding: "4px 10px" }}>⭐ {prog.stars}</span><span style={{ background: "#fff", borderRadius: 14, padding: "4px 10px" }}>🔥 {runDays(prog.questDays)} day quest streak</span><span style={{ background: "#fff", borderRadius: 14, padding: "4px 10px" }}>🎀 {prog.stickers.length}/{STICKERS.length}</span></div></div>;
  const lvlToggle = <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "10px 0" }}>{(["core", "chal"] as const).map((l) => <button key={l} onClick={() => upd((g) => { g.lvl = l; })} style={{ ...btn(prog.lvl === l ? DEEP : "#fff"), color: prog.lvl === l ? "#fff" : INK, border: "2px solid #ffc1e3", fontSize: 15, padding: "8px 12px" }}>{l === "core" ? "📘 2nd grade now" : "🚀 Challenge"}</button>)}</div>;
  if (scr === "play" && sess) return wrap(<Play key={sess.title + sess.ids.join()} prog={prog} upd={upd} sess={sess} onDone={finish} onExit={() => setScr("home")} toast={setToast} onLearn={(sk) => { setLsk(sk); setScr("lesson"); }} />);
  if (scr === "sum" && sum) { const n = sum.res.length, c = sum.res.filter((r) => r.ok).length; const sks = Array.from(new Set(sum.res.map((r) => r.sk)));
    return wrap(<div style={{ padding: 14 }}><div style={{ ...card, textAlign: "center" }}><div style={{ fontSize: 60 }}>{sum.kind === "check" ? "📋" : c === n ? "🏆" : "🌟"}</div><div style={{ fontSize: 26, fontWeight: 900, color: DEEP }}>{sum.kind === "check" ? "Check-Up done!" : "Round done!"}</div><div style={{ fontSize: 20, fontWeight: 800, margin: 6 }}>{c} of {n} right on the first try</div>
      {sum.kind === "check" && <div style={{ textAlign: "left", marginTop: 10 }}>{sks.map((k) => { const m = mastery(prog, k); const here = sum.res.filter((r) => r.sk === k); return <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff4fa", borderRadius: 14, padding: "8px 10px", margin: "6px 0" }}><span>{SK[k].icon} <b>{SK[k].name}</b><br /><span style={{ fontSize: 13 }}>today {here.filter((r) => r.ok).length}/{here.length}</span></span><span style={{ fontWeight: 900, color: m.label === "Mastered" ? "#2e7d32" : m.label === "Getting there" ? "#ef6c00" : DEEP }}>{m.e} {m.label}</span></div>; })}</div>}
      {sum.got.length > 0 && <div style={{ marginTop: 10 }}><div style={{ fontWeight: 900, color: DEEP }}>New stickers!</div><div style={{ fontSize: 44 }}>{sum.got.map((s) => s.e).join(" ")}</div><div>{sum.got.map((s) => s.name).join(", ")}</div></div>}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}><button onClick={() => setScr("home")} style={btn(PINK, true)}>🏰 Castle</button><button onClick={() => setScr("stickers")} style={btn(LAV, true)}>🎀 Stickers</button></div></div></div>); }
  if (scr === "subj") { const S0 = SUBJ.find((s) => s.k === sub)!; const list = SKILLS.filter((s) => s.subj === sub && s.lv === prog.lvl);
    return wrap(<div style={{ padding: 14 }}><button onClick={() => setScr("home")} style={{ ...btn(LAV), padding: "6px 12px", fontSize: 15 }}>🏰 Home</button>{lvlToggle}<div style={{ ...card }}><div style={{ fontSize: 26, fontWeight: 900, color: DEEP }}>{S0.e} {S0.n}</div><div style={{ fontSize: 14, marginBottom: 8 }}>Now learning: {(prog.lvl === "core" ? NOW : NOW_CH)[sub as "math"]}</div>
      <button onClick={() => start({ title: S0.n + " mix", kind: "practice", ids: choose(prog, list.map((s) => s.id), 10) })} style={{ ...btn(S0.c, true), width: "100%", marginBottom: 8 }}>✨ Mix it up (10)</button>
      {list.map((s) => { const st = prog.sk[s.id]; const acc = st && st.rec.length ? Math.round((100 * st.rec.reduce((a, b) => a + b, 0)) / st.rec.length) : -1; const fl = BANK.filter((q) => q.sk === s.id && prog.items[q.id] && prog.items[q.id].flag).length;
        return <button key={s.id} onClick={() => start({ title: s.name, kind: "practice", ids: choose(prog, [s.id], 10) })} style={{ ...btn("#fff"), color: INK, border: "3px solid #ffc1e3", width: "100%", textAlign: "left", margin: "4px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>{s.icon} {s.name}<br /><span style={{ fontSize: 12, fontWeight: 600 }}>{s.std}</span></span><span style={{ fontSize: 13 }}>{acc >= 0 ? acc + "%" : "new"}{fl ? ` · 🔁${fl}` : ""}</span></button>; })}</div></div>); }
  const practiceFor = (sk: string) => { const sj = SK[sk].subj; const title = SK[sk].name; start({ title, kind: sj === "sign" ? "sign" : sj === "rim" ? "rim" : "practice", ids: choose(prog, [sk], sj === "rim" ? 8 : 10) }); };
  if (scr === "lesson" && LBY[lsk]) return wrap(<LessonView key={lsk} l={LBY[lsk]} upd={upd} onBack={() => setScr("learn")} onPractice={() => practiceFor(lsk)} />);
  if (scr === "learn") { const groups: [string, string][] = [["math", "🦄 Math Magic"], ["sign", "🕵️‍♀️ Sign Detective"], ["rim", "📖 Read It Myself"], ["read", "🦋 Reading Garden"], ["spell", "🐝 Spelling Bee"]];
    return wrap(<div style={{ padding: 14 }}><button onClick={() => { stopAudio(); setScr("home"); }} style={{ ...btn(LAV), padding: "6px 12px", fontSize: 15 }}>🏰 Home</button>{lvlToggle}<div style={card}><div style={{ fontSize: 26, fontWeight: 900, color: DEEP }}>📚 Learn It</div><div style={{ fontSize: 14, marginBottom: 6 }}>Short lessons, one step at a time. Then try it yourself!</div>
      {groups.map(([sj, gl]) => { const list = LESSONS.filter((l) => SK[l.sk] && SK[l.sk].subj === sj && SK[l.sk].lv === prog.lvl); if (!list.length) return null; return <div key={sj}><div style={{ fontWeight: 900, color: DEEP, margin: "10px 0 4px" }}>{gl}</div>{list.map((l) => { const w = prog.lessons[l.sk]; return <button key={l.sk} data-lesson={l.sk} onClick={() => { setLsk(l.sk); setScr("lesson"); }} style={{ ...btn("#fff"), color: INK, border: "3px solid #ffc1e3", width: "100%", textAlign: "left", margin: "3px 0", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 16 }}><span>{SK[l.sk].icon} {l.title}</span><span style={{ fontSize: 13, color: w && w.done ? "#2e7d32" : DEEP }}>{w && w.done ? "✓ watched" : "▶ watch"}</span></button>; })}</div>; })}</div></div>); }
  if (scr === "garden") return wrap(<div style={{ padding: 14 }}><button onClick={() => { stopAudio(); setScr("home"); }} style={{ ...btn(LAV), padding: "6px 12px", fontSize: 15 }}>🏰 Home</button><Garden onEffort={() => upd((g) => { g.garden++; g.stars++; })} msg="" /></div>);
  if (scr === "stickers") { const got = new Set(prog.stickers); const st = stats(prog);
    return wrap(<div style={{ padding: 14 }}><button onClick={() => setScr("home")} style={{ ...btn(LAV), padding: "6px 12px", fontSize: 15 }}>🏰 Home</button><div style={{ ...card, marginTop: 10 }}><div style={{ fontSize: 24, fontWeight: 900, color: DEEP }}>🎀 Sticker Book · {got.size}/{STICKERS.length}</div><div style={{ fontSize: 13 }}>⭐ {st.stars} stars · {st.first} first-try · best run {st.best} · {st.perfect} perfect rounds · {st.master} skills mastered · {st.today}-day quest streak</div>
      {ALBUMS.map((al, a) => <div key={a} style={{ marginTop: 12 }}><div style={{ fontWeight: 900, color: DEEP }}>{al.e} {al.n}</div><div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>{STICKERS.filter((s) => s.album === a).map((s) => <div key={s.id} title={hint(s)} style={{ background: got.has(s.id) ? (s.rarity === "legendary" ? "linear-gradient(135deg,#fff59d,#f8bbd0)" : s.rarity === "sparkly" ? "#f3e5f5" : s.rarity === "rare" ? "#e3f2fd" : "#fff") : "#f5f5f5", borderRadius: 14, padding: 4, textAlign: "center", border: "2px solid #ffe0ef", minHeight: 70 }}><div style={{ fontSize: 28, filter: got.has(s.id) ? "none" : "grayscale(1) opacity(.3)" }}>{got.has(s.id) ? s.e : "🔒"}</div><div style={{ fontSize: 10, fontWeight: 700 }}>{got.has(s.id) ? s.name : hint(s)}</div></div>)}</div></div>)}
      <div style={{ marginTop: 14, fontWeight: 900, color: DEEP }}>👗 Dress up (unlock with stars)</div><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{ACCS.map((a) => <button key={a.n} disabled={prog.stars < a.cost} onClick={() => upd((g) => { g.acc = a.e; })} style={{ ...btn(prog.acc === a.e ? DEEP : "#fff"), color: prog.acc === a.e ? "#fff" : INK, border: "2px solid #ffc1e3", fontSize: 13, padding: "6px 10px", opacity: prog.stars < a.cost ? 0.4 : 1 }}>{a.e || "🦄"} {a.n}{prog.stars < a.cost ? ` (${a.cost}⭐)` : ""}</button>)}</div></div></div>); }
  if (scr === "parent") { const sr = signRate(prog, 7), sa = signRate(prog, 3650); const w = weakSkills(prog); const txt = reportText(prog); const ck = Array.from(new Set(prog.checks.flatMap((c) => Object.keys(c.per))));
    const row = (a: ReactNode, b: ReactNode) => <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px dashed #ffc1e3", fontSize: 15 }}><span>{a}</span><b style={{ textAlign: "right" }}>{b}</b></div>;
    return wrap(<div style={{ padding: 14 }}><button onClick={() => setScr("home")} style={{ ...btn(LAV), padding: "6px 12px", fontSize: 15 }}>🏰 Back to Elli's castle</button><div style={{ ...card, marginTop: 10 }}><div style={{ fontSize: 22, fontWeight: 900, color: DEEP }}>👨 Parent Report</div><div style={{ fontSize: 12, marginBottom: 8 }}>Saved only on this device. No accounts, nothing uploaded.</div>
      {row("Stars / first-try correct", `${prog.stars} / ${prog.first}`)}{row("Best run (in a row)", prog.best)}{row("Quest streak / days practiced", `${runDays(prog.questDays)} / ${prog.days.length}`)}{row("Stickers", `${prog.stickers.length}/${STICKERS.length}`)}
      {row("Sign mistakes, last 7 days", sr.t ? `${sr.m}/${sr.t} (${Math.round((100 * sr.m) / sr.t)}%)` : "no data yet")}{row("Sign mistakes, all time", `${sa.m}/${sa.t}`)}{row("Learn It lessons watched", `${LESSONS.filter((l) => prog.lessons[l.sk] && prog.lessons[l.sk].done).length} of ${LESSONS.length}`)}{(() => { const b = bldRate(prog, 7), ba = bldRate(prog, 3650); return <>{row("Build It: right first try (7 days)", b.t ? `${b.ok} of ${b.t}` : "no data yet")}{row("Build It: kept the hundred (7 days / all)", `${b.kept} / ${ba.kept}`)}{row("Build It: tens miscounted (7 days)", `${b.tens}`)}</>; })()}{row("Show me how used", prog.shows)}{row("Read It Myself word hints", prog.hints)}
      <div style={{ marginTop: 12, fontWeight: 900, color: DEEP }}>📋 Check-Ups</div>{prog.checks.length ? prog.checks.slice(-10).reverse().map((c, i) => <div key={i} style={{ fontSize: 14, padding: "4px 0", borderBottom: "1px dashed #eee" }}><b>{c.d}</b>: {c.c}/{c.n} ({Math.round((100 * c.c) / Math.max(1, c.n))}%) — {Object.entries(c.per).map(([k, v]) => `${SK[k] ? SK[k].name : k} ${v.c}/${v.t}`).join(", ")}</div>) : <div style={{ fontSize: 14 }}>No Check-Ups yet.</div>}
      {ck.length > 0 && <div style={{ marginTop: 8 }}>{ck.filter((k) => SK[k]).map((k) => { const m = mastery(prog, k); return <div key={k} style={{ fontSize: 14 }}>{m.e} {SK[k].name}: {m.label} ({m.c}/{m.t})</div>; })}</div>}
      <div style={{ marginTop: 12, fontWeight: 900, color: DEEP }}>💗 Weak spots</div>{(() => { const b = bldRate(prog, 14); return b.kept ? <div data-kept="1" style={{ fontSize: 14 }}>🧊 Kept the hundred after trading: {b.kept} time(s) in 14 days</div> : null; })()}{w.length ? w.slice(0, 8).map((x) => <div key={x.k} style={{ fontSize: 14 }}>{SK[x.k].icon} {SK[x.k].name}: {Math.round(x.acc * 100)}% · {x.flagged} to review</div>) : <div style={{ fontSize: 14 }}>None right now.</div>}
      <div style={{ marginTop: 12, fontWeight: 900, color: DEEP }}>⚙️ Settings</div>
      <div style={{ fontSize: 14, margin: "4px 0" }}>Read-aloud (getting ready for January tests):</div>{([["fade", "Fade out automatically"], ["always", "Always read to her"], ["self", "She reads on her own"]] as const).map(([k, l]) => <button key={k} onClick={() => upd((g) => { g.readMode = k; })} style={{ ...btn(prog.readMode === k ? DEEP : "#fff"), color: prog.readMode === k ? "#fff" : INK, border: "2px solid #ffc1e3", fontSize: 13, padding: "6px 10px", margin: 3 }}>{l}</button>)}
      <div style={{ fontSize: 12, margin: "4px 0 8px" }}>Fade schedule now: {fadePhase().label}. Read It Myself and Check-Up follow this too (Read It Myself is always on her own).</div>
      <div style={{ fontSize: 14 }}>Level: {lvlToggle}</div>
      <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}><button onClick={async () => { const ok = await copyText(txt); setCopied(ok ? "Copied! Paste it to your assistant." : "Couldn't copy. Select the text below and copy it."); }} style={btn("#43a047")}>📋 Copy report</button>{typeof navigator !== "undefined" && (navigator as any).share && <button onClick={() => { (navigator as any).share({ title: "Elli's report", text: txt }).catch(() => {}); }} style={btn(PINK)}>📤 Share report</button>}</div>
      {copied && <div style={{ fontWeight: 800, color: "#2e7d32", marginTop: 6 }}>{copied}</div>}
      <textarea readOnly value={txt} style={{ width: "100%", height: 160, marginTop: 8, fontSize: 12, borderRadius: 12, border: "2px solid #ffc1e3", padding: 8, boxSizing: "border-box" }} />
      <div style={{ fontSize: 12, marginTop: 8 }}>Curriculum: GaDOE Grade 2 math curriculum map (Unit 4 now), GCPS 2nd grade AKS, EL Education Grade 2 Module 2 + Skills Block, GPB Let's Learn GA! / Math Mights lessons. {VERSION}</div></div></div>); }
  const big = (e: string, n: string, d: string, bg: string, on: () => void) => <button onClick={on} style={{ ...btn(bg, true), width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 12, margin: "6px 0" }}><span style={{ fontSize: 40 }}>{e}</span><span><span style={{ fontSize: 22 }}>{n}</span><br /><span style={{ fontSize: 13, fontWeight: 600 }}>{d}</span></span></button>;
  const sr = signRate(prog);
  return wrap(<div style={{ padding: "0 14px" }}>{top}{lvlToggle}
    {big("🌈", "Today's Quest", runDays(prog.questDays) && prog.questDays.includes(today()) ? "Done today! Play again for more stars" : "A little of everything + your weak spots", "linear-gradient(135deg,#ff7eb3,#c39bff)", () => start({ title: "Today's Quest", kind: "quest", ids: questIds(prog) }))}
    {prog.lvl === "core" && big("🧊", "Build It Different Ways", (() => { const k = bldRate(prog, 7); return k.t ? `Like your class worksheet! Kept-the-hundred oopsies this week: ${k.kept}` : "Like your class worksheet! Hundreds, tens & ones"; })(), "linear-gradient(135deg,#f06292,#7e57c2)", () => start({ title: "Build It Different Ways", kind: "practice", ids: choose(prog, ["bld"], 8) }))}
    {big("📚", "Learn It", (() => { const n = LESSONS.filter((l) => prog.lessons[l.sk] && prog.lessons[l.sk].done).length; return n ? `Lessons watched: ${n} of ${LESSONS.length}` : "Short lessons, step by step"; })(), "linear-gradient(135deg,#4fc3f7,#9575cd)", () => setScr("learn"))}
    {big("🕵️‍♀️", "Sign Detective", sr.t ? `Find the sign first! Sign mistakes this week: ${sr.m}` : "Find the sign first, then solve", "linear-gradient(135deg,#66bb6a,#ef5350)", () => start({ title: "Sign Detective", kind: "sign", ids: choose(prog, lvlSkills(prog, "sign"), 10) }))}
    {big("📖", "Read It Myself", "Test practice: I read the questions on my own", "linear-gradient(135deg,#ffb74d,#f06292)", () => start({ title: "Read It Myself", kind: "rim", ids: choose(prog, lvlSkills(prog, "rim"), 8) }))}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>{SUBJ.map((s) => <button key={s.k} onClick={() => { setSub(s.k); setScr("subj"); }} style={{ ...btn(s.c), padding: "14px 4px", fontSize: 15 }}><div style={{ fontSize: 34 }}>{s.e}</div>{s.n}</button>)}</div>
    {big("📋", "Check-Up", prog.checks.length ? `Last: ${prog.checks[prog.checks.length - 1].c}/${prog.checks[prog.checks.length - 1].n} on ${prog.checks[prog.checks.length - 1].d}` : "Show what you learned! No hints", "linear-gradient(135deg,#9575cd,#5c6bc0)", () => start({ title: "Check-Up", kind: "check", ids: checkIds(prog) }))}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><button onClick={() => { setScr("garden"); }} style={{ ...btn("linear-gradient(135deg,#81c784,#aed581)"), padding: "14px 4px" }}><div style={{ fontSize: 34 }}>🌷</div>Talking Garden</button><button onClick={() => setScr("stickers")} style={{ ...btn("linear-gradient(135deg,#f8bbd0,#ce93d8)"), padding: "14px 4px" }}><div style={{ fontSize: 34 }}>🎀</div>Sticker Book</button></div>
    <div style={{ ...card, marginTop: 12, fontSize: 13 }}><b style={{ color: DEEP }}>What Elli's class is learning now</b><br />🦄 {(prog.lvl === "core" ? NOW : NOW_CH).math}<br />🦋 {(prog.lvl === "core" ? NOW : NOW_CH).read}<br />🐝 {(prog.lvl === "core" ? NOW : NOW_CH).spell}</div>
    <div style={{ textAlign: "center", marginTop: 12 }}><button onClick={() => say(WELCOME)} style={{ ...btn(LAV), fontSize: 14, padding: "6px 12px", marginBottom: 8 }}>🔊 Hi Elli!</button><br /><Hold onOpen={() => setScr("parent")} /><div style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>{VERSION}</div></div>
  </div>);
}
const st = document.createElement("style"); st.textContent = "@keyframes elliIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:none}}@keyframes elliPop{0%{opacity:0;transform:scale(.85)}70%{transform:scale(1.04)}100%{opacity:1;transform:scale(1)}}@keyframes elliGlow{0%,100%{background-color:#fff59d}50%{background-color:#ffd54f}}@font-face{font-family:'Fredoka';src:url(fredoka.woff2) format('woff2');font-display:swap}body{background:linear-gradient(180deg,#ffe4f1,#f3e5ff 60%,#ffe4f1) fixed}";
document.head.appendChild(st);
const el = document.getElementById("root"); if (el) createRoot(el).render(<App />);
