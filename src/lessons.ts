// Learn It: one short step-by-step lesson per skill, using the school's / GPB Math Mights / EL Education methods and words.
export type LScr = { t: string; say: string; v?: any };
export type Lesson = { sk: string; title: string; s: LScr[]; tr: { q: string; ch: string[]; ans: string; say: string; text?: string } };
const B = (h: number, t: number, o: number) => ({ k: "blocks", h, t, o });
const C = (text: string, hl?: string) => ({ k: "card", text, hl });
const W = (w: string, hl: number[]) => ({ k: "letters", w, hl });
export const LESSONS: Lesson[] = [
  { sk: "bld", title: "Build It Different Ways", s: [
    { t: "235 = 2 hundreds, 3 tens, 5 ones", say: "Here is 235 with snap cubes. It has 2 hundreds, 3 tens, and 5 ones.", v: B(2, 3, 5) },
    { t: "Decompose: trade 1 hundred → 10 tens", say: "We can trade 1 hundred for 10 tens. The hundred goes away, and 10 tens take its place.", v: B(1, 13, 5) },
    { t: "1 hundred, 13 tens, 5 ones", say: "Now there is 1 hundred, 13 tens, and 5 ones. That is a new way to show 235.", v: B(1, 13, 5) },
    { t: "100 + 130 + 5 = 235 ✓", say: "Add it back up. 100 plus 130 plus 5 is 235. It still makes the number!", v: B(1, 13, 5) }],
    tr: { q: "Which is another way to show 154?", ch: ["0 hundreds, 15 tens, 4 ones", "1 hundred, 15 tens, 4 ones", "0 hundreds, 5 tens, 4 ones"], ans: "0 hundreds, 15 tens, 4 ones", say: "Your turn! Which is another way to show 154?" } },
  { sk: "pv", title: "Digit Detective", s: [
    { t: "Hundreds · Tens · Ones", say: "Every digit has a place. The places are hundreds, tens, and ones.", v: { k: "pv", n: 472, hl: -1 } },
    { t: "4 hundreds = 400", say: "The 4 is in the hundreds place. It is worth 400.", v: { k: "pv", n: 472, hl: 0 } },
    { t: "7 tens = 70", say: "The 7 is in the tens place. It is worth 70.", v: { k: "pv", n: 472, hl: 1 } },
    { t: "2 ones = 2", say: "The 2 is in the ones place. It is worth 2.", v: { k: "pv", n: 472, hl: 2 } }],
    tr: { q: "What is the value of the 7 in 472?", ch: ["70", "7", "700"], ans: "70", say: "Your turn! What is the value of the 7 in 472?" } },
  { sk: "exp", title: "Build the Number", s: [
    { t: "Standard form: 635", say: "This is 635. Writing it with digits is called standard form.", v: { k: "num", n: 635 } },
    { t: "Expanded form: 600 + 30 + 5", say: "Expanded form shows what each digit is worth. 600 plus 30 plus 5.", v: B(6, 3, 5) },
    { t: "Word form: six hundred thirty-five", say: "Word form uses words. Six hundred thirty-five.", v: { k: "num", n: 635 } },
    { t: "No tens? Write a 0!  508", say: "If there are no tens, write a zero in the tens place, like 508.", v: { k: "pv", n: 508, hl: 1 } }],
    tr: { q: "Which number is 400 + 7?", ch: ["407", "470", "47"], ans: "407", say: "Your turn! Which number is 400 plus 7?" } },
  { sk: "cmp", title: "Compare Castles", s: [
    { t: "Compare the hundreds first", say: "To compare, start with the biggest place, the hundreds.", v: { k: "cmp", a: 452, b: 437, hl: 0 } },
    { t: "Same hundreds → look at the tens", say: "The hundreds are the same, so look at the tens. 5 tens is more than 3 tens.", v: { k: "cmp", a: 452, b: 437, hl: 1 } },
    { t: "452 is greater than 437 → 452 > 437", say: "452 is greater than 437. We write it with the greater than symbol.", v: { k: "cmp", a: 452, b: 437, hl: 1 } },
    { t: ">  greater than    <  less than    =  equal to", say: "Remember the words: greater than, less than, and equal to." }],
    tr: { q: "Which comparison is true?", ch: ["318 < 381", "318 > 381", "318 = 381"], ans: "318 < 381", say: "Your turn! Which comparison is true?" } },
  { sk: "cnt", title: "Skip & Hop", s: [
    { t: "10 more → the tens digit goes up 1", say: "Ten more means one more ten. The tens digit goes up by 1.", v: { k: "pv", n: 345, hl: 1 } },
    { t: "345 → 355", say: "So 10 more than 345 is 355. The hundreds and ones stay the same.", v: { k: "pv", n: 355, hl: 1 } },
    { t: "100 more → 345 → 445", say: "100 more means one more hundred. 100 more than 345 is 445.", v: { k: "pv", n: 445, hl: 0 } },
    { t: "Skip count: 205, 210, 215, 220", say: "When you skip count by 5s, 10s, or 100s, look for the pattern.", v: { k: "seq", seq: [205, 210, 215, 220], miss: -1 } }],
    tr: { q: "What is 10 less than 362?", ch: ["352", "262", "372"], ans: "352", say: "Your turn! What is 10 less than 362?" } },
  { sk: "len", title: "Measure Magic", s: [
    { t: "📏 Line it up at 0", say: "To measure, line up the end of the object with the zero on the ruler." },
    { t: "inches · feet · yards · centimeters", say: "We measure length with units, like inches, feet, yards, or centimeters." },
    { t: "How much longer? → find the difference", say: "How much longer means compare the two lengths. We subtract to find the difference.", v: { k: "line", a: 47, b: 31, op: "-", step: 1 } },
    { t: "47 − 31 = 16 centimeters", say: "47 minus 31 is 16. The pencil is 16 centimeters longer.", v: { k: "line", a: 47, b: 31, op: "-", step: 2 } }],
    tr: { q: "A rope is 50 inches long. A ribbon is 20 inches long. How much longer is the rope?", ch: ["30 inches", "70 inches", "20 inches"], ans: "30 inches", say: "Your turn! How much longer is the rope?" } },
  { sk: "add3", title: "Big Adding", s: [
    { t: "Break apart by place value", say: "To add big numbers, break both numbers apart by place value.", v: { k: "exp2", a: 243, b: 125, hl: -1 } },
    { t: "200 + 100 = 300", say: "Add the hundreds. 200 plus 100 is 300.", v: { k: "exp2", a: 243, b: 125, hl: 0 } },
    { t: "40 + 20 = 60 · 3 + 5 = 8", say: "Add the tens and the ones. 40 plus 20 is 60, and 3 plus 5 is 8.", v: { k: "exp2", a: 243, b: 125, hl: 2 } },
    { t: "300 + 60 + 8 = 368", say: "Put the parts together. 300 plus 60 plus 8 is 368.", v: { k: "exp2", a: 243, b: 125, hl: 3 } }],
    tr: { q: "412 + 135 = ?", ch: ["547", "557", "277"], ans: "547", say: "Your turn! What is 412 plus 135?" } },
  { sk: "sub3", title: "Big Subtracting", s: [
    { t: "132 = 100 + 30 + 2", say: "To subtract, break apart the number you take away. 132 is 100 plus 30 plus 2.", v: { k: "hops", pts: [475, 375, 345, 343], step: 0, op: "-" } },
    { t: "475 − 100 = 375", say: "Start at 475 on the open number line. Jump back 100 to 375.", v: { k: "hops", pts: [475, 375, 345, 343], step: 1, op: "-" } },
    { t: "375 − 30 = 345", say: "Jump back 30 to 345.", v: { k: "hops", pts: [475, 375, 345, 343], step: 2, op: "-" } },
    { t: "345 − 2 = 343", say: "Jump back 2 to 343. So 475 minus 132 is 343.", v: { k: "hops", pts: [475, 375, 345, 343], step: 3, op: "-" } }],
    tr: { q: "560 − 200 = ?", ch: ["360", "760", "540"], ans: "360", say: "Your turn! What is 560 minus 200?" } },
  { sk: "pv2", title: "Tricky Tens", s: [
    { t: "10 tens = 1 hundred", say: "Ten tens make 1 hundred. You can trade them.", v: B(0, 10, 0) },
    { t: "10 ones = 1 ten", say: "Ten ones make 1 ten.", v: B(0, 0, 10) },
    { t: "2 hundreds + 13 tens = 330", say: "If you have 13 tens, trade 10 of them for a hundred. 2 hundreds and 13 tens is 330.", v: B(2, 13, 0) },
    { t: "450 has 45 tens", say: "450 has 45 tens, because 4 hundreds is 40 tens, plus 5 more tens.", v: B(4, 5, 0) }],
    tr: { q: "What number is 3 hundreds, 12 tens, 0 ones?", ch: ["420", "3120", "312"], ans: "420", say: "Your turn! What number is 3 hundreds, 12 tens, and 0 ones?" } },
  { sk: "round", title: "Round the Castle", s: [
    { t: "67 is between 60 and 70", say: "To round, find the two tens it is between on a number line.", v: { k: "round", n: 67, lo: 60, hi: 70 } },
    { t: "67 is closer to 70", say: "67 is closer to 70 than to 60. So 67 rounds to 70.", v: { k: "round", n: 67, lo: 60, hi: 70 } },
    { t: "Halfway? Round up!", say: "If a number is exactly halfway, like 65, we round up to 70.", v: { k: "round", n: 65, lo: 60, hi: 70 } },
    { t: "Nearest hundred: 230 → 200", say: "To the nearest hundred, 230 is closer to 200.", v: { k: "round", n: 230, lo: 200, hi: 300 } }],
    tr: { q: "Round 84 to the nearest ten.", ch: ["80", "90", "100"], ans: "80", say: "Your turn! Round 84 to the nearest ten." } },
  { sk: "mult", title: "Equal Groups", s: [
    { t: "3 equal groups of 4", say: "Equal groups have the same number in each group. Here are 3 groups of 4.", v: { k: "groups", g: 3, n: 4, e: "🍪" } },
    { t: "4 + 4 + 4 = 12", say: "We can add 4 plus 4 plus 4. That makes 12.", v: { k: "groups", g: 3, n: 4, e: "🍪" } },
    { t: "An array: 3 rows of 4", say: "An array puts things in rows. 3 rows of 4 is also 12.", v: { k: "array", rows: 3, cols: 4, e: "🌸" } },
    { t: "Skip count: 4, 8, 12", say: "Skip count by 4s to find the total: 4, 8, 12.", v: { k: "seq", seq: [4, 8, 12], miss: -1 } }],
    tr: { q: "What do 2 equal groups of 5 make?", ch: ["10", "7", "25"], ans: "10", say: "Your turn! What do 2 equal groups of 5 make?" } },
  { sk: "fos", title: "Fossil Stories", s: [
    { t: "🔁 Read, then reread", say: "When you answer a question, go back and reread the text." },
    { t: "🔎 Find evidence", say: "Find evidence. Look for the words in the text that prove your answer.", v: C("Mary walked on the beach after big storms.", "after big storms") },
    { t: "When? → look for time words", say: "If the question asks when, look for time words, like after big storms.", v: C("Mary walked on the beach after big storms.", "after big storms") },
    { t: "Answer with the text's words", say: "Answer with words from the text. Mary walked on the beach after big storms." }],
    tr: { text: "The fossil was in a rock by the river.", q: "Where was the fossil?", ch: ["in a rock by the river", "in a museum", "in the sky"], ans: "in a rock by the river", say: "Your turn! Where was the fossil?" } },
  { sk: "voc", title: "Fossil Words", s: [
    { t: "🔎 Use context clues", say: "When you see a new word, use context clues. Those are the other words around it." },
    { t: "Find the clue words", say: "A paleontologist dug up bones to study them. The clue words are dug up bones to study.", v: C("A paleontologist dug up bones to study them.", "dug up bones to study") },
    { t: "paleontologist = a scientist who studies fossils", say: "So a paleontologist is a scientist who studies fossils." },
    { t: "Does it make sense?", say: "Read the sentence again with your meaning. Does it make sense?" }],
    tr: { text: "The mud was soft, so the dinosaur left a print.", q: "What is a print?", ch: ["a mark something makes", "a kind of food", "a loud sound"], ans: "a mark something makes", say: "Your turn! What is a print?" } },
  { sk: "gram", title: "Grammar Gems", s: [
    { t: "a flock of birds", say: "A collective noun is a word for a group, like a flock of birds.", v: C("a flock of birds", "flock") },
    { t: "herd · school · pack", say: "A herd of cows, a school of fish, and a pack of wolves.", v: C("a herd of cows · a school of fish · a pack of wolves", "herd") },
    { t: "run → ran", say: "Some action words change in the past. Today I run. Yesterday I ran." },
    { t: "dig → dug · find → found · see → saw", say: "Dig becomes dug. Find becomes found. See becomes saw." }],
    tr: { q: "Yesterday we ___ a fossil.", ch: ["found", "finded", "find"], ans: "found", say: "Your turn! Yesterday we, blank, a fossil." } },
  { sk: "inf", title: "Think Deeper", s: [
    { t: "Main idea = what it is mostly about", say: "The main idea is what the whole text is mostly about." },
    { t: "Details tell more", say: "Details are small facts. They tell more about the main idea." },
    { t: "Infer = clues + what I know", say: "To infer, use clues in the text and what you already know." },
    { t: "I can infer: it is cold!", say: "Ana put on her coat and boots. I can infer that it is cold outside.", v: C("Ana put on her coat and boots.", "coat and boots") }],
    tr: { text: "Max yawned and rubbed his eyes.", q: "How does Max feel?", ch: ["sleepy", "hungry", "silly"], ans: "sleepy", say: "Your turn! How does Max feel?" } },
  { sk: "spw", title: "Spell It", s: [
    { t: "oi in the middle: coin", say: "The oy sound in the middle of a word is often spelled o i, like coin.", v: W("coin", [1, 2]) },
    { t: "oy at the end: boy", say: "At the end of a word, it is often spelled o y, like boy.", v: W("boy", [1, 2]) },
    { t: "ou in the middle: cloud", say: "The ow sound in the middle of a word can be o u, like cloud.", v: W("cloud", [2, 3]) },
    { t: "ow at the end: cow", say: "At the end of a word, it is often o w, like cow.", v: W("cow", [1, 2]) }],
    tr: { q: "Which spelling is right?", ch: ["toy", "toi", "tuy"], ans: "toy", say: "Your turn! Which spelling of toy is right?" } },
  { sk: "pat", title: "Pattern Pick", s: [
    { t: "ar: star", say: "When r comes after a vowel, the sound changes. A r says ar, like star.", v: W("star", [2, 3]) },
    { t: "ir · er · ur: bird", say: "I r, e r, and u r all say er, like bird, her, and fur.", v: W("bird", [1, 2]) },
    { t: "old · ind · ild · ost: cold", say: "Some patterns have a long vowel sound, like cold, find, wild, and most.", v: W("cold", [1, 2, 3]) },
    { t: "oo · ew · ue · ui: moon", say: "The oo sound can be o o, e w, u e, or u i, like moon, new, blue, and fruit.", v: W("moon", [1, 2]) }],
    tr: { q: "Which word has the er sound, like bird?", ch: ["fern", "farm", "fork"], ans: "fern", say: "Your turn! Which word has the er sound, like bird?" } },
  { sk: "con", title: "Squish Words", s: [
    { t: "do not → don't", say: "A contraction squishes two words into one. Do not becomes don't.", v: W("don't", [3]) },
    { t: "' = missing letters", say: "The apostrophe takes the place of the letters we took out.", v: W("don't", [3]) },
    { t: "it is → it's · she would → she'd", say: "It is becomes it's. She would becomes she'd.", v: W("it's", [2]) },
    { t: "I will → I'll", say: "I will becomes I'll.", v: W("I'll", [1]) }],
    tr: { q: "What is the contraction for can not?", ch: ["can't", "cann't", "ca'nt"], ans: "can't", say: "Your turn! What is the contraction for can not?" } },
  { sk: "end", title: "Ending Fun", s: [
    { t: "hop: 1 syllable, 1 vowel, 1 consonant", say: "Look at hop. It has 1 syllable, 1 vowel, and 1 consonant at the end.", v: W("hop", [1, 2]) },
    { t: "Double it: hop → hopping", say: "So we double the last letter before adding i n g. Hop becomes hopping.", v: W("hopping", [2, 3]) },
    { t: "-ed says t, d, or id", say: "The e d ending can sound like t, like jumped, d, like played, or id, like painted.", v: W("jumped", [4, 5]) },
    { t: "Say it and listen", say: "Say the word out loud and listen to the ending sound.", v: W("painted", [5, 6]) }],
    tr: { q: "Add -ing to sit.", ch: ["sitting", "siting", "sitng"], ans: "sitting", say: "Your turn! Add i n g to sit." } },
  { sk: "sp3", title: "Super Speller", s: [
    { t: "-le: table", say: "Some words end with a consonant and l e, like table.", v: W("table", [3, 4]) },
    { t: "tch: catch", say: "After a short vowel, the ch sound is spelled t c h, like catch.", v: W("catch", [2, 3, 4]) },
    { t: "dge: badge", say: "After a short vowel, the j sound is spelled d g e, like badge.", v: W("badge", [2, 3, 4]) },
    { t: "un- means not: unhappy", say: "A prefix goes at the start. U n means not, so unhappy means not happy.", v: W("unhappy", [0, 1]) }],
    tr: { q: "Which spelling is right?", ch: ["match", "mach", "matsh"], ans: "match", say: "Your turn! Which spelling of match is right?" } },
  { sk: "sd", title: "Sign Detective", s: [
    { t: "🔍 Look at the sign first!", say: "Detective rule number one: look at the sign first!", v: { k: "sign", op: "+" } },
    { t: "− minus = take away", say: "Minus means take away. The answer will be smaller.", v: { k: "sign", op: "-" } },
    { t: "64 − 20 = 44", say: "Start at 64 on the open number line. Jump back 20 to 44.", v: { k: "line", a: 64, b: 23, op: "-", step: 1 } },
    { t: "44 − 3 = 41", say: "Then jump back 3 more to 41. So 64 minus 23 is 41.", v: { k: "line", a: 64, b: 23, op: "-", step: 2 } }],
    tr: { q: "Look at the sign!  52 − 20 = ?", ch: ["32", "72", "22"], ans: "32", say: "Your turn! Look at the sign first." } },
  { sk: "sd3", title: "Sign Detective Pro", s: [
    { t: "🔍 Big numbers? Sign first!", say: "Even with big numbers, look at the sign first!", v: { k: "sign", op: "+" } },
    { t: "+ → break apart by place value", say: "If it is plus, break both numbers apart by place value and add each place.", v: { k: "exp2", a: 325, b: 142, hl: -1 } },
    { t: "400 + 60 + 7 = 467", say: "300 plus 100 is 400. 20 plus 40 is 60. 5 plus 2 is 7. That makes 467.", v: { k: "exp2", a: 325, b: 142, hl: 3 } },
    { t: "− → jump back on an open number line", say: "If it is minus, jump back on an open number line. 467 minus 142 is 325.", v: { k: "hops", pts: [467, 367, 327, 325], step: 3, op: "-" } }],
    tr: { q: "Look at the sign!  600 − 300 = ?", ch: ["300", "900", "330"], ans: "300", say: "Your turn! Look at the sign first." } },
  { sk: "rmw", title: "Test Word Problems", s: [
    { t: "👀 Read it two times", say: "On the test, you read the questions yourself. First, read the problem two times." },
    { t: "❓ Find the question", say: "Next, find the question. It ends with a question mark.", v: C("Lily had 45 beads. She gave away 12. How many beads does she have now?", "How many beads does she have now?") },
    { t: "What is happening?", say: "Think about what is happening. She gave some away, so there are fewer. We subtract.", v: C("Lily had 45 beads. She gave away 12. How many beads does she have now?", "gave away") },
    { t: "45 − 12 = 33 · Does it make sense?", say: "Solve it, then check. Does your answer make sense?" }],
    tr: { text: "Mia had 30 shells. She found 10 more. How many shells does she have now?", q: "Read it yourself, then pick the answer.", ch: ["40", "20", "300"], ans: "40", say: "Your turn! Read it yourself." } },
  { sk: "rrc", title: "Test Reading", s: [
    { t: "📖 Read the passage yourself", say: "On the test, read the passage yourself, slowly and carefully." },
    { t: "❓ Who? What? Where? When? Why?", say: "Then read the question. Is it asking who, what, where, when, or why?" },
    { t: "🔎 Find evidence in the text", say: "Go back to the text. Find the sentence that answers the question." },
    { t: "✅ Check every choice", say: "Read every answer choice. Pick the one the text proves." }],
    tr: { text: "Sam's dog is brown. It likes to dig.", q: "What color is Sam's dog?", ch: ["brown", "black", "white"], ans: "brown", say: "Your turn! Read it yourself." } },
  { sk: "rmw2", title: "Two-Step Problems", s: [
    { t: "Two steps, two actions", say: "Some problems have two steps. Find both actions." },
    { t: "Find both actions", say: "Ava had 50 stickers. She got 20 more. Then she gave away 15.", v: C("Ava had 50 stickers. She got 20 more. Then she gave away 15.", "got 20 more") },
    { t: "Step 1: 50 + 20 = 70", say: "Step one. She got more, so we add. 50 plus 20 is 70." },
    { t: "Step 2: 70 − 15 = 55", say: "Step two. She gave some away, so we subtract. 70 minus 15 is 55." }],
    tr: { text: "Zoe had 20 bows. She got 10 more. Then she lost 5. How many bows does she have now?", q: "Read it yourself, then pick the answer.", ch: ["25", "35", "15"], ans: "25", say: "Your turn! Read it yourself." } },
  { sk: "rrc2", title: "Longer Passages", s: [
    { t: "One part at a time", say: "A longer passage has many parts. Read one paragraph at a time." },
    { t: "Stop and think", say: "After each part, stop and think. What was this part about?" },
    { t: "Text features", say: "Look at text features, like the title, headings, and captions." },
    { t: "🔎 Evidence first", say: "Before you answer, find evidence in the text." }],
    tr: { q: "What is a caption?", ch: ["words under a picture", "the last page", "a big word"], ans: "words under a picture", say: "Your turn! What is a caption?" } },
];
export const LBY: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.sk, l]));
