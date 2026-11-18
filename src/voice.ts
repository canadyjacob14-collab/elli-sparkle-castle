// v4: one shared Aria audio player. Whole-sentence clips only (no word stitching), zero device speechSynthesis.
import CLIPS from "./clips.json";
export type Part = string | Part[];
export const clean = (s: string): string => s.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, "").replace(/\s+/g, " ").trim();
export const S = (s: string): string => s; // marks a literal spoken line for the clip collector
const M = CLIPS as Record<string, string>;
export const textOf = (p: Part): string => (Array.isArray(p) ? p.map(textOf).join(" ") : clean(p));
export const missing: string[] = [];
const VS = { played: 0, missing }; try { (window as any).__voiceStats = VS; } catch (e) { /* */ }
try { const w = window as any; if (w.speechSynthesis) { try { w.speechSynthesis.cancel(); } catch (e) { /* */ } w.speechSynthesis.speak = function () { w.__ttsBlocked = (w.__ttsBlocked || 0) + 1; }; } } catch (e) { /* */ }
let AP: HTMLAudioElement | null = null; let tok = 0; let unlocked = false; let unlocking = false;
function ap(): HTMLAudioElement | null { try { if (!AP && typeof Audio !== "undefined") { AP = new Audio(); AP.preload = "auto"; AP.setAttribute("playsinline", ""); } } catch (e) { AP = null; } return AP; }
export function unlockAudio(): void {
  if (unlocked || unlocking) return; const a = ap(); if (!a) return; if (tok > 0 && !a.paused) { unlocked = true; return; } unlocking = true;
  try { a.src = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQxAADB8AhSmxhIIEVCSiJrDCQBTcu3UrAIwUdkRgQbFAZC1CQEwTJ9mjRvBA4UOLD8nKVOWfh+UlK3z/177OXrfOdKl7pyn3Xf//WreyTRUoAWgBgkOAGbZHBgG1OF6zM82DWbZaUmMBptgQhGjsyYqc9ae9XFz280948NMBWInljyzsNRFLPWdnZGWrddDsjK1unuSrVN9jJsK8KuQtQCtMBjCEtImISdNKJOopIpBFpNSMbIHCSRpRR5iakjTiyzLhchUUBwCgyKiweBv/7UsQbg8isVNoMPMjAAAA0gAAABEVFGmgqK////9bP/6XCykxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"; const pr = a.play(); if (pr && typeof pr.then === "function") pr.then(() => { unlocked = true; unlocking = false; }, () => { unlocking = false; }); else { unlocked = true; unlocking = false; } } catch (e) { unlocking = false; }
}
function playOne(file: string, my: number, rate: number): Promise<void> {
  return new Promise((res) => {
    const a = ap(); if (!a || my !== tok) { res(); return; }
    let done = false; const fin = () => { if (done) return; done = true; clearTimeout(t); a.onended = null; a.onerror = null; res(); };
    const t = setTimeout(fin, 45000);
    try { a.onended = fin; a.onerror = fin; a.src = file; a.playbackRate = rate; const pr = a.play(); if (pr && typeof pr.catch === "function") pr.catch(fin); } catch (e) { fin(); }
  });
}
export function stopAudio(): void { tok++; try { if (AP) AP.pause(); } catch (e) { /* */ } }
export const hasClip = (p: Part): boolean => !!M[textOf(p)];
// Plays the whole line as one clip; an array plays each whole sentence in order (never word-by-word).
export async function say(p: Part, opts?: { rate?: number }): Promise<void> {
  const my = ++tok; try { if (AP) AP.pause(); } catch (e) { /* */ }
  const rate = (opts && opts.rate) || 1;
  const whole = M[textOf(p)]; if (whole) { VS.played++; await playOne(whole, my, rate); return; }
  const parts = Array.isArray(p) ? p : [p];
  for (const x of parts) { if (my !== tok) return; const f = M[textOf(x)]; if (!f) { const k = textOf(x); if (k && missing.indexOf(k) < 0) missing.push(k); continue; } VS.played++; await playOne(f, my, rate); }
}
export const sayWord = (w: string) => say("w|" + w.toLowerCase().replace(/[’]/g, "'").replace(/^'+|'+$/g, ""));
