import { useState, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { stopAudio, say, S } from "./voice";
import { PINK, DEEP, LAV, INK, btn, card, pick } from "./data";
export const EFFORT = [S("Your dad loves hearing your voice!"), S("Thank you for talking with me, Elli! Your dad loves your voice!"), S("Great job trying, sweetheart! Your dad is proud of you!"), S("Your voice is beautiful, Elli! Your dad loves it!"), S("Your dad loves listening to you, princess!"), S("You shared your voice! Your dad is so happy!"), S("Every word you say is special to your dad!")];
export const SENT = [S("I like pink cupcakes."), S("The bunny hops in the garden."), S("My unicorn has a rainbow tail."), S("We play at the park."), S("I love my dad."), S("The moon is bright tonight.")];
export const GROUPS: { t: string; tip: string; words: string[] }[] = [
  { t: "🌬️ Vowels: gentle air first", tip: "Let a little air out, then start the word softly.", words: [S("apple"), S("egg"), S("ice cream"), S("owl"), S("umbrella")] },
  { t: "💨 H: soft breath", tip: "Start with a soft breath, like a sigh.", words: [S("hello"), S("happy"), S("home"), S("heart"), S("hug")] },
  { t: "🎵 M & N: hum it", tip: "Hum into the word, nice and smooth.", words: [S("moon"), S("mommy"), S("nice"), S("music"), S("night")] },
  { t: "🌊 S & F: airy sounds", tip: "Let the sound slide out like a breeze.", words: [S("sun"), S("fish"), S("sister"), S("flower"), S("sparkle")] },
  { t: "🦋 B & P: light touch", tip: "Touch your lips together as lightly as a butterfly.", words: [S("ball"), S("pink"), S("bunny"), S("puppy"), S("butterfly")] },
  { t: "🪶 D & T: feather tap", tip: "Tap your tongue as softly as a feather.", words: [S("doggy"), S("toy"), S("dance"), S("teddy"), S("dolphin")] },
  { t: "💬 Little phrases", tip: "Say it like a slow, smooth song.", words: [S("Hi Dad!"), S("I like pink."), S("My name is Elli."), S("Can I play?"), S("I love my unicorn."), S("Good morning!")] },
];
export const READS = [S("The pink butterfly flew over the flowers."), S("I can read with a calm and happy voice."), S("My dad and I went to the zoo today."), S("My kitty likes to nap in the warm sun."), S("Rainbows come out after the rain."), S("I am brave and I am kind."), S("We baked cookies with sprinkles on top."), S("The little turtle walked slowly to the pond.")];
export const STRETCH = [S("sun"), S("moon"), S("fish"), S("sea"), S("shell"), S("zoo"), S("love"), S("smile")];
const FEEL: [string, string, string][] = [["😊", "Happy", S("I'm so glad you feel happy! Your smile makes everyone smile.")], ["😌", "Calm", S("Calm is a cozy feeling. Let's keep it gentle and slow.")], ["😟", "Worried", S("It's okay to feel worried. You are safe, and you can take your time.")], ["😤", "Frustrated", S("Talking can feel tricky sometimes, and that's okay. I'm still listening.")], ["🥰", "Proud", S("You should feel proud! You are doing great.")], ["😴", "Tired", S("Being tired is okay. We can take a cozy break.")]];
export const GARDEN_SPOKEN = [S("Welcome to the Talking Garden! There's no rush here. Pick something fun to do."), S("Let's do belly breathing together."), S("Smell the flower."), S("Blow out the candle."), S("This is rabbit talk."), S("This is turtle talk."), S("Let's say it together, turtle style."), S("Let's read it together."), S("Let's stretch the word together."), S("How are you feeling today?"), S("Press record and say anything you like. Then you can hear your voice!")];
function stretchy(w: string): string { return w.split("").map((c) => ("aeiouslmnfzh".indexOf(c) >= 0 ? c + c + c : c)).join(""); }
export default function Garden(p: { onEffort: () => void; msg: string }) {
  const [tab, setTab] = useState<string>("menu");
  const [breath, setBreath] = useState<{ on: boolean; phase: number; n: number }>({ on: false, phase: 0, n: 0 });
  const [hi, setHi] = useState<number>(-1); const [ri, setRi] = useState<number>(0);
  const [rec, setRec] = useState<{ state: string; url: string; note: string }>({ state: "idle", url: "", note: "" });
  const mr = useRef<MediaRecorder | null>(null); const chunks = useRef<Blob[]>([]); const timer = useRef<number>(0);
  useEffect(() => { if (!breath.on) return; const id = window.setTimeout(() => { const ph = 1 - breath.phase; const n = ph === 0 ? breath.n + 1 : breath.n; if (n >= 4) { setBreath({ on: false, phase: 0, n: 0 }); return; } setBreath({ on: true, phase: ph, n }); say(ph === 0 ? S("Smell the flower.") : S("Blow out the candle."), { rate: 1 }); }, 4500); return () => window.clearTimeout(id); }, [breath]);
  useEffect(() => () => { window.clearInterval(timer.current); }, []);
  const effort = (<button className="ellib" onClick={p.onEffort} style={{ ...btn("linear-gradient(135deg,#ff9ecf,#c39bff)", true), marginTop: 14 }}>💖 I tried it!</button>);
  function readAlong(i: number) { setRi(i); const words = READS[i].split(" "); setHi(0); window.clearInterval(timer.current); let k = 0; timer.current = window.setInterval(() => { k++; if (k >= words.length) { window.clearInterval(timer.current); setHi(-1); } else setHi(k); }, 650); say("~" + READS[i]); }
  const recAudio = useRef<HTMLAudioElement | null>(null); const recUrl = useRef(""); const stopT = useRef(0); const tickT = useRef(0); const [secs, setSecs] = useState(0);
  useEffect(() => () => { window.clearTimeout(stopT.current); window.clearInterval(tickT.current); try { if (mr.current && mr.current.state !== "inactive") mr.current.stop(); } catch (e) { /* */ } if (recUrl.current) URL.revokeObjectURL(recUrl.current); }, []);
  function pickType(): string { try { const MR: any = MediaRecorder; if (!MR.isTypeSupported) return ""; for (const t of ["audio/mp4", "audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/aac"]) if (MR.isTypeSupported(t)) return t; } catch (e) { /* */ } return ""; }
  function stopRec() { window.clearTimeout(stopT.current); window.clearInterval(tickT.current); try { if (mr.current && mr.current.state !== "inactive") mr.current.stop(); } catch (e) { /* */ } }
  function startRec() { // called straight from the tap
    stopAudio(); try { if (recAudio.current) recAudio.current.pause(); } catch (e) { /* */ }
    const md = (navigator as Navigator).mediaDevices;
    if (!md || !md.getUserMedia || typeof MediaRecorder === "undefined") { setRec({ state: "idle", url: rec.url, note: "Recording isn't available in this browser. That's okay! You can still practice out loud. 💖" }); return; }
    setRec({ state: "asking", url: "", note: "" });
    md.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } as any }).then((stream) => {
      chunks.current = []; const type = pickType(); let m: MediaRecorder;
      try { m = type ? new MediaRecorder(stream, { mimeType: type }) : new MediaRecorder(stream); } catch (e) { m = new MediaRecorder(stream); }
      mr.current = m; (window as any).__recType = m.mimeType || type || "(default)";
      m.ondataavailable = (e: BlobEvent) => { if (e.data && e.data.size) chunks.current.push(e.data); };
      m.onstop = () => { stream.getTracks().forEach((t) => t.stop()); window.clearInterval(tickT.current);
        const b = new Blob(chunks.current, { type: m.mimeType || type || (chunks.current[0] && chunks.current[0].type) || "audio/mp4" }); (window as any).__recSize = b.size;
        if (!b.size) { setRec({ state: "idle", url: "", note: "Hmm, I didn't hear anything. Let's try again! 🎤" }); return; }
        if (recUrl.current) URL.revokeObjectURL(recUrl.current); recUrl.current = URL.createObjectURL(b); setRec({ state: "done", url: recUrl.current, note: "" }); };
      m.start(250); setSecs(0); setRec({ state: "rec", url: "", note: "" });
      tickT.current = window.setInterval(() => setSecs((s) => s + 1), 1000);
      stopT.current = window.setTimeout(stopRec, 15000);
    }).catch((e: any) => { const denied = e && /NotAllowed|Permission|Security/i.test(String(e.name || e)); setRec({ state: "idle", url: "", note: denied ? "The microphone is turned off for this page. A grown-up can allow the microphone in the browser settings (the aA or 🔒 button by the address), then tap again. 💖" : "I couldn't find a microphone. That's okay! You can still practice out loud. 💖" }); });
  }
  function playRec() { stopAudio(); try { let a = recAudio.current; if (!a) { a = new Audio(); a.setAttribute("playsinline", ""); recAudio.current = a; } a.pause(); a.src = rec.url; a.currentTime = 0; (window as any).__recPlay = (((window as any).__recPlay) || 0) + 1; const pr = a.play(); if (pr && pr.catch) pr.catch(() => setRec((r) => ({ ...r, note: "Tap ▶️ again to hear it!" }))); } catch (e) { /* */ } }
  const T: [string, string, string][] = [["breath", "🎈", "Belly Breathing"], ["turtle", "🐢", "Turtle & Rabbit"], ["easy", "🌷", "Easy Starts"], ["read", "📖", "Read Along"], ["stretch", "🪄", "Stretchy Words"], ["feel", "💗", "Feelings"], ["mic", "🎙️", "Hear My Voice"]];
  const wrap: CSSProperties = { display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" };
  return (<div style={{ ...card, background: "linear-gradient(180deg,#fff,#f1fff4 60%,#fff0f7)" }}>
    <div style={{ textAlign: "center" }}><div style={{ fontSize: 30, fontWeight: 900, color: DEEP }}>🌷 Talking Garden</div><div style={{ fontSize: 17 }}>A calm place to play with your voice. No scores, no rush. 💕</div>
      <button className="ellib" onClick={() => say(S("Welcome to the Talking Garden! There's no rush here. Pick something fun to do."))} style={{ ...btn(LAV), padding: "6px 12px", fontSize: 15, marginTop: 6 }}>🔊 Read to me</button></div>
    {p.msg && <div style={{ textAlign: "center", fontSize: 22, fontWeight: 900, color: DEEP, margin: "10px 0", animation: "ellipop .3s" }}>{p.msg}</div>}
    <div style={{ ...wrap, marginTop: 12 }}>{T.map(([k, e, n]) => <button key={k} className="ellib" onClick={() => { setTab(k); setHi(-1); }} style={{ ...btn(tab === k ? PINK : "#fff"), color: tab === k ? "#fff" : INK, border: "3px solid #ffc1dd" }}>{e} {n}</button>)}</div>
    <div style={{ marginTop: 18, textAlign: "center" }}>
      {tab === "breath" && <div>
        <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ fontSize: 90, transition: "transform 4s ease-in-out", transform: `scale(${breath.on && breath.phase === 0 ? 1.6 : 0.8})` }}>🎈</div></div>
        <div style={{ fontSize: 24, fontWeight: 800 }}>{breath.on ? (breath.phase === 0 ? "🌸 Smell the flower… belly gets big" : "🕯️ Blow out the candle… slow and soft") : "Put a hand on your tummy 💕"}</div>
        {!breath.on && <button className="ellib" onClick={() => { say([S("Let's do belly breathing together."), S("Smell the flower.")]); setBreath({ on: true, phase: 0, n: 0 }); }} style={{ ...btn(PINK, true), marginTop: 12 }}>Start (4 breaths)</button>}
      </div>}
      {tab === "turtle" && <div>
        <div style={{ fontSize: 24, fontWeight: 800, background: "#fff7fb", borderRadius: 16, padding: 14 }}>"{SENT[ri % SENT.length]}"</div>
        <div style={{ ...wrap, marginTop: 12 }}>
          <button className="ellib" onClick={() => say([S("This is rabbit talk."), "^" + SENT[ri % SENT.length]])} style={btn("#f48fb1", true)}>🐇 Rabbit talk</button>
          <button className="ellib" onClick={() => say([S("This is turtle talk."), "~" + SENT[ri % SENT.length]])} style={btn("#81c784", true)}>🐢 Turtle talk</button>
          <button className="ellib" onClick={() => say([S("Let's say it together, turtle style."), "~" + SENT[ri % SENT.length]])} style={btn(LAV, true)}>🎶 Say it together</button>
          <button className="ellib" onClick={() => setRi(ri + 1)} style={{ ...btn("#fff", true), color: DEEP }}>Next ➡</button>
        </div>
        <div style={{ fontSize: 16, marginTop: 10 }}>Turtle talk is slow and smooth, like a calm song. Rabbit talk is quick and bumpy. Which one feels comfy today?</div>{effort}
      </div>}
      {tab === "easy" && <div style={{ textAlign: "left" }}>{GROUPS.map((g) => <div key={g.t} style={{ background: "#fff7fb", borderRadius: 18, padding: 12, marginBottom: 10 }}>
        <div style={{ fontWeight: 900, fontSize: 19 }}>{g.t}</div><div style={{ fontSize: 15, color: "#8e5a85", marginBottom: 8 }}>{g.tip}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{g.words.map((w) => <button key={w} className="ellib" onClick={() => say("~" + w)} style={{ ...btn("#fff"), color: INK, border: "3px solid #c5e1a5" }}>🔊 {w}</button>)}</div></div>)}
        <div style={{ textAlign: "center" }}>{effort}</div></div>}
      {tab === "read" && <div>
        <div style={{ fontSize: 26, lineHeight: 1.7, background: "#fff7fb", borderRadius: 18, padding: 14 }}>{READS[ri % READS.length].split(" ").map((w, i) => <span key={i} style={{ padding: "2px 4px", borderRadius: 8, background: i === hi ? "#ffd1e6" : "transparent", transition: "background .2s" }}>{w} </span>)}</div>
        <div style={{ ...wrap, marginTop: 12 }}><button className="ellib" onClick={() => readAlong(ri % READS.length)} style={btn(PINK, true)}>🎶 Read together</button><button className="ellib" onClick={() => { setRi(ri + 1); setHi(-1); }} style={{ ...btn("#fff", true), color: DEEP }}>Next ➡</button></div>
        <div style={{ fontSize: 16, marginTop: 10 }}>Say the words together with the voice, as slow and smooth as you like.</div>{effort}
      </div>}
      {tab === "stretch" && <div><div style={wrap}>{STRETCH.map((w) => <button key={w} className="ellib" onClick={() => { setHi(STRETCH.indexOf(w)); say([S("Let's stretch the word together."), "≈" + w]); }} style={{ ...btn("#fff", true), color: INK, border: "3px solid #ffc1dd", letterSpacing: hi === STRETCH.indexOf(w) ? 6 : 0, transition: "letter-spacing 1.2s" }}>{hi === STRETCH.indexOf(w) ? stretchy(w) : w}</button>)}</div>
        <div style={{ fontSize: 16, marginTop: 10 }}>Stretch the word like soft taffy: sssuuunnn. 🍬</div>{effort}</div>}
      {tab === "feel" && <div><div style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>How are you feeling today?</div><div style={wrap}>{FEEL.map(([e, n, l]) => <button key={n} className="ellib" onClick={() => say(l)} style={{ ...btn("#fff", true), color: INK, border: "3px solid #ffc1dd" }}><div style={{ fontSize: 40 }}>{e}</div>{n}</button>)}</div>
        <div style={{ fontSize: 16, marginTop: 10 }}>All feelings are okay. 💕 You can tell your dad how you feel, too.</div></div>}
      {tab === "mic" && <div><div style={{ fontSize: 17, marginBottom: 10 }}>Record a few words and hear yourself. It stays on this device only and is never sent anywhere. 🔒</div>
        <div style={wrap}>{rec.state === "rec" ? <button className="ellib" data-recstop onClick={stopRec} style={{ ...btn(DEEP, true), fontSize: 26 }}>⏹ Stop</button>
          : <button className="ellib" data-rec disabled={rec.state === "asking"} onClick={startRec} style={{ ...btn("linear-gradient(135deg,#ff5fa2,#ff9ecf)", true), fontSize: 26, padding: "18px 26px" }}>🎤 Tap to talk</button>}
          {rec.url && rec.state !== "rec" && <button className="ellib" data-recplay onClick={playRec} style={{ ...btn(LAV, true), fontSize: 26 }}>▶️ Hear my voice</button>}</div>
        {rec.state === "rec" && <div data-recon style={{ marginTop: 12, fontSize: 22, fontWeight: 800, color: "#e0005a" }}><span style={{ display: "inline-block", width: 16, height: 16, borderRadius: 8, background: "#ff1f6b", marginRight: 8, animation: "ellitw 1s infinite" }} />Listening… {secs}s / 15s</div>}
        {rec.state === "asking" && <div style={{ marginTop: 12, fontSize: 18 }}>Getting the microphone ready… 🎤</div>}
        {rec.note && <div style={{ fontSize: 17, marginTop: 10 }}>{rec.note}</div>}{rec.url && effort}</div>}
    </div>
  </div>);
}
