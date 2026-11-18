// Sticker book: 100 stickers in 8 albums with rarity tiers, earned by real effort.
export type Rarity = "common" | "rare" | "sparkly" | "legendary";
export type Rule = { t: "stars" | "first" | "perfect" | "best" | "master" | "today" | "album"; n: number };
export type Sticker = { id: string; e: string; name: string; album: number; rarity: Rarity; rule: Rule };
export type Stats = { stars: number; first: number; perfect: number; best: number; master: number; today: number };
export const ALBUMS: { n: string; e: string; list: [string, string][] }[] = [
  { n: "Sweet Start", e: "🎀", list: [["🦄", "Little Unicorn"], ["🌈", "Rainbow"], ["💖", "Sparkle Heart"], ["🧁", "Cupcake"], ["🌸", "Cherry Blossom"], ["👑", "Crown"], ["🦋", "Butterfly"], ["🍓", "Strawberry"], ["⭐", "Star"], ["🎀", "Pink Bow"], ["🐱", "Kitty"], ["🌷", "Tulip"], ["🍭", "Lollipop"], ["🪄", "Magic Wand"], ["🐰", "Bunny"], ["💎", "Gem"], ["🌙", "Moon"], ["🍩", "Donut"], ["🐬", "Dolphin"], ["🎠", "Carousel"]] },
  { n: "Unicorn Meadow", e: "🦄", list: [["☁️", "Fluffy Cloud"], ["🌼", "Daisy"], ["🍀", "Lucky Clover"], ["🪻", "Lavender"], ["🌟", "Glow Star"], ["🫧", "Bubbles"], ["🐴", "Pony"], ["🌠", "Shooting Star"], ["🎆", "Fireworks"], ["🌺", "Hibiscus"], ["🌈✨", "Sparkle Rainbow"], ["🦄👑", "Unicorn Queen"]] },
  { n: "Royal Castle", e: "🏰", list: [["🏰", "Castle"], ["🪞", "Magic Mirror"], ["🗝️", "Golden Key"], ["🫖", "Tea Party"], ["🎻", "Royal Violin"], ["🕯️", "Candle"], ["💌", "Royal Letter"], ["👸", "Princess"], ["🧚", "Fairy Godmother"], ["💍", "Royal Ring"], ["🪄✨", "Spell Sparkle"], ["👑💎", "Diamond Crown"]] },
  { n: "Butterfly Garden", e: "🦋", list: [["🌻", "Sunflower"], ["🐝", "Busy Bee"], ["🐞", "Ladybug"], ["🌿", "Leafy Vine"], ["🍄", "Toadstool"], ["🐛", "Caterpillar"], ["🌹", "Rose"], ["🪺", "Bird Nest"], ["🐦", "Songbird"], ["💐", "Bouquet"], ["🦋🌸", "Blossom Butterfly"], ["🦋👑", "Butterfly Queen"]] },
  { n: "Sweet Bakery", e: "🧁", list: [["🍪", "Cookie"], ["🍰", "Cake Slice"], ["🍦", "Ice Cream"], ["🍬", "Candy"], ["🥞", "Pancakes"], ["🫐", "Blueberries"], ["🍫", "Chocolate"], ["🍒", "Cherries"], ["🧇", "Waffle"], ["🍡", "Sweet Treats"], ["🎂", "Birthday Cake"], ["🧁👑", "Royal Cupcake"]] },
  { n: "Mermaid Lagoon", e: "🧜‍♀️", list: [["🐚", "Seashell"], ["🐠", "Tropical Fish"], ["🦀", "Crab"], ["🐢", "Sea Turtle"], ["🐙", "Octopus"], ["🌊", "Wave"], ["🐳", "Whale"], ["🪸", "Coral"], ["🦭", "Seal"], ["🐡", "Puffer Fish"], ["🧜‍♀️", "Mermaid"], ["🧜‍♀️👑", "Mermaid Princess"]] },
  { n: "Kitty & Friends", e: "🐱", list: [["🐶", "Puppy"], ["🐹", "Hamster"], ["🐥", "Chick"], ["🐼", "Panda"], ["🦊", "Fox"], ["🐨", "Koala"], ["🐾", "Paw Prints"], ["🦢", "Swan"], ["😻", "Love Kitty"], ["🐱👑", "Queen Kitty"]] },
  { n: "Sparkle Gems", e: "💎", list: [["✨", "Sparkles"], ["💫", "Dizzy Star"], ["🔮", "Crystal Ball"], ["🪩", "Disco Ball"], ["💜", "Purple Heart"], ["💗", "Growing Heart"], ["🌟💎", "Star Gem"], ["💖✨", "Glitter Heart"], ["💎🌈", "Rainbow Gem"], ["💎👑", "Legendary Tiara"]] },
];
// cost for the k-th star sticker rises slowly: 24, 52, 84, 120 ...
export const starCost = (k: number) => 24 * k + 2 * k * (k - 1);
export const STICKERS: Sticker[] = (() => {
  const out: Sticker[] = []; let k = 0;
  ALBUMS.forEach((al, a) => {
    const n = al.list.length;
    al.list.forEach(([e, name], i) => {
      let rarity: Rarity = "common"; let rule: Rule;
      if (a === 0) { k++; rule = { t: "stars", n: starCost(k) }; }
      else if (i === n - 1) { rarity = "legendary"; rule = { t: "album", n: a }; }
      else if (i >= n - 3) { rarity = "sparkly"; rule = i === n - 3 ? { t: "master", n: a } : { t: "today", n: 2 * a + 1 }; }
      else if (i >= n - 6) { rarity = "rare"; const j = i - (n - 6); rule = j === 0 ? { t: "first", n: 75 * a } : j === 1 ? { t: "perfect", n: 2 * a - 1 } : { t: "best", n: 5 + 3 * a }; }
      else { k++; rule = { t: "stars", n: starCost(k) }; }
      out.push({ id: `${a}:${i}`, e, name, album: a, rarity, rule });
    });
  });
  return out;
})();
export function hint(s: Sticker): string {
  const r = s.rule;
  switch (r.t) {
    case "stars": return `Collect ${r.n} stars`;
    case "first": return `Get ${r.n} answers right on the first try`;
    case "perfect": return `Finish ${r.n} perfect ${r.n === 1 ? "round" : "rounds"}`;
    case "best": return `Get ${r.n} right in a row`;
    case "master": return `Master ${r.n} ${r.n === 1 ? "level" : "levels"} (80%+)`;
    case "today": return `Play Today ${r.n} days in a row`;
    case "album": return `Finish the ${ALBUMS[r.n].n} album`;
  }
}
export function earned(s: Sticker, st: Stats, got: Set<string>): boolean {
  const r = s.rule;
  switch (r.t) {
    case "stars": return st.stars >= r.n;
    case "first": return st.first >= r.n;
    case "perfect": return st.perfect >= r.n;
    case "best": return st.best >= r.n;
    case "master": return st.master >= r.n;
    case "today": return st.today >= r.n;
    case "album": return STICKERS.filter((x) => x.album === r.n && x.id !== s.id).every((x) => got.has(x.id));
  }
}
// Old saves stored the emoji of each earned sticker (first 20 = Sweet Start).
export function migrate(old: string[]): string[] { return old.map((e) => { const s = STICKERS.find((x) => x.album === 0 && x.e === e); return s ? s.id : ""; }).filter(Boolean); }
export function newly(st: Stats, gotIds: string[]): Sticker[] {
  const got = new Set(gotIds); const out: Sticker[] = [];
  for (let pass = 0; pass < 2; pass++) for (const s of STICKERS) if (!got.has(s.id) && earned(s, st, got)) { got.add(s.id); out.push(s); }
  return out;
}
