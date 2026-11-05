// ===== Klausaiyan and the Geometry Garden — prototype =====
const $ = id => document.getElementById(id);
const NUM = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const SCALE = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];

let audioCtx = null;
let muted = false;
let lastInstruction = "";
let current = null;

const LEVELS = {
  circle: { title: "Circle Moon", stages: 4, gem: "🌙", celebrateEmoji: "🌙",
    celebrateText: "Ember says: You found the circles — circles have NO corners — counted the stars, and read the word MOON!" },
  hex: { title: "Hexagon Honeycomb", stages: 4, gem: "🍯", celebrateEmoji: "🐝",
    celebrateText: "Ember says: You KNOW the hexagon now — six sides! Bees build hexagons because they fit together with NO gaps!" },
  planet: { title: "Planet Parade", stages: 4, gem: "🪐", celebrateEmoji: "🚀",
    celebrateText: "Ember says: What a countdown! You met ALL the planets and counted to TEN like a real space hero!" },
  triangle: { title: "Triangle Mountain", stages: 4, gem: "🔺", celebrateEmoji: "⛰️",
    celebrateText: "Ember says: Triangles are the STRONGEST shape — that's why mountains and bridges wear them!" },
  square: { title: "Square Dino Home", stages: 4, gem: "🦖", celebrateEmoji: "🦖",
    celebrateText: "Ember says: Squares stack and build ANYTHING — houses, towers, whole cities of blocks!" },
  spiral: { title: "Spiral Shell Beach", stages: 4, gem: "🐚", celebrateEmoji: "🌀",
    celebrateText: "Ember says: Spirals hide in shells and sunflowers — and whole GALAXIES swirl like spirals in space!" },
  flower: { title: "The Great Flower", stages: 1, gem: "🌸", celebrateEmoji: "🌸",
    celebrateText: "Ember says: You grew the Flower of Life — circles holding hands! You are a true Geometry Garden hero, Klausaiyan!" },
  match: { title: "Match Quest", stages: 5, gem: "🧩", celebrateEmoji: "🧩",
    celebrateText: "Ember says: Shadow matcher, number matcher, word matcher — you matched them ALL!" },
  frog: { title: "Frog Coding Pond", stages: 4, gem: "🐸", celebrateEmoji: "🐸",
    celebrateText: "Ember says: You are a CODER now! You told the frog exactly what to do — and it worked!" },
  dj: { title: "DJ Quest", stages: 5, gem: "🎧", celebrateEmoji: "🎧",
    celebrateText: "Ember says: DJ Klausaiyan in the house! You copied beats, finished melodies, and made your OWN music!" },
  keys: { title: "Keyboard Hero", stages: 3, gem: "⌨️", celebrateEmoji: "⌨️",
    celebrateText: "Ember says: You typed your name on a keyboard like a real computer hero!" },
  math: { title: "Number Nebula", stages: 5, gem: "🧮", celebrateEmoji: "🚀",
    celebrateText: "Ember says: Addition, subtraction, skip counting, comparing, AND word problems — you are a true Number Nebula navigator!" },
  read: { title: "Story Star Library", stages: 4, gem: "📚", celebrateEmoji: "📚",
    celebrateText: "Ember says: Blends, sentences, whole STORIES, and spelling — you are becoming a reader, hero!" },
  sophia: { title: "Sophia's Rainbow Meadow", stages: 3, gem: "🌈", celebrateEmoji: "🐴",
    celebrateText: "Ember says: Colors, counting horses, and finding shapes — what a bright meadow explorer!" },
  geo: { title: "Geometry Lab", stages: 4, gem: "🔷", celebrateEmoji: "🔷",
    celebrateText: "Ember says: Sides, symmetry, 3D shapes, AND perimeter — you think like a real geometry scientist now!" },
  rocket: { title: "Rocket Math Lab", stages: 5, gem: "🛸", celebrateEmoji: "🛸",
    celebrateText: "Ember says: Multiplication, division, fractions, place value, AND money — Rocket Math Lab conquered!" },
  wizard: { title: "Word Wizard Academy", stages: 4, gem: "🧙", celebrateEmoji: "🧙",
    celebrateText: "Ember says: Rhymes, building whole sentences, main ideas, and big vocabulary words — Word Wizard, level up!" },
  stars: { title: "Star Scientist", stages: 4, gem: "🌌", celebrateEmoji: "🔭",
    celebrateText: "Ember says: Planet order, moon phases, light-years, nebulas, and black holes — you are a true Star Scientist!" },
  zen: { title: "Mindfulness Journey", stages: 4, gem: "🪷", celebrateEmoji: "🪷",
    celebrateText: "Ember says: You breathed like a dragon, named your feelings, chose kindness, and sent wishes of love to the whole world!" },
  animals: { title: "Animal Kingdom", stages: 4, gem: "🦁", celebrateEmoji: "🦁",
    celebrateText: "Ember says: Habitats, animal families, riddles, and baby animal names — you are a true friend of animals!" },
  tales: { title: "Ember's Story Tales", stages: 2, gem: "📖", celebrateEmoji: "📖",
    celebrateText: "Ember says: Two whole stories, lived by YOU! Stories teach our hearts to be brave, patient, and kind!" }
};

// Love notes: every celebration ends by reminding them they are loved.
const LOVE_NOTES = [
  "And remember: you are loved exactly as you are — always. 💛",
  "You are loved bigger than the whole sky. 🌌",
  "Nothing could ever make you more loved. You already are, completely. 💛",
  "You are loved on your best days AND your hard days. Always. 🌈",
  "Ember loves you, your family loves you, and this garden loves you. 💛"
];

// Show-and-tell missions: something to go teach/show another human after each world.
const TELLS = {
  circle: "🌟 Show & Tell Mission: find a circle in the kitchen and announce, “Circles have NO corners!”",
  hex: "🌟 Show & Tell Mission: tell someone, “Bees build hexagons — they have SIX sides!”",
  planet: "🌟 Show & Tell Mission: point at the sky tonight and name a planet for someone!",
  triangle: "🌟 Show & Tell Mission: find a triangle somewhere and tell someone it's the STRONGEST shape!",
  square: "🌟 Show & Tell Mission: stack some blocks and count the sides of a square out loud!",
  spiral: "🌟 Show & Tell Mission: find a spiral — a shell, a snail, a swirl — and show someone!",
  flower: "🌟 Show & Tell Mission: draw a flower made of circles for someone you love!",
  match: "🌟 Show & Tell Mission: match a pair of socks and tell someone HOW you knew they match!",
  frog: "🌟 Show & Tell Mission: give someone three instructions — hop, spin, hop — and watch them follow YOUR code!",
  dj: "🌟 Show & Tell Mission: perform your beat for someone — and count 1, 2, 3, 4 out loud while it plays!",
  keys: "🌟 Show & Tell Mission: type or write your name and read out every letter as you go!",
  math: "🌟 Show & Tell Mission: ask someone, “What is 6 plus 4?” — then tell them the answer before they do!",
  read: "🌟 Show & Tell Mission: read a story out loud to someone — every single word!",
  sophia: "🌟 Show & Tell Mission: point at something RED, something BLUE, and count the horses you can find!",
  geo: "🌟 Show & Tell Mission: tell someone, “A square has FOUR lines of symmetry — and perimeter means adding ALL the sides!”",
  rocket: "🌟 Show & Tell Mission: ask someone, “What is 3 times 4?” then explain it's 3 groups of 4!",
  wizard: "🌟 Show & Tell Mission: teach someone a big word — tell them what ENORMOUS means!",
  stars: "🌟 Show & Tell Mission: tell someone, “Sunlight takes 8 minutes to reach us — and a light-year is a DISTANCE!”",
  zen: "🌟 Show & Tell Mission: teach someone the dragon breath — breathe in slowly, breathe out even slower — then tell them one kind wish!",
  animals: "🌟 Show & Tell Mission: tell someone, “A group of wolves is called a PACK — and elephants talk in rumbles too low to hear!”",
  tales: "🌟 Show & Tell Mission: retell Ember's story in your own words — and tell someone the lesson at its heart!"
};

const WORLD_KEYS = ["circle", "hex", "planet", "triangle", "square", "spiral"];
function allWorldsDone() { return WORLD_KEYS.every(k => gems[k]); }

// ===== Players: Klaus and Sophia each get their OWN saved garden =====
// Same site, same game — progress is stored per player, so neither child
// ever overwrites the other's gems or discoveries.
const PLAYERS = {
  klaus: { id: "klaus", short: "Klaus", hero: "Klausaiyan", emoji: "🦖" },
  sophia: { id: "sophia", short: "Sophia", hero: "Princess Sophia", emoji: "👑" }
};
let playerId = "klaus";
try { playerId = localStorage.getItem("klausaiyanPlayer") || "klaus"; } catch (e) {}
if (!PLAYERS[playerId]) playerId = "klaus";
function player() { return PLAYERS[playerId]; }
function gemKey() { return "klausaiyanGems_" + playerId; }
function factKey() { return "klausaiyanFacts_" + playerId; }

function loadGems() {
  try {
    let raw = localStorage.getItem(gemKey());
    // One-time migration: Klaus's original progress moves into his profile.
    if (!raw && playerId === "klaus") raw = localStorage.getItem("klausaiyanGems");
    return JSON.parse(raw) || {};
  } catch (e) { return {}; }
}
function saveGems() {
  try { localStorage.setItem(gemKey(), JSON.stringify(gems)); } catch (e) {}
}
let gems = loadGems();

// ===== Sound: chimes + guiding voice =====
function tone(freq, delay = 0, dur = 0.35) {
  if (muted) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const t = audioCtx.currentTime + delay;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.22, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  } catch (e) {}
}
function chime(step = 0) { tone(SCALE[Math.max(0, Math.min(step, SCALE.length - 1))]); }
function fanfare() { [0, 2, 4, 7].forEach((n, i) => tone(SCALE[n], i * 0.13, 0.5)); }

// ===== The prettiest voice the device has =====
// The browser picks its plain default voice unless we choose — so we hunt
// through the installed voices for a warm, natural one (the same nice voices
// the device uses for audiobooks), and fall back gracefully if none exist.
let prettyVoice = null;
function pickPrettyVoice() {
  try {
    const voices = speechSynthesis.getVoices();
    if (!voices || !voices.length) return;
    const favorites = [
      "Google US English",           // Chrome / Android — smooth and natural
      "Microsoft Aria",              // Edge neural voices
      "Microsoft Jenny",
      "Microsoft Zira",
      "Samantha",                    // Apple devices
      "Karen", "Moira", "Tessa",     // Apple English variants
      "Google English"
    ];
    for (const fav of favorites) {
      const v = voices.find(v => v.name && v.name.includes(fav));
      if (v) { prettyVoice = v; return; }
    }
    // Otherwise: prefer a US English voice, then any English voice.
    prettyVoice =
      voices.find(v => /^en[-_]US/i.test(v.lang || "")) ||
      voices.find(v => /^en/i.test(v.lang || "")) ||
      prettyVoice;
  } catch (e) {}
}
try {
  pickPrettyVoice();
  if (window.speechSynthesis) speechSynthesis.onvoiceschanged = pickPrettyVoice;
} catch (e) {}

function speak(text, isInstruction = false) {
  if (isInstruction) {
    lastInstruction = text;
    $("stageMsg").textContent = text;
  }
  if (muted) return;
  try {
    // The screen shows "Klausaiyan", but the voice says it the way Mommy says it:
    // "Klouse" (rhymes with house) + "Say-yen" (the end of Saiyan, Dragon Ball Z style).
    const spoken = text
      .replace(/Klausaiyan/g, "Klouse Say-yen")
      .replace(/\bdinos\b/gi, "dye-nose")
      .replace(/\bdino\b/gi, "dye-no");
    speechSynthesis.cancel();
    // Speak sentence by sentence: natural little pauses between sentences make
    // the voice sound like storytelling instead of one long robot run-on, and
    // short chunks never get cut off the way very long utterances can be.
    const chunks = spoken.match(/[^.!?…]+[.!?…]*["”']?\s*/g) || [spoken];
    chunks.map(s => s.trim()).filter(Boolean).forEach(part => {
      const u = new SpeechSynthesisUtterance(part);
      if (prettyVoice) u.voice = prettyVoice;
      u.rate = 0.94;   // a touch slower — warm and easy to follow
      // Google voices sound best near their natural pitch; others get a
      // gentle lift so they sound friendly rather than flat.
      u.pitch = prettyVoice && /google/i.test(prettyVoice.name) ? 1.0 : 1.06;
      speechSynthesis.speak(u);
    });
  } catch (e) {}
}


// Defensive helpers: a missing element can never kill the rest of the game.
function wire(id, fn) { const el = $(id); if (el) el.addEventListener("click", fn); }
function tg(id, cls, on) { const el = $(id); if (el) el.classList.toggle(cls, on); }

// ===== Screens =====
function show(id) {
  stopSeq();
  ["screenTitle", "screenMap", "screenLevel", "screenDiscover"].forEach(s => $(s).classList.toggle("hidden", s !== id));
}

function renderMap() {
  const keys = Object.keys(LEVELS);
  $("gemRow").innerHTML = keys.map(k =>
    `<span class="gem${gems[k] ? " earned" : ""}">${LEVELS[k].gem}</span>`).join("");
  const earned = keys.filter(k => gems[k]).length;
  $("gardenBed").textContent = earned === 0 ? "🌱 🌱 🌱" : "🌸🌼".repeat(earned) + "🌷";
  tg("worldCircle", "done", !!gems.circle);
  tg("worldHex", "done", !!gems.hex);
  tg("worldPlanet", "done", !!gems.planet);
  tg("worldTriangle", "done", !!gems.triangle);
  tg("worldSquare", "done", !!gems.square);
  tg("worldSpiral", "done", !!gems.spiral);
  tg("worldFlower", "done", !!gems.flower);
  tg("worldFlower", "sleeping", !allWorldsDone() && !gems.flower);
  const fh = $("flowerHint"); if (fh) fh.textContent = gems.flower ? "Bloomed! 🌸" : allWorldsDone() ? "Tap to bloom!" : "Wake all 6 worlds first…";
  tg("worldMatch", "done", !!gems.match);
  tg("worldFrog", "done", !!gems.frog);
  tg("worldDJ", "done", !!gems.dj);
  tg("worldKeys", "done", !!gems.keys);
  tg("worldMath", "done", !!gems.math);
  tg("worldRead", "done", !!gems.read);
  tg("worldSophia", "done", !!gems.sophia);
  tg("worldGeo", "done", !!gems.geo);
  tg("worldRocket", "done", !!gems.rocket);
  tg("worldWizard", "done", !!gems.wizard);
  tg("worldStars", "done", !!gems.stars);
  tg("worldZen", "done", !!gems.zen);
  tg("worldAnimals", "done", !!gems.animals);
  tg("worldTales", "done", !!gems.tales);
  const fl = $("factLine");
  if (fl) fl.textContent = discoveredFacts.size > 0
    ? `⭐ Facts discovered: ${discoveredFacts.size} of ${DISCOVER.length} — keep exploring!`
    : "";
}

function sparkles() {
  const area = $("stageArea");
  for (let i = 0; i < 9; i++) {
    const s = document.createElement("span");
    s.className = "sparkle";
    s.textContent = ["✨", "⭐", "💛"][i % 3];
    s.style.left = (8 + Math.random() * 82) + "%";
    s.style.top = (12 + Math.random() * 55) + "%";
    area.appendChild(s);
    setTimeout(() => s.remove(), 1100);
  }
}

// ===== Level flow =====
let stageAdvancing = false;
function startLevel(key) {
  stageAdvancing = false;
  current = { key, stage: 0 };
  show("screenLevel");
  $("levelTitle").textContent = LEVELS[key].title;
  renderStage();
}

function renderStage() {
  stopSeq();
  if (!current) return;
  const { key, stage } = current;
  const total = LEVELS[key].stages;
  $("stageDots").textContent = "● ".repeat(stage + 1) + "○ ".repeat(total - stage - 1);
  $("stageArea").innerHTML = "";
  const fn = { circle: circleStage, hex: hexStage, planet: planetStage,
    triangle: triangleStage, square: squareStage, spiral: spiralStage, flower: flowerStage,
    match: matchStage, frog: frogStage, dj: djStage, keys: keysStage,
    math: mathStage, read: readStage, sophia: sophiaStage, geo: geoStage,
    rocket: rocketStage, wizard: wizardStage, stars: starsStage,
    zen: zenStage, animals: animalsStage, tales: talesStage }[key];
  try { fn(stage); }
  catch (e) { $("stageMsg").textContent = "Oh no — this world got tangled! Tell Mommy to refresh the page!"; }
  stageAdvancing = false;
}

function nextStage() {
  if (!current || stageAdvancing) return;
  stageAdvancing = true;
  sparkles();
  current.stage += 1;
  if (current.stage >= LEVELS[current.key].stages) completeLevel();
  else setTimeout(renderStage, 650);
}

function completeLevel() {
  if (!current) return;
  stageAdvancing = false;
  const key = current.key;
  gems[key] = true;
  saveGems();
  fanfare();
  $("celebrateEmoji").textContent = LEVELS[key].celebrateEmoji;
  $("celebrateTitle").textContent = "You did it, " + player().hero + "!";
  $("celebrateText").textContent = LEVELS[key].celebrateText;
  const love = LOVE_NOTES[Object.keys(gems).length % LOVE_NOTES.length];
  const loveEl = $("celebrateLove");
  if (loveEl) loveEl.textContent = love;
  $("celebrateTell").textContent = TELLS[key] || "";
  $("celebrate").classList.remove("hidden");
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("span");
    s.className = "sparkle";
    s.textContent = ["✨", "⭐", "💛", "🌸"][i % 4];
    s.style.left = (5 + Math.random() * 88) + "%";
    s.style.top = (8 + Math.random() * 70) + "%";
    $("celebrate").appendChild(s);
    setTimeout(() => s.remove(), 1300);
  }
  speak("You did it, " + player().hero + "! " + LEVELS[key].celebrateText + " " + love);
  current = null;
}

function shapeDiv(type, color, size) {
  const d = document.createElement("div");
  d.className = "shape " + type;
  d.style.background = color;
  if (size) { d.style.width = size + "px"; d.style.height = size + "px"; }
  return d;
}

function makeDraggable(piece, slots, onPlaced) {
  piece.addEventListener("pointerdown", e => {
    e.preventDefault();
    const area = piece.parentElement;
    const areaRect = area.getBoundingClientRect();
    const startX = e.clientX, startY = e.clientY;
    const baseX = piece.offsetLeft + piece.offsetWidth / 2;
    const baseY = piece.offsetTop + piece.offsetHeight / 2;
    piece.style.zIndex = 8;

    function move(ev) {
      piece.style.left = (baseX + ev.clientX - startX) + "px";
      piece.style.top = (baseY + ev.clientY - startY) + "px";
    }
    function up(ev) {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      const pr = piece.getBoundingClientRect();
      const pcx = pr.left + pr.width / 2, pcy = pr.top + pr.height / 2;
      let best = null, bestDist = 95;
      slots.forEach(slot => {
        if (slot.classList.contains("filled")) return;
        const sr = slot.getBoundingClientRect();
        const d = Math.hypot(pcx - (sr.left + sr.width / 2), pcy - (sr.top + sr.height / 2));
        if (d < bestDist) { bestDist = d; best = slot; }
      });
      if (best) {
        const sr = best.getBoundingClientRect();
        piece.style.left = (sr.left + sr.width / 2 - areaRect.left) + "px";
        piece.style.top = (sr.top + sr.height / 2 - areaRect.top) + "px";
        best.classList.add("filled");
        piece.classList.add("placed");
        chime(4);
        onPlaced();
      } else {
        piece.style.left = baseX + "px";
        piece.style.top = baseY + "px";
        tone(300, 0, 0.15);
      }
    }
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
  });
}

function dragStage(slotDefs, pieceDefs, slotClass, pieceHTML, doneText) {
  const area = $("stageArea");
  const wrap = document.createElement("div");
  wrap.className = "drag-area";
  area.appendChild(wrap);

  const slots = slotDefs.map(def => {
    const s = document.createElement("div");
    s.className = "slot " + slotClass;
    s.style.left = def.x + "%";
    s.style.top = def.y + "%";
    s.textContent = def.label || "";
    wrap.appendChild(s);
    return s;
  });

  let placed = 0;
  pieceDefs.forEach(def => {
    const p = document.createElement("div");
    p.className = "piece";
    p.style.left = def.x + "%";
    p.style.top = def.y + "%";
    if (typeof pieceHTML === "function") p.appendChild(pieceHTML());
    else p.textContent = pieceHTML;
    wrap.appendChild(p);
    makeDraggable(p, slots, () => {
      placed += 1;
      if (placed >= slots.length) {
        speak(doneText);
        setTimeout(nextStage, 1100);
      }
    });
  });
}

// ===== CIRCLE MOON =====
function circleStage(stage) {
  const area = $("stageArea");

  if (stage === 0) {
    speak("Find all the circles! Tap the circles!", true);
    const shapes = [
      ["circle", "#ffd94d"], ["triangle", "#ff9ecb"], ["circle", "#7ecbff"],
      ["square", "#8ff0c8"], ["circle", "#ffd94d"], ["hexagon", "#b79cff"],
      ["circle", "#ff9ecb"], ["square", "#ffd94d"], ["circle", "#8ff0c8"]
    ];
    let found = 0;
    const grid = document.createElement("div");
    grid.className = "shape-grid";
    shapes.forEach(([type, color]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "shape-btn";
      b.appendChild(shapeDiv(type, color));
      b.addEventListener("click", () => {
        if (type === "circle") {
          found += 1;
          b.classList.add("found");
          b.innerHTML = "⭐";
          b.style.fontSize = "3em";
          chime(found);
          if (found >= 5) { speak("You found five circles! Circles have NO corners!"); setTimeout(nextStage, 1000); }
          else speak("Circle!");
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak("That's a " + type + "!");
        }
      });
      grid.appendChild(b);
    });
    area.appendChild(grid);
  }

  if (stage === 1) {
    speak("Tap the stars, and count with me!", true);
    const big = document.createElement("div");
    big.className = "big-number";
    area.appendChild(big);
    const grid = document.createElement("div");
    grid.className = "shape-grid";
    let count = 0;
    for (let i = 0; i < 5; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "star-btn";
      b.textContent = "⭐";
      b.addEventListener("click", () => {
        if (b.classList.contains("lit")) return;
        b.classList.add("lit");
        count += 1;
        big.textContent = count;
        chime(count + 1);
        if (count >= 5) { speak("Five! Five stars! You counted to five!"); setTimeout(nextStage, 1100); }
        else speak(NUM[count] + "!");
      });
      grid.appendChild(b);
    }
    area.appendChild(grid);
  }

  if (stage === 2) {
    speak("Drag the moons to their homes in the sky!", true);
    dragStage(
      [{ x: 24, y: 28, label: "☾" }, { x: 52, y: 20, label: "☾" }, { x: 78, y: 32, label: "☾" }],
      [{ x: 24, y: 78 }, { x: 52, y: 86 }, { x: 78, y: 76 }],
      "circle-slot", "🌕",
      "All the moons are home! Beautiful!"
    );
  }

  if (stage === 3) {
    speak("Find the word: MOON!", true);
    const cards = [["BEE", "🐝"], ["MOON", "🌙"], ["EGG", "🥚"]];
    const wrap = document.createElement("div");
    wrap.className = "word-cards";
    cards.forEach(([word, emoji]) => {
      const c = document.createElement("button");
      c.type = "button";
      c.className = "word-card";
      c.innerHTML = `<span class="wc-emoji">${emoji}</span><span class="wc-word">${word}</span>`;
      c.addEventListener("click", () => {
        if (word === "MOON") {
          c.classList.add("right");
          fanfare();
          speak("Moon! M, O, O, N — that spells MOON!");
          setTimeout(nextStage, 1200);
        } else {
          c.classList.remove("wobble"); void c.offsetWidth; c.classList.add("wobble");
          speak("That word is " + word + ". Find MOON!");
        }
      });
      wrap.appendChild(c);
    });
    area.appendChild(wrap);
  }
}

// ===== HEXAGON HONEYCOMB (flagship) =====
function hexStage(stage) {
  const area = $("stageArea");

  if (stage === 0) {
    speak("This is a hexagon! Tap the glowing corners, and count its sides!", true);
    const wrap = document.createElement("div");
    wrap.className = "hex-stage";
    const big = document.createElement("div");
    big.className = "hex-big";
    wrap.appendChild(big);
    const verts = [[25, 5], [75, 5], [100, 50], [75, 95], [25, 95], [0, 50]];
    let count = 0;
    verts.forEach(([x, y]) => {
      const d = document.createElement("button");
      d.type = "button";
      d.className = "corner-dot";
      d.style.left = x + "%";
      d.style.top = y + "%";
      d.textContent = "✦";
      d.addEventListener("click", () => {
        if (d.classList.contains("lit")) return;
        d.classList.add("lit");
        count += 1;
        d.textContent = count;
        chime(count + 1);
        if (count >= 6) { speak("Six! A hexagon has SIX sides!"); setTimeout(nextStage, 1300); }
        else speak(NUM[count] + "!");
      });
      wrap.appendChild(d);
    });
    area.appendChild(wrap);
  }

  if (stage === 1) {
    speak("Find two hexagons that are the same color!", true);
    const colors = ["#ffd94d", "#7ecbff", "#ffd94d", "#ff9ecb", "#7ecbff", "#ff9ecb"];
    let first = null, matched = 0;
    const grid = document.createElement("div");
    grid.className = "shape-grid";
    colors.forEach(color => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "shape-btn";
      b.appendChild(shapeDiv("hexagon", color));
      b.addEventListener("click", () => {
        if (b.classList.contains("found")) return;
        chime(2);
        if (!first) { first = { btn: b, color }; b.style.transform = "scale(1.12)"; return; }
        if (first.btn === b) return;
        if (first.color === color) {
          [first.btn, b].forEach(x => { x.classList.add("found"); x.style.transform = ""; });
          matched += 1;
          first = null;
          if (matched >= 3) { speak("You matched ALL the hexagons!"); setTimeout(nextStage, 1100); }
          else speak("Hexagon! A match!");
        } else {
          const a = first.btn;
          [a, b].forEach(x => { x.classList.remove("wobble"); void x.offsetWidth; x.classList.add("wobble"); });
          a.style.transform = "";
          first = null;
          speak("Try again, hero!");
        }
      });
      grid.appendChild(b);
    });
    area.appendChild(grid);
  }

  if (stage === 2) {
    speak("Drag the hexagons into the honeycomb, and help the bees!", true);
    dragStage(
      [{ x: 27, y: 30 }, { x: 52, y: 24 }, { x: 75, y: 32 }],
      [{ x: 27, y: 80 }, { x: 52, y: 88 }, { x: 75, y: 78 }],
      "hex-slot",
      () => shapeDiv("hexagon", "#ffd94d", 92),
      "The bees are home! Hexagons make the honeycomb!"
    );
    setTimeout(() => {
      const wrap = area.querySelector(".drag-area");
      if (wrap) ["🐝", "🐝", "🐝"].forEach((bee, i) => {
        const s = document.createElement("span");
        s.textContent = bee;
        s.style.cssText = `position:absolute;font-size:2em;left:${18 + i * 26}%;top:6%;`;
        wrap.appendChild(s);
      });
    }, 60);
  }

  if (stage === 3) {
    speak("Find the letter H! H says huh — Hexagon! Honeycomb!", true);
    const cards = [["K", "⭐"], ["H", "🍯"], ["S", "🐚"]];
    const wrap = document.createElement("div");
    wrap.className = "word-cards";
    cards.forEach(([letter, emoji]) => {
      const c = document.createElement("button");
      c.type = "button";
      c.className = "word-card";
      c.innerHTML = `<span class="wc-emoji">${emoji}</span><span class="wc-word">${letter}</span>`;
      c.addEventListener("click", () => {
        if (letter === "H") {
          c.classList.add("right");
          fanfare();
          speak("H! Huh-huh-HEXAGON! Huh-huh-HONEYCOMB!");
          setTimeout(nextStage, 1300);
        } else {
          c.classList.remove("wobble"); void c.offsetWidth; c.classList.add("wobble");
          speak("That's the letter " + letter + ". Find H!");
        }
      });
      wrap.appendChild(c);
    });
    area.appendChild(wrap);
  }
}

// ===== PLANET PARADE =====
function planetStage(stage) {
  const area = $("stageArea");

  if (stage === 0) {
    speak("Rocket countdown! Tap the numbers: five, four, three, two, one!", true);
    const rocket = document.createElement("div");
    rocket.className = "rocket";
    rocket.textContent = "🚀";
    area.appendChild(rocket);
    const row = document.createElement("div");
    row.className = "shape-grid";
    let expected = 5;
    [5, 4, 3, 2, 1].forEach(n => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "count-btn" + (n === 5 ? " next" : "");
      b.textContent = n;
      b.dataset.n = n;
      b.addEventListener("click", () => {
        if (Number(b.dataset.n) !== expected || b.classList.contains("done")) {
          if (!b.classList.contains("done")) speak("Find the number " + expected + "!");
          return;
        }
        b.classList.add("done");
        b.classList.remove("next");
        chime(6 - n);
        expected -= 1;
        row.querySelectorAll(".count-btn").forEach(x => {
          if (Number(x.dataset.n) === expected) x.classList.add("next");
        });
        if (expected === 0) {
          rocket.classList.add("blast");
          fanfare();
          speak("Blast off!");
          setTimeout(nextStage, 1600);
        } else {
          speak(NUM[n] + "!");
        }
      });
      row.appendChild(b);
    });
    area.appendChild(row);
  }

  if (stage === 1) {
    speak("Tap each planet, and say hello! Planets are round like circles — spheres!", true);
    const bodies = [
      { name: "Sun", sun: true, emoji: "\u2600\uFE0F", size: 110, facts: ["The Sun is a STAR!", "The Sun is not a planet. It is our star!", "The Sun gives us light and warmth!"] },
      { name: "Mercury", color: "#c9b8a3", size: 52, facts: ["Mercury! The smallest planet!", "Mercury is closest to the Sun!", "Mercury zooms around the Sun the fastest!"] },
      { name: "Venus", color: "#ffce7a", size: 78, facts: ["Venus! The hottest planet!", "Venus is the brightest planet in our sky!", "Venus spins the other way!"] },
      { name: "Earth", emoji: "\uD83C\uDF0D", size: 84, facts: ["Earth! Our home!", "Earth has ONE moon!", "Earth is where YOU live, hero!"] },
      { name: "Mars", color: "#ff6b57", size: 66, facts: ["Mars! The red planet!", "Mars has the tallest volcano in space!", "Little robots drive on Mars!"] },
      { name: "Jupiter", color: "#ffb84d", size: 124, facts: ["Jupiter! The BIGGEST planet!", "Jupiter has a giant red storm!", "Jupiter is so big, every other planet could fit inside!"] },
      { name: "Saturn", emoji: "\uD83E\uDE90", size: 116, facts: ["Saturn! It has beautiful rings!", "Saturn's rings are made of ice and rock!", "Saturn has more moons than any other planet!"] },
      { name: "Uranus", color: "#8ff0e4", size: 92, facts: ["Uranus! It rolls around on its side!", "Uranus is icy and teal!", "Uranus spins like a rolling ball!"] },
      { name: "Neptune", color: "#6f8dff", size: 88, facts: ["Neptune! The windiest planet!", "Neptune is the FARTHEST planet from the Sun!", "Neptune is deep, dark blue!"] }
    ];
    let visited = 0;
    const totalPlanets = bodies.filter(b => !b.sun).length;
    const row = document.createElement("div");
    row.className = "planet-row";
    bodies.forEach(p => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "planet";
      let factIdx = 0;
      const ball = document.createElement("span");
      ball.className = "p-ball";
      ball.style.width = p.size + "px";
      ball.style.height = p.size + "px";
      if (p.emoji) { ball.textContent = p.emoji; ball.style.fontSize = (p.size * 0.8) + "px"; }
      else ball.style.background = `radial-gradient(circle at 35% 32%, #ffffff88, ${p.color} 55%)`;
      const label = document.createElement("span");
      label.textContent = p.name;
      b.appendChild(ball);
      b.appendChild(label);
      b.addEventListener("click", () => {
        const fact = p.facts[factIdx % p.facts.length];
        factIdx += 1;
        chime(3);
        if (!p.sun && !b.classList.contains("visited")) {
          b.classList.add("visited");
          visited += 1;
          if (visited >= totalPlanets) {
            speak(fact + " You visited ALL the planets!");
            setTimeout(nextStage, 1500);
            return;
          }
        }
        speak(fact);
      });
      row.appendChild(b);
    });
    area.appendChild(row);
  }

  if (stage === 2) {
    speak("Space counting! Tap the stars, and count all the way to TEN!", true);
    const big = document.createElement("div");
    big.className = "big-number";
    area.appendChild(big);
    const grid = document.createElement("div");
    grid.className = "shape-grid";
    let count = 0;
    for (let i = 0; i < 10; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "star-btn";
      b.textContent = "\u2B50";
      b.addEventListener("click", () => {
        if (b.classList.contains("lit")) return;
        b.classList.add("lit");
        count += 1;
        big.textContent = count;
        chime(count);
        if (count >= 10) { speak("TEN stars! You counted all the way to TEN!"); setTimeout(nextStage, 1400); }
        else speak(NUM[count] + "!");
      });
      grid.appendChild(b);
    }
    area.appendChild(grid);
  }


  if (stage === 3) {
    speak("Tap the planets from BIGGEST to SMALLEST!", true);
    const order = ["Jupiter", "Saturn", "Earth", "Mars"];
    const display = [
      { name: "Earth", emoji: "\uD83C\uDF0D", size: 84 },
      { name: "Jupiter", color: "#ffb84d", size: 124 },
      { name: "Mars", color: "#ff6b57", size: 66 },
      { name: "Saturn", emoji: "\uD83E\uDE90", size: 112 }
    ];
    let next = 0;
    const row = document.createElement("div");
    row.className = "planet-row";
    display.forEach(pl => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "planet";
      const ball = document.createElement("span");
      ball.className = "p-ball";
      ball.style.width = pl.size + "px";
      ball.style.height = pl.size + "px";
      if (pl.emoji) { ball.textContent = pl.emoji; ball.style.fontSize = (pl.size * 0.8) + "px"; }
      else ball.style.background = `radial-gradient(circle at 35% 32%, #ffffff88, ${pl.color} 55%)`;
      const label = document.createElement("span");
      label.textContent = pl.name;
      b.appendChild(ball);
      b.appendChild(label);
      b.addEventListener("click", () => {
        if (b.classList.contains("visited")) return;
        if (pl.name === order[next]) {
          b.classList.add("visited");
          next += 1;
          chime(next + 2);
          if (next >= order.length) { speak("You sorted the planets by size! Jupiter is the GIANT!"); setTimeout(nextStage, 1400); }
          else speak(pl.name + "! Next!");
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak("Find the BIGGEST one left!");
        }
      });
      row.appendChild(b);
    });
    area.appendChild(row);
  }
}

// ===== Shared mini-game helpers =====
function tapFindStage(items, target, need, instruction, doneLine) {
  const area = $("stageArea");
  speak(instruction, true);
  let found = 0;
  const grid = document.createElement("div");
  grid.className = "shape-grid";
  items.forEach(([type, color]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "shape-btn";
    b.appendChild(shapeDiv(type, color));
    b.addEventListener("click", () => {
      if (type === target) {
        if (b.classList.contains("found")) return;
        found += 1;
        b.classList.add("found");
        b.innerHTML = "\u2B50";
        b.style.fontSize = "3em";
        chime(found + 1);
        if (found >= need) { speak(doneLine); setTimeout(nextStage, 1100); }
        else speak(target.charAt(0).toUpperCase() + target.slice(1) + "!");
      } else {
        b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
        speak("That's a " + type + "!");
      }
    });
    grid.appendChild(b);
  });
  area.appendChild(grid);
}

function countSidesStage(shapeType, verts, color, instruction, doneLine) {
  const area = $("stageArea");
  speak(instruction, true);
  const wrap = document.createElement("div");
  wrap.className = "sides-stage";
  const big = shapeDiv(shapeType, color, 248);
  big.style.position = "absolute";
  big.style.left = "16px";
  big.style.top = "16px";
  wrap.appendChild(big);
  let count = 0;
  verts.forEach(([x, y]) => {
    const d = document.createElement("button");
    d.type = "button";
    d.className = "corner-dot";
    d.style.left = x + "%";
    d.style.top = y + "%";
    d.textContent = "\u2726";
    d.addEventListener("click", () => {
      if (d.classList.contains("lit")) return;
      d.classList.add("lit");
      count += 1;
      d.textContent = count;
      chime(count + 1);
      if (count >= verts.length) { speak(doneLine); setTimeout(nextStage, 1300); }
      else speak(NUM[count] + "!");
    });
    wrap.appendChild(d);
  });
  area.appendChild(wrap);
}

function letterStage(cards, correct, instruction, correctLine) {
  const area = $("stageArea");
  speak(instruction, true);
  const wrap = document.createElement("div");
  wrap.className = "word-cards";
  cards.forEach(([letter, emoji]) => {
    const c = document.createElement("button");
    c.type = "button";
    c.className = "word-card";
    c.innerHTML = `<span class="wc-emoji">${emoji}</span><span class="wc-word">${letter}</span>`;
    c.addEventListener("click", () => {
      if (letter === correct) {
        c.classList.add("right");
        fanfare();
        speak(correctLine);
        setTimeout(nextStage, 1300);
      } else {
        c.classList.remove("wobble"); void c.offsetWidth; c.classList.add("wobble");
        speak("That's the letter " + letter + ". Find " + correct + "!");
      }
    });
    wrap.appendChild(c);
  });
  area.appendChild(wrap);
}

function wordStage(word, cards, instruction, spellLine) {
  const area = $("stageArea");
  speak(instruction, true);
  const wrap = document.createElement("div");
  wrap.className = "word-cards";
  cards.forEach(([w, emoji]) => {
    const c = document.createElement("button");
    c.type = "button";
    c.className = "word-card";
    c.innerHTML = `<span class="wc-emoji">${emoji}</span><span class="wc-word">${w}</span>`;
    c.addEventListener("click", () => {
      if (w === word) {
        c.classList.add("right");
        fanfare();
        speak(spellLine);
        setTimeout(nextStage, 1300);
      } else {
        c.classList.remove("wobble"); void c.offsetWidth; c.classList.add("wobble");
        speak("That word is " + w + ". Find " + word + "!");
      }
    });
    wrap.appendChild(c);
  });
  area.appendChild(wrap);
}

// ===== TRIANGLE MOUNTAIN =====
function triangleStage(stage) {
  if (stage === 0) {
    tapFindStage(
      [["triangle", "#ff9ecb"], ["circle", "#ffd94d"], ["triangle", "#7ecbff"],
       ["square", "#8ff0c8"], ["triangle", "#ffd94d"], ["hexagon", "#b79cff"],
       ["triangle", "#8ff0c8"], ["square", "#ff9ecb"], ["triangle", "#b79cff"]],
      "triangle", 5,
      "Find all the triangles! Triangles point up like mountains!",
      "You found five triangles! To the mountain!"
    );
  }
  if (stage === 1) {
    countSidesStage("triangle", [[50, 8], [92, 88], [8, 88]], "#ff9ecb",
      "Count the sides of the triangle! Tap the glowing corners!",
      "Three! A triangle has THREE sides and THREE corners!");
  }
  if (stage === 2) {
    speak("Drag the triangles, and build Triangle Mountain!", true);
    dragStage(
      [{ x: 30, y: 52 }, { x: 50, y: 32 }, { x: 70, y: 52 }],
      [{ x: 26, y: 84 }, { x: 52, y: 88 }, { x: 78, y: 84 }],
      "tri-slot",
      () => shapeDiv("triangle", "#c9a7ff", 92),
      "You built Triangle Mountain! Triangles are SUPER strong!"
    );
  }
  if (stage === 3) {
    letterStage([["M", "\uD83C\uDF19"], ["T", "\u26F0\uFE0F"], ["B", "\uD83D\uDC1D"]], "T",
      "Find the letter T! T says tuh \u2014 Triangle!",
      "T! Tuh-tuh-TRIANGLE!");
  }
}

// ===== SQUARE DINO HOME =====
function squareStage(stage) {
  const area = $("stageArea");
  if (stage === 0) {
    tapFindStage(
      [["square", "#8ff0c8"], ["circle", "#ffd94d"], ["square", "#ffd94d"],
       ["triangle", "#ff9ecb"], ["square", "#7ecbff"], ["hexagon", "#b79cff"],
       ["square", "#ff9ecb"], ["circle", "#7ecbff"], ["square", "#b79cff"]],
      "square", 5,
      "Find all the squares! Squares are building blocks!",
      "You found five squares! Let's build!"
    );
  }
  if (stage === 1) {
    countSidesStage("square", [[10, 10], [90, 10], [90, 90], [10, 90]], "#8ff0c8",
      "Count the sides of the square! Tap the glowing corners!",
      "Four! A square has FOUR sides \u2014 and they are all the same!");
  }
  if (stage === 2) {
    speak("Drag the square blocks, and build a home for the baby dino!", true);
    dragStage(
      [{ x: 38, y: 28 }, { x: 62, y: 28 }, { x: 38, y: 54 }, { x: 62, y: 54 }],
      [{ x: 16, y: 86 }, { x: 38, y: 88 }, { x: 62, y: 88 }, { x: 84, y: 86 }],
      "square-slot",
      () => shapeDiv("square", "#ffd94d", 88),
      "The baby dino's house is built! Squares stack to build ANYTHING!"
    );
    setTimeout(() => {
      const wrap = area.querySelector(".drag-area");
      if (wrap) {
        const s = document.createElement("span");
        s.textContent = "\uD83E\uDD96";
        s.style.cssText = "position:absolute;font-size:2.6em;left:47%;top:2%;";
        wrap.appendChild(s);
      }
    }, 60);
  }
  if (stage === 3) {
    speak("The baby dino is hungry! Feed him FOUR leaves!", true);
    const dino = document.createElement("div");
    dino.style.cssText = "font-size:4.2em;transition:transform .3s ease;";
    dino.textContent = "\uD83E\uDD96";
    area.appendChild(dino);
    const big = document.createElement("div");
    big.className = "big-number";
    area.appendChild(big);
    const grid = document.createElement("div");
    grid.className = "shape-grid";
    let count = 0;
    for (let i = 0; i < 4; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "star-btn";
      b.textContent = "\uD83C\uDF3F";
      b.addEventListener("click", () => {
        if (b.classList.contains("lit")) return;
        b.classList.add("lit");
        count += 1;
        big.textContent = count;
        dino.style.transform = `scale(${1 + count * 0.13})`;
        chime(count + 1);
        if (count >= 4) { speak("Four leaves! Yummy! The dino is happy and full!"); setTimeout(nextStage, 1300); }
        else speak(NUM[count] + "!");
      });
      grid.appendChild(b);
    }
    area.appendChild(grid);
  }
}

// ===== SPIRAL SHELL BEACH =====
function spiralStage(stage) {
  const area = $("stageArea");
  if (stage === 0) {
    speak("Find all the spirals! Spirals swirl round and round!", true);
    const names = { "\uD83D\uDC1A": "shell", "\uD83E\uDD80": "crab", "\u2B50": "star" };
    const items = ["\uD83C\uDF00", "\uD83D\uDC1A", "\uD83C\uDF00", "\uD83E\uDD80", "\u2B50",
                   "\uD83C\uDF00", "\uD83D\uDC1A", "\uD83C\uDF00", "\uD83E\uDD80", "\uD83C\uDF00"];
    let found = 0;
    const grid = document.createElement("div");
    grid.className = "shape-grid";
    items.forEach(emoji => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "shape-btn";
      b.style.fontSize = "3em";
      b.textContent = emoji;
      b.addEventListener("click", () => {
        if (emoji === "\uD83C\uDF00") {
          if (b.classList.contains("found")) return;
          found += 1;
          b.classList.add("found");
          b.textContent = "\u2728";
          chime(found + 1);
          if (found >= 5) { speak("You found five spirals! Swirly hero!"); setTimeout(nextStage, 1100); }
          else speak("Spiral!");
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak("That's a " + (names[emoji] || "treasure") + "!");
        }
      });
      grid.appendChild(b);
    });
    area.appendChild(grid);
  }
  if (stage === 1) {
    speak("Pattern magic! What comes next?", true);
    const patterns = [
      { seq: ["\u2B50", "\uD83D\uDC1A", "\u2B50", "\uD83D\uDC1A", "\u2B50"], answer: "\uD83D\uDC1A",
        options: ["\uD83D\uDC1A", "\uD83E\uDD80", "\uD83C\uDF19"], cheer: "Yes! Star, shell, star, shell \u2014 the pattern repeats!" },
      { seq: ["\uD83D\uDD3A", "\uD83D\uDD35", "\uD83D\uDD3A", "\uD83D\uDD35", "\uD83D\uDD3A"], answer: "\uD83D\uDD35",
        options: ["\u2B50", "\uD83D\uDD35", "\uD83D\uDD3A"], cheer: "Yes! Triangle, circle, triangle, circle \u2014 pattern power!" }
    ];
    let idx = 0;
    function renderPattern() {
      area.innerHTML = "";
      const pat = patterns[idx];
      const row = document.createElement("div");
      row.className = "shape-grid";
      row.style.fontSize = "2.6em";
      pat.seq.forEach(e => {
        const s = document.createElement("span");
        s.textContent = e;
        row.appendChild(s);
      });
      const q = document.createElement("span");
      q.textContent = "\u2753";
      q.id = "patternQ";
      row.appendChild(q);
      area.appendChild(row);
      const opts = document.createElement("div");
      opts.className = "shape-grid";
      pat.options.forEach(e => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "shape-btn";
        b.style.fontSize = "2.6em";
        b.textContent = e;
        b.addEventListener("click", () => {
          if (e === pat.answer) {
            q.textContent = e;
            fanfare();
            idx += 1;
            if (idx >= patterns.length) { speak(pat.cheer + " You finished ALL the patterns!"); setTimeout(nextStage, 1400); }
            else { speak(pat.cheer + " One more pattern!"); setTimeout(renderPattern, 1300); }
          } else {
            b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
            speak("Look at the pattern again, hero!");
          }
        });
        opts.appendChild(b);
      });
      area.appendChild(opts);
    }
    renderPattern();
  }
  if (stage === 2) {
    speak("Drag the shells onto the spiral path!", true);
    dragStage(
      [{ x: 28, y: 28, label: "\uD83C\uDF00" }, { x: 56, y: 20, label: "\uD83C\uDF00" }, { x: 72, y: 46, label: "\uD83C\uDF00" }],
      [{ x: 26, y: 82 }, { x: 52, y: 88 }, { x: 78, y: 80 }],
      "circle-slot", "\uD83D\uDC1A",
      "You followed the spiral! Spirals hide in shells, sunflowers \u2014 and even galaxies!"
    );
  }
  if (stage === 3) {
    wordStage("SHELL", [["SUN", "\u2600\uFE0F"], ["SHELL", "\uD83D\uDC1A"], ["EGG", "\uD83E\uDD5A"]],
      "Find the word: SHELL!",
      "Shell! S, H, E, L, L \u2014 that spells SHELL!");
  }
}

// ===== THE GREAT FLOWER (finale) =====
function flowerStage(stage) {
  const area = $("stageArea");
  speak("The Great Flower! Tap the circles, and watch them bloom!", true);
  const wrap = document.createElement("div");
  wrap.className = "flower-stage";
  const spots = [[50, 50]];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    spots.push([50 + 26 * Math.cos(a), 50 + 26 * Math.sin(a)]);
  }
  let lit = 0;
  spots.forEach(([x, y], i) => {
    const c = document.createElement("div");
    c.className = "flower-petal";
    c.style.left = x + "%";
    c.style.top = y + "%";
    c.style.zIndex = i === 0 ? 3 : 2;
    c.addEventListener("click", () => {
      if (c.classList.contains("lit")) return;
      c.classList.add("lit");
      lit += 1;
      chime(lit + 1);
      if (lit >= 7) {
        fanfare();
        speak("Seven circles! The Flower of Life is BLOOMING!");
        setTimeout(nextStage, 1700);
      } else speak(NUM[lit] + "!");
    });
    wrap.appendChild(c);
  });
  area.appendChild(wrap);
}



// ===== DISCOVERY GARDEN (free explore — tap everything, learn everything) =====
const DISCOVER = [
  { e: "\uD83C\uDF15", n: "Moon", facts: ["The Moon is round like a circle!", "The Moon does not make its own light \u2014 the Sun lights it up!", "People have walked on the Moon!"] },
  { e: "\u2600\uFE0F", n: "Sun", facts: ["The Sun is a STAR, not a planet!", "The Sun is SO big, a million Earths could fit inside!", "Sunlight takes 8 minutes to reach us!"] },
  { e: "\uD83E\uDE90", n: "Saturn", facts: ["Saturn's rings are made of ice and rock!", "Saturn could FLOAT in a giant bathtub!", "Saturn has more moons than any other planet!"] },
  { e: "\uD83D\uDE80", n: "Rocket", facts: ["Rockets count down: 5, 4, 3, 2, 1 \u2014 blast off!", "The first rocket to the Moon was called Apollo 11!", "Astronauts float inside their rocket \u2014 no gravity!"] },
  { e: "\uD83D\uDC1D", n: "Bee", facts: ["Bees build hexagons \u2014 shapes with six sides!", "A bee visits about fifty flowers on one trip!", "Bees tell their friends where flowers are by DANCING!"] },
  { e: "\u2B21", n: "Hexagon", facts: ["A hexagon has SIX sides!", "Hexagons fit together with NO gaps!", "Snowflakes are tiny hexagons!"] },
  { e: "\uD83D\uDD3A", n: "Triangle", facts: ["Triangles are the STRONGEST shape!", "A triangle has 3 sides and 3 corners!", "Mountains and bridges wear triangle shapes!"] },
  { e: "\uD83C\uDF00", n: "Spiral", facts: ["Spirals hide inside shells!", "Sunflowers grow their seeds in spirals!", "Our whole GALAXY is a giant spiral of stars!"] },
  { e: "\uD83E\uDD96", n: "Dino", facts: ["Some dinos were as long as THREE buses!", "Birds are the dinos' living cousins!", "The T-Rex had teeth as big as bananas!"] },
  { e: "\uD83D\uDC38", n: "Frog", facts: ["Frogs start life as tadpoles!", "A frog's eyes help it swallow!", "Some frogs can jump 20 times their own length!"] },
  { e: "\uD83C\uDF38", n: "Flower", facts: ["Circles holding hands can make a flower!", "Flowers feed the bees, and bees help flowers grow!", "The biggest flower in the world is as wide as a car tire!"] },
  { e: "\uD83D\uDC09", n: "Ember", facts: ["I am Ember, your dragon guide!", "In stories, dragons guard treasure \u2014 I guard YOUR garden!", "Tell someone a fact you learned today, hero!"] },
  { e: "\uD83C\uDF0C", n: "Milky Way", facts: ["Our galaxy is called the Milky Way!", "The Milky Way is a giant SPIRAL of stars!", "There are more stars in space than grains of sand on all the beaches!"] },
  { e: "\u2604\uFE0F", n: "Comet", facts: ["Comets are giant dirty snowballs in space!", "A comet's tail always points AWAY from the Sun!", "Halley's Comet comes back to visit every 76 years!"] },
  { e: "\uD83D\uDEF0\uFE0F", n: "Space Station", facts: ["Astronauts LIVE on the International Space Station!", "The Space Station flies around Earth in only 90 minutes!", "From the Space Station, astronauts see 16 sunrises every day!"] },
  { e: "\uD83E\uDDD1\u200D\uD83D\uDE80", n: "Astronaut", facts: ["Astronauts float in space \u2014 there is no up or down!", "NASA is training astronauts to go back to the Moon!", "A footprint on the Moon can stay there for millions of years!"] },
  { e: "\u26AA", n: "Mercury", facts: ["Mercury is the CLOSEST planet to the Sun!", "A year on Mercury is only 88 days long!", "Mercury is covered in craters, like the Moon!"] },
  { e: "\uD83D\uDFE1", n: "Venus", facts: ["Venus is the HOTTEST planet \u2014 its thick clouds trap the heat!", "Venus spins BACKWARDS compared to most planets!", "Venus is the brightest planet in our sky \u2014 the Morning Star!"] },
  { e: "\uD83C\uDF0D", n: "Earth", facts: ["Earth is the only planet with life that we know of!", "Most of Earth is covered in water \u2014 that's why it looks blue!", "Earth is our home. Taking care of it is a hero's job!"] },
  { e: "\uD83D\uDD34", n: "Mars", facts: ["Mars is red because its dust is rusty, like old iron!", "Mars has the tallest volcano in the solar system!", "Real robot rovers are driving on Mars RIGHT NOW!"] },
  { e: "\uD83D\uDFE0", n: "Jupiter", facts: ["Jupiter is the BIGGEST planet \u2014 more than a thousand Earths could fit inside!", "Jupiter's Great Red Spot is a storm bigger than Earth!", "Jupiter has more than 90 moons!"] },
  { e: "\uD83C\uDF0A", n: "Neptune", facts: ["Neptune is the FARTHEST planet from the Sun!", "Neptune has the fastest winds anywhere \u2014 faster than a hurricane!", "Neptune is a deep, beautiful blue!"] },
  { e: "\uD83D\uDC18", n: "Elephant", facts: ["Elephants are the biggest animals that live on land!", "Elephants talk in rumbles so deep and low that we can barely hear them!", "An elephant's trunk can pick up a single tiny leaf!"] },
  { e: "\uD83E\uDD89", n: "Owl", facts: ["An owl can turn its head almost ALL the way around!", "Owls fly almost silently \u2014 their feathers are soft as whispers!", "An owl's eyes cannot move, so its whole head turns instead!"] },
  { e: "\uD83D\uDC19", n: "Octopus", facts: ["An octopus has THREE hearts!", "An octopus has BLUE blood!", "An octopus can change color to hide \u2014 and squeeze through tiny holes!"] },
  { e: "\uD83D\uDC27", n: "Penguin", facts: ["Penguins are birds that swim instead of fly!", "Emperor penguin DADS keep the egg warm on their feet all winter!", "Penguins love to slide on their bellies \u2014 it's called tobogganing!"] },
  { e: "\uD83D\uDC0B", n: "Whale", facts: ["The blue whale is the biggest animal that has EVER lived \u2014 bigger than any dinosaur!", "Whales sing songs that can travel for miles under the sea!", "Whales breathe air, just like you \u2014 they must come up to take a breath!"] },
  { e: "\uD83E\uDD8B", n: "Butterfly", facts: ["A butterfly tastes with its FEET!", "Every butterfly begins life as a tiny caterpillar!", "A butterfly's wings are covered in tiny, tiny scales!"] },
  { e: "\uD83D\uDC22", n: "Turtle", facts: ["Some turtles live for more than 100 years!", "Sea turtles find their way across whole oceans and return to the beach where they were born!", "A turtle's shell is part of its skeleton \u2014 it can feel when you touch it!"] },
  { e: "\uD83D\uDC3C", n: "Panda", facts: ["Pandas spend almost all day eating bamboo!", "A newborn panda is tiny \u2014 about the size of a stick of butter!", "Pandas have a special thumb just for holding bamboo!"] }
];

function loadFacts() {
  try {
    let raw = localStorage.getItem(factKey());
    // One-time migration: Klaus's original discoveries move into his profile.
    if (!raw && playerId === "klaus") raw = localStorage.getItem("klausaiyanFacts");
    return new Set(JSON.parse(raw) || []);
  } catch (e) { return new Set(); }
}
function saveFacts() {
  try { localStorage.setItem(factKey(), JSON.stringify([...discoveredFacts])); } catch (e) {}
}
let discoveredFacts = loadFacts();

function openDiscover() {
  show("screenDiscover");
  const grid = $("discoverGrid");
  grid.innerHTML = "";
  $("discoverCount").textContent = `\u2B50 Facts discovered: ${discoveredFacts.size} of ${DISCOVER.length}`;
  DISCOVER.forEach(item => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "discover-btn" + (discoveredFacts.has(item.n) ? " found" : "");
    b.innerHTML = `<span class="d-emoji">${item.e}</span><span class="d-name">${item.n}</span>`;
    let idx = 0;
    b.addEventListener("click", () => {
      chime(4);
      speak(item.facts[idx % item.facts.length]);
      idx += 1;
      if (!discoveredFacts.has(item.n)) {
        discoveredFacts.add(item.n);
        saveFacts();
        b.classList.add("found");
        $("discoverCount").textContent = `\u2B50 Facts discovered: ${discoveredFacts.size} of ${DISCOVER.length}`;
      }
      for (let i = 0; i < 5; i++) {
        const s = document.createElement("span");
        s.className = "sparkle";
        s.textContent = "\u2728";
        s.style.left = (10 + Math.random() * 80) + "%";
        s.style.top = (10 + Math.random() * 60) + "%";
        $("screenDiscover").appendChild(s);
        setTimeout(() => s.remove(), 1000);
      }
    });
    grid.appendChild(b);
  });
  speak("Explore, hero! Tap anything, and learn its secret!");
}

// ===== MATCH QUEST =====
function matchStage(stage) {
  const area = $("stageArea");

  if (stage === 0) {
    speak("Match each shape to its SHADOW! Tap a shape, then tap its shadow!", true);
    const pieces = [
      { type: "triangle", color: "#ff9ecb" },
      { type: "circle", color: "#7ecbff" },
      { type: "hexagon", color: "#ffd94d" }
    ];
    const shadowOrder = ["hexagon", "circle", "triangle"];
    let selected = null, matched = 0;

    const shadowRow = document.createElement("div");
    shadowRow.className = "shape-grid";
    const slots = shadowOrder.map(t => {
      const s = document.createElement("button");
      s.type = "button";
      s.className = "shape-btn";
      s.dataset.type = t;
      const sh = shapeDiv(t, "#0d0820");
      sh.classList.add("shadow-shape");
      s.appendChild(sh);
      s.addEventListener("click", () => {
        if (s.classList.contains("found")) return;
        if (!selected) { speak("Pick a colored shape first!"); return; }
        if (s.dataset.type === selected.type) {
          sh.style.background = selected.color;
          s.classList.add("found");
          selected.btn.classList.add("found");
          selected.btn.classList.remove("selected");
          selected.btn.innerHTML = "\u2B50";
          selected.btn.style.fontSize = "3em";
          const tname = selected.type;
          selected = null;
          matched += 1;
          chime(matched + 3);
          if (matched >= 3) { speak("You matched ALL the shadows!"); setTimeout(nextStage, 1200); }
          else speak("You matched the " + tname + "!");
        } else {
          s.classList.remove("wobble"); void s.offsetWidth; s.classList.add("wobble");
          speak("That's the " + s.dataset.type + " shadow. Find the " + selected.type + " shadow!");
        }
      });
      shadowRow.appendChild(s);
      return s;
    });
    area.appendChild(shadowRow);

    const pieceRow = document.createElement("div");
    pieceRow.className = "shape-grid";
    pieces.forEach(pc => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "shape-btn";
      b.appendChild(shapeDiv(pc.type, pc.color));
      b.addEventListener("click", () => {
        if (b.classList.contains("found")) return;
        pieceRow.querySelectorAll(".shape-btn").forEach(x => x.classList.remove("selected"));
        b.classList.add("selected");
        selected = { type: pc.type, color: pc.color, btn: b };
        chime(2);
        speak(pc.type.charAt(0).toUpperCase() + pc.type.slice(1) + "! Now find its shadow!");
      });
      pieceRow.appendChild(b);
    });
    area.appendChild(pieceRow);
  }

  if (stage === 1) {
    const rounds = [
      { n: 4, groups: [3, 4, 6] },
      { n: 6, groups: [5, 6, 4] },
      { n: 3, groups: [2, 3, 5] }
    ];
    let r = 0;
    function renderRound() {
      if (r >= rounds.length) return;
      area.innerHTML = "";
      const target = rounds[r];
      speak("Match the number! Find the group with " + NUM[target.n].toUpperCase() + " stars!", true);
      const big = document.createElement("div");
      big.className = "big-number";
      big.textContent = target.n;
      area.appendChild(big);
      const row = document.createElement("div");
      row.className = "shape-grid";
      target.groups.forEach(g => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "group-btn";
        b.textContent = "\u2B50".repeat(g);
        b.addEventListener("click", () => {
          if (g === target.n) {
            fanfare();
            r += 1;
            if (r >= rounds.length) { speak("You matched ALL the numbers! Counting hero!"); setTimeout(nextStage, 1400); }
            else { speak("Yes! " + NUM[g] + " stars!"); setTimeout(renderRound, 1200); }
          } else {
            b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
            speak("Count those stars out loud! Find " + target.n + "!");
          }
        });
        row.appendChild(b);
      });
      area.appendChild(row);
    }
    renderRound();
  }

  if (stage === 2) {
    const targets = [["\uD83C\uDF19", "MOON"], ["\uD83D\uDC1D", "BEE"], ["\u2600\uFE0F", "SUN"]];
    const allWords = ["MOON", "BEE", "SUN", "EGG"];
    let r = 0;
    function renderTarget() {
      area.innerHTML = "";
      const [emoji, word] = targets[r];
      speak("Read the word! Find the word that matches the picture: " + word + "!", true);
      const big = document.createElement("div");
      big.style.fontSize = "4.4em";
      big.textContent = emoji;
      area.appendChild(big);
      const wrap = document.createElement("div");
      wrap.className = "word-cards";
      allWords.forEach(w => {
        const c = document.createElement("button");
        c.type = "button";
        c.className = "word-card";
        c.innerHTML = `<span class="wc-word">${w}</span>`;
        c.addEventListener("click", () => {
          if (w === word) {
            c.classList.add("right");
            fanfare();
            r += 1;
            if (r >= targets.length) { speak("You READ the words and matched them ALL!"); setTimeout(nextStage, 1400); }
            else { speak("Yes! That says " + word + "!"); setTimeout(renderTarget, 1200); }
          } else {
            c.classList.remove("wobble"); void c.offsetWidth; c.classList.add("wobble");
            speak("That word is " + w + ". Find " + word + "!");
          }
        });
        wrap.appendChild(c);
      });
      area.appendChild(wrap);
    }
    renderTarget();
  }

  if (stage === 3) {
    const targets = [
      { type: "triangle", color: "#ff9ecb", word: "TRIANGLE" },
      { type: "square", color: "#8ff0c8", word: "SQUARE" },
      { type: "circle", color: "#7ecbff", word: "CIRCLE" }
    ];
    const words = ["TRIANGLE", "SQUARE", "CIRCLE", "HEXAGON"];
    let r = 0;
    function renderShapeWord() {
      area.innerHTML = "";
      const t = targets[r];
      speak("What is this shape's name? Tap the right word!", true);
      const bigWrap = document.createElement("div");
      bigWrap.style.cssText = "display:grid;place-items:center;padding:8px 0;";
      bigWrap.appendChild(shapeDiv(t.type, t.color, 118));
      area.appendChild(bigWrap);
      const wrap = document.createElement("div");
      wrap.className = "word-cards";
      words.forEach(w => {
        const c = document.createElement("button");
        c.type = "button";
        c.className = "word-card";
        c.innerHTML = `<span class="wc-word">${w}</span>`;
        c.addEventListener("click", () => {
          if (w === t.word) {
            c.classList.add("right");
            fanfare();
            r += 1;
            if (r >= targets.length) { speak("You can READ the shape names! Geometry reader!"); setTimeout(nextStage, 1400); }
            else { speak("Yes! That says " + w + "!"); setTimeout(renderShapeWord, 1200); }
          } else {
            c.classList.remove("wobble"); void c.offsetWidth; c.classList.add("wobble");
            speak("That word is " + w + ". Sound out the shape's name!");
          }
        });
        wrap.appendChild(c);
      });
      area.appendChild(wrap);
    }
    renderShapeWord();
  }

  if (stage === 4) {
    countSidesStage("octagon", [[32, 6], [68, 6], [94, 32], [94, 68], [68, 94], [32, 94], [6, 68], [6, 32]], "#ff6b57",
      "Shape Detective! This is an OCTAGON — like a stop sign! Count its sides!",
      "Eight! An octagon has EIGHT sides!");
  }
}

// ===== FROG CODING POND =====
function frogStage(stage) {
  const area = $("stageArea");
  const cfg = stage === 0
    ? { cells: 5, target: 4, big: false,
        intro: "You are the CODER! Tap HOP to write code for the frog. Then press GO!" }
    : stage === 1
    ? { cells: 7, target: 6, big: true,
        intro: "A bigger pond! Use HOP and BIG JUMP to code the frog to the fly!" }
    : stage === 2
    ? { cells: 9, target: 8, big: true,
        intro: "The LONG pond! Plan your code like a real coder, then press GO!" }
    : { cells: 9, target: 8, big: true, loop: true,
        intro: "Loop Lagoon! The LOOP block says DO THAT AGAIN. Coders use loops to repeat!" };
  speak(cfg.intro, true);

  const STEP = 66;
  const pond = document.createElement("div");
  pond.className = "frog-pond";
  pond.style.width = (cfg.cells * STEP + 6) + "px";
  for (let i = 0; i < cfg.cells; i++) {
    const cell = document.createElement("div");
    cell.className = "pond-cell";
    cell.style.left = (i * STEP + 3) + "px";
    cell.textContent = i === cfg.target ? "\uD83E\uDEB0" : "\uD83E\uDEB7";
    pond.appendChild(cell);
  }
  const frog = document.createElement("div");
  frog.className = "frog";
  frog.textContent = "\uD83D\uDC38";
  frog.style.left = "3px";
  pond.appendChild(frog);
  area.appendChild(pond);

  const codeRow = document.createElement("div");
  codeRow.className = "code-row";
  codeRow.textContent = "\u2026";
  area.appendChild(codeRow);

  const btnRow = document.createElement("div");
  btnRow.className = "cmd-row";
  area.appendChild(btnRow);

  let code = [];
  let running = false;
  const ICONS = { hop: "\u27A1\uFE0F", big: "\u23EB", spin: "\uD83C\uDF00", loop: "\uD83D\uDD01" };

  function renderCode() {
    codeRow.textContent = code.length ? code.map(c => ICONS[c]).join(" ") : "\u2026";
  }
  function addCmd(c) {
    if (running) return;
    code.push(c);
    chime(3);
    renderCode();
  }
  function makeBtn(label, cls, fn) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cmd-btn " + cls;
    b.textContent = label;
    b.addEventListener("click", fn);
    btnRow.appendChild(b);
    return b;
  }
  makeBtn("\u27A1\uFE0F Hop", "", () => addCmd("hop"));
  if (cfg.big) makeBtn("\u23EB Big Jump", "", () => addCmd("big"));
  makeBtn("\uD83C\uDF00 Spin", "", () => addCmd("spin"));
  if (cfg.loop) makeBtn("\uD83D\uDD01 Loop", "", () => addCmd("loop"));
  makeBtn("\u21BA Clear", "", () => { if (!running) { code = []; renderCode(); tone(300, 0, 0.12); } });
  makeBtn("\u25B6\uFE0F GO!", "cmd-go", () => {
    if (running || code.length === 0) { if (!running) speak("Write some code first, coder! Tap HOP!"); return; }
    running = true;
    const expanded = [];
    code.forEach(c => {
      if (c === "loop") {
        const last = [...expanded].reverse().find(x => x === "hop" || x === "big");
        if (last) expanded.push(last);
      } else expanded.push(c);
    });
    let pos = 0;
    frog.style.left = "3px";
    let i = 0;
    speak("Running your code!");
    function step() {
      if (i >= expanded.length) {
        running = false;
        if (pos === cfg.target) {
          fanfare();
          speak("YOU DID IT! You coded the frog right to the fly! Coding is telling the computer what to do!");
          setTimeout(nextStage, 1800);
        } else if (pos < cfg.target) {
          speak("The frog stopped at pad " + pos + ". The fly is at pad " + cfg.target + ". Add more code!");
        } else {
          frog.textContent = "\uD83D\uDCA6";
          speak("SPLASH! Too many hops! Clear the code and try again, coder!");
          setTimeout(() => { frog.textContent = "\uD83D\uDC38"; frog.style.left = "3px"; code = []; renderCode(); }, 1300);
        }
        return;
      }
      const c = expanded[i];
      i += 1;
      if (c === "hop") pos += 1;
      if (c === "big") pos += 2;
      if (c === "spin") {
        frog.classList.remove("spin"); void frog.offsetWidth; frog.classList.add("spin");
        chime(5);
      } else {
        frog.style.left = (pos * STEP + 3) + "px";
        chime(2);
      }
      setTimeout(step, 620);
    }
    setTimeout(step, 350);
  });
}



// ===== Drum & beat audio =====
let noiseBuffer = null;
let seqTimer = null;
function stopSeq() { if (seqTimer) { clearInterval(seqTimer); seqTimer = null; } }
function audioReady() {
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}
function drumKick() {
  if (muted) return;
  try {
    const ctx = audioReady();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.22);
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.connect(g).connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.3);
  } catch (e) {}
}
function noiseHit(freq, type, dur, vol, when = 0) {
  if (muted) return;
  try {
    const ctx = audioReady();
    if (!noiseBuffer) {
      noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    const t = ctx.currentTime + when;
    const srcN = ctx.createBufferSource();
    srcN.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    srcN.connect(filter).connect(g).connect(ctx.destination);
    srcN.start(t); srcN.stop(t + dur + 0.05);
  } catch (e) {}
}
function drumSnare() { noiseHit(1800, "bandpass", 0.14, 0.28); }
function drumHat() { noiseHit(7500, "highpass", 0.05, 0.14); }
function drumClap() { noiseHit(1100, "bandpass", 0.09, 0.25); noiseHit(1100, "bandpass", 0.12, 0.22, 0.05); }

// ===== KEYBOARD HERO =====
function keysStage(stage) {
  const area = $("stageArea");
  const cfg = stage === 0
    ? { word: "KLAUS", keys: ["K", "M", "L", "B", "A", "T", "U", "S"],
        intro: "Keyboard Hero! Type your name! Tap the keys: K, L, A, U, S!" }
    : stage === 1
    ? { word: "MOON", keys: ["M", "A", "O", "S", "N", "E"],
        intro: "Type the word MOON, computer hero!" }
    : { word: "CODE", keys: ["C", "A", "O", "S", "D", "T", "E"],
        intro: "Type CODE \u2014 the secret word of computer heroes!" };
  speak(cfg.intro, true);

  const wordRow = document.createElement("div");
  wordRow.className = "spell-word";
  const letterSpans = cfg.word.split("").map(ch => {
    const s = document.createElement("span");
    s.className = "spell-letter";
    s.textContent = ch;
    wordRow.appendChild(s);
    return s;
  });
  area.appendChild(wordRow);

  const keyRow = document.createElement("div");
  keyRow.className = "key-row";
  let expected = 0;
  cfg.keys.forEach(letter => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "key-btn";
    b.textContent = letter;
    b.addEventListener("click", () => {
      if (expected >= cfg.word.length) return;
      if (letter === cfg.word[expected]) {
        letterSpans[expected].classList.add("lit");
        expected += 1;
        chime(expected + 2);
        if (expected >= cfg.word.length) {
          fanfare();
          speak("You typed " + cfg.word + "! Computer hero!");
          setTimeout(nextStage, 1500);
        } else speak("Letter " + letter + "! Next: " + cfg.word[expected] + "!");
      } else {
        b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
        speak("That's " + letter + ". Find " + cfg.word[expected] + "!");
      }
    });
    keyRow.appendChild(b);
  });
  area.appendChild(keyRow);
}

// ===== DJ QUEST =====
function djStage(stage) {
  const area = $("stageArea");

  if (stage === 0) {
    speak("Copy the Beat! Press the speaker to hear my beat. Then tap the same pads!", true);
    const pads = [
      { e: "\u2B50", note: 0, color: "#ffd94d" },
      { e: "\uD83C\uDF19", note: 2, color: "#7ecbff" },
      { e: "\uD83C\uDF6F", note: 4, color: "#ffb84d" },
      { e: "\uD83D\uDE80", note: 6, color: "#ff9ecb" }
    ];
    const rounds = [[0, 1, 2], [2, 1, 3, 0], [0, 2, 3, 2, 1]];
    let round = 0, input = [], playing = false;

    const grid = document.createElement("div");
    grid.className = "pad-grid";
    const padEls = pads.map((pd, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "dj-pad";
      b.style.background = `radial-gradient(circle at 35% 30%, #ffffff66, ${pd.color})`;
      b.textContent = pd.e;
      b.addEventListener("click", () => {
        if (playing) return;
        flashPad(b);
        tone(SCALE[pd.note], 0, 0.4);
        if (input.length >= rounds[round].length) return;
        input.push(i);
        const want = rounds[round];
        if (input[input.length - 1] !== want[input.length - 1]) {
          input = [];
          speak("Oops! Listen again, DJ!");
          setTimeout(playSeq, 900);
          return;
        }
        if (input.length === want.length) {
          input = [];
          round += 1;
          fanfare();
          if (round >= rounds.length) { speak("You copied ALL the beats! DJ ears!"); setTimeout(nextStage, 1500); }
          else { speak("Beat copied! Here comes a longer one!"); setTimeout(playSeq, 1300); }
        }
      });
      grid.appendChild(b);
      return b;
    });
    area.appendChild(grid);

    const hear = document.createElement("button");
    hear.type = "button";
    hear.className = "cmd-btn cmd-go";
    hear.textContent = "\uD83D\uDD0A Hear the Beat";
    hear.addEventListener("click", playSeq);
    area.appendChild(hear);

    function flashPad(el) {
      el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
    }
    function playSeq() {
      if (playing) return;
      playing = true;
      input = [];
      const want = rounds[round];
      want.forEach((padIdx, i) => {
        setTimeout(() => {
          flashPad(padEls[padIdx]);
          tone(SCALE[pads[padIdx].note], 0, 0.4);
          if (i === want.length - 1) setTimeout(() => { playing = false; }, 350);
        }, 420 * (i + 1));
      });
    }
    setTimeout(playSeq, 700);
  }

  if (stage === 1) {
    speak("Finish the melody! What note comes next?", true);
    const pats = [
      { seq: ["\uD83C\uDFB5", "\uD83C\uDFB6", "\uD83C\uDFB5", "\uD83C\uDFB6", "\uD83C\uDFB5"], answer: "\uD83C\uDFB6",
        options: ["\uD83C\uDFB6", "\uD83E\uDD41", "\uD83D\uDD14"], notes: [0, 2, 0, 2, 0], answerNote: 2 },
      { seq: ["\uD83E\uDD41", "\uD83E\uDD41", "\uD83D\uDD14", "\uD83E\uDD41", "\uD83E\uDD41"], answer: "\uD83D\uDD14",
        options: ["\u2B50", "\uD83D\uDD14", "\uD83C\uDFB5"], notes: [4, 4, 6, 4, 4], answerNote: 6 }
    ];
    let idx = 0;
    function renderPat() {
      area.innerHTML = "";
      const pat = pats[idx];
      const row = document.createElement("div");
      row.className = "shape-grid";
      row.style.fontSize = "2.4em";
      pat.seq.forEach(e => {
        const s = document.createElement("span");
        s.textContent = e;
        row.appendChild(s);
      });
      const q = document.createElement("span");
      q.textContent = "\u2753";
      row.appendChild(q);
      area.appendChild(row);
      pat.notes.forEach((n, i) => setTimeout(() => tone(SCALE[n], 0, 0.3), 260 * i));
      const opts = document.createElement("div");
      opts.className = "shape-grid";
      pat.options.forEach(e => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "shape-btn";
        b.style.fontSize = "2.4em";
        b.textContent = e;
        b.addEventListener("click", () => {
          if (e === pat.answer) {
            q.textContent = e;
            tone(SCALE[pat.answerNote], 0, 0.45);
            fanfare();
            idx += 1;
            if (idx >= pats.length) { speak("You finished ALL the melodies!"); setTimeout(nextStage, 1500); }
            else { speak("Yes! The melody repeats! One more!"); setTimeout(renderPat, 1400); }
          } else {
            b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
            speak("Sing the pattern in your head, DJ!");
          }
        });
        opts.appendChild(b);
      });
      area.appendChild(opts);
    }
    renderPat();
  }

  if (stage === 2) {
    speak("DJ Studio! Tap the pads. Build a beat on the beat machine. You are the DJ!", true);
    const named = new Set();
    function nameOnce(name, fact) { if (!named.has(name)) { named.add(name); speak(fact); } }

    const padsWrap = document.createElement("div");
    padsWrap.className = "pad-grid";
    const drumPads = [
      { label: "Kick", e: "\uD83E\uDD41", color: "#ff6b57", fn: drumKick, fact: "Kick drum! It goes BOOM, like a heartbeat!" },
      { label: "Snare", e: "\u26AA", color: "#e8e4da", fn: drumSnare, fact: "Snare drum! It goes SNAP!" },
      { label: "Hat", e: "\uD83D\uDFE1", color: "#ffd94d", fn: drumHat, fact: "Hi-hat! It goes tiss, tiss, tiss!" },
      { label: "Clap", e: "\uD83D\uDC4F", color: "#ff9ecb", fn: drumClap, fact: "Clap! Clap along, DJ!" }
    ];
    drumPads.forEach(pd => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "dj-pad labeled";
      b.style.background = `radial-gradient(circle at 35% 30%, #ffffff66, ${pd.color})`;
      b.innerHTML = `<span>${pd.e}</span><small>${pd.label}</small>`;
      b.addEventListener("click", () => {
        b.classList.remove("flash"); void b.offsetWidth; b.classList.add("flash");
        pd.fn();
        nameOnce(pd.label, pd.fact);
      });
      padsWrap.appendChild(b);
    });
    const noteNames = ["C", "D", "E", "G", "A"];
    const noteColors = ["#ff9ecb", "#ffb84d", "#ffd94d", "#8ff0c8", "#7ecbff"];
    noteNames.forEach((nm, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "dj-pad labeled";
      b.style.background = `radial-gradient(circle at 35% 30%, #ffffff66, ${noteColors[i]})`;
      b.innerHTML = `<span>\uD83C\uDFB5</span><small>${nm}</small>`;
      b.addEventListener("click", () => {
        b.classList.remove("flash"); void b.offsetWidth; b.classList.add("flash");
        tone(SCALE[i], 0, 0.45);
        nameOnce("note" + nm, "Note " + nm + "!");
      });
      padsWrap.appendChild(b);
    });
    area.appendChild(padsWrap);

    const seqWrap = document.createElement("div");
    seqWrap.className = "seq-wrap";
    const seqState = { drum: Array(8).fill(false), bell: Array(8).fill(false) };
    const cellEls = { drum: [], bell: [] };
    [["drum", "\uD83E\uDD41"], ["bell", "\uD83D\uDD14"]].forEach(([rowName, icon]) => {
      const rowEl = document.createElement("div");
      rowEl.className = "seq-row";
      const lab = document.createElement("span");
      lab.className = "seq-label";
      lab.textContent = icon;
      rowEl.appendChild(lab);
      for (let i = 0; i < 8; i++) {
        const c = document.createElement("button");
        c.type = "button";
        c.className = "seq-cell";
        c.textContent = i + 1;
        c.addEventListener("click", () => {
          seqState[rowName][i] = !seqState[rowName][i];
          c.classList.toggle("on", seqState[rowName][i]);
          if (seqState[rowName][i]) { if (rowName === "drum") drumKick(); else tone(SCALE[6], 0, 0.3); }
        });
        cellEls[rowName].push(c);
        rowEl.appendChild(c);
      }
      seqWrap.appendChild(rowEl);
    });
    area.appendChild(seqWrap);

    const controls = document.createElement("div");
    controls.className = "cmd-row";
    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "cmd-btn cmd-go";
    playBtn.textContent = "\u25B6\uFE0F Play My Beat";
    let step = 0;
    playBtn.addEventListener("click", () => {
      if (seqTimer) {
        stopSeq();
        playBtn.textContent = "\u25B6\uFE0F Play My Beat";
        document.querySelectorAll(".seq-cell.now").forEach(x => x.classList.remove("now"));
        return;
      }
      speak("Counting the beat: one, two, three, four!");
      playBtn.textContent = "\u23F9 Stop";
      seqTimer = setInterval(() => {
        document.querySelectorAll(".seq-cell.now").forEach(x => x.classList.remove("now"));
        cellEls.drum[step].classList.add("now");
        cellEls.bell[step].classList.add("now");
        if (seqState.drum[step]) drumKick();
        if (seqState.bell[step]) tone(SCALE[6], 0, 0.3);
        if (step % 2 === 0) drumHat();
        step = (step + 1) % 8;
      }, 270);
    });
    controls.appendChild(playBtn);

    const doneBtn = document.createElement("button");
    doneBtn.type = "button";
    doneBtn.className = "cmd-btn";
    doneBtn.textContent = "\uD83C\uDF89 My Song is Done!";
    doneBtn.addEventListener("click", () => {
      stopSeq();
      fanfare();
      speak("DJ Klausaiyan, everybody! What a song!");
      setTimeout(nextStage, 1300);
    });
    controls.appendChild(doneBtn);
    area.appendChild(controls);
  }

  if (stage === 3) {
    // Beat Detective: listen to a 4-beat bar, count the beats, find the bell.
    speak("Beat Detective! Listen and COUNT the beats: 1, 2, 3, 4. On which beat does the BELL ring?", true);
    const rounds = [
      { bell: 3, extra: "snare", extraBeat: 4 },
      { bell: 2, extra: "clap", extraBeat: 4 },
      { bell: 4, extra: "snare", extraBeat: 2 }
    ];
    let r = 0;
    function renderRound() {
      area.innerHTML = "";
      const dots = document.createElement("div");
      dots.className = "seq-display";
      const dotEls = [];
      for (let i = 1; i <= 4; i++) {
        const d = document.createElement("div");
        d.className = "num-chip beat-dot";
        d.textContent = i;
        dots.appendChild(d);
        dotEls.push(d);
      }
      area.appendChild(dots);
      const hear = document.createElement("button");
      hear.type = "button";
      hear.className = "cmd-btn cmd-go";
      hear.textContent = "🔊 Play the Beat";
      area.appendChild(hear);
      let playing = false;
      function playPattern() {
        if (playing) return;
        playing = true;
        const q = rounds[r];
        for (let beat = 1; beat <= 4; beat++) {
          setTimeout(() => {
            dotEls.forEach(d => d.classList.remove("revealed"));
            dotEls[beat - 1].classList.add("revealed");
            drumKick();
            if (beat === q.bell) tone(SCALE[6], 0, 0.35);
            if (beat === q.extraBeat) { if (q.extra === "snare") drumSnare(); else drumClap(); }
            if (beat === 4) setTimeout(() => { playing = false; }, 420);
          }, 560 * beat);
        }
      }
      hear.addEventListener("click", playPattern);
      const opts = document.createElement("div");
      opts.className = "shape-grid";
      [1, 2, 3, 4].forEach(n => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "group-btn num-btn";
        b.textContent = "Beat " + n;
        b.addEventListener("click", () => {
          if (n === rounds[r].bell) {
            fanfare();
            r += 1;
            if (r >= rounds.length) { speak("Beat Detective SOLVED! You counted the beats like a real musician!"); setTimeout(nextStage, 1600); }
            else { speak("YES! The bell rang on beat " + n + "! One more mystery beat!"); setTimeout(renderRound, 1400); }
          } else {
            b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
            speak("Play the beat again and count: 1, 2, 3, 4!");
          }
        });
        opts.appendChild(b);
      });
      area.appendChild(opts);
      setTimeout(playPattern, 800);
    }
    renderRound();
  }

  if (stage === 4) {
    // DJ Studio PRO: 3-row sequencer, tempo control, full scale, melody recorder, random remix.
    speak("DJ Studio PRO! Three beat rows, a whole scale of notes, and a melody recorder. Make a REAL song!", true);
    const named = new Set();
    function nameOnce(name, fact) { if (!named.has(name)) { named.add(name); speak(fact); } }

    const noteNames = ["C", "D", "E", "F", "G", "A", "B", "C"];
    const noteColors = ["#ff9ecb", "#ffb84d", "#ffd94d", "#8ff0c8", "#7ecbff", "#b79cff", "#ff8fb8", "#ffe98c"];
    const melody = [];
    const melodyRow = document.createElement("div");
    melodyRow.className = "code-row";
    melodyRow.textContent = "🎵 Your melody: tap notes to record!";
    area.appendChild(melodyRow);

    const padsWrap = document.createElement("div");
    padsWrap.className = "pad-grid";
    noteNames.forEach((nm, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "dj-pad labeled";
      b.style.background = `radial-gradient(circle at 35% 30%, #ffffff66, ${noteColors[i]})`;
      b.innerHTML = `<span>🎵</span><small>${nm}</small>`;
      b.addEventListener("click", () => {
        b.classList.remove("flash"); void b.offsetWidth; b.classList.add("flash");
        tone(SCALE[i], 0, 0.45);
        if (melody.length < 12) {
          melody.push(i);
          melodyRow.textContent = "🎵 Your melody: " + melody.map(m => noteNames[m]).join(" · ");
        }
        nameOnce("scale", "That is the C major scale — the ladder most songs climb!");
      });
      padsWrap.appendChild(b);
    });
    area.appendChild(padsWrap);

    const melControls = document.createElement("div");
    melControls.className = "cmd-row";
    const playMel = document.createElement("button");
    playMel.type = "button";
    playMel.className = "cmd-btn";
    playMel.textContent = "▶️ Play My Melody";
    playMel.addEventListener("click", () => {
      if (!melody.length) { speak("Record some notes first, DJ!"); return; }
      melody.forEach((m, i) => setTimeout(() => tone(SCALE[m], 0, 0.45), 330 * i));
      speak("Your melody! Composers write tunes exactly like this!");
    });
    const clearMel = document.createElement("button");
    clearMel.type = "button";
    clearMel.className = "cmd-btn";
    clearMel.textContent = "🧹 Clear Melody";
    clearMel.addEventListener("click", () => {
      melody.length = 0;
      melodyRow.textContent = "🎵 Your melody: tap notes to record!";
    });
    melControls.appendChild(playMel);
    melControls.appendChild(clearMel);
    area.appendChild(melControls);

    const seqWrap = document.createElement("div");
    seqWrap.className = "seq-wrap";
    const rows = [["kick", "🥁"], ["snare", "⚪"], ["bell", "🔔"]];
    const seqState = { kick: Array(8).fill(false), snare: Array(8).fill(false), bell: Array(8).fill(false) };
    const cellEls = { kick: [], snare: [], bell: [] };
    rows.forEach(([rowName, icon]) => {
      const rowEl = document.createElement("div");
      rowEl.className = "seq-row";
      const lab = document.createElement("span");
      lab.className = "seq-label";
      lab.textContent = icon;
      rowEl.appendChild(lab);
      for (let i = 0; i < 8; i++) {
        const c = document.createElement("button");
        c.type = "button";
        c.className = "seq-cell";
        c.textContent = i + 1;
        c.addEventListener("click", () => {
          seqState[rowName][i] = !seqState[rowName][i];
          c.classList.toggle("on", seqState[rowName][i]);
          if (seqState[rowName][i]) {
            if (rowName === "kick") drumKick();
            else if (rowName === "snare") drumSnare();
            else tone(SCALE[6], 0, 0.3);
          }
        });
        cellEls[rowName].push(c);
        rowEl.appendChild(c);
      }
      seqWrap.appendChild(rowEl);
    });
    area.appendChild(seqWrap);

    let tempo = 260;
    const controls = document.createElement("div");
    controls.className = "cmd-row";
    const tempoBtn = document.createElement("button");
    tempoBtn.type = "button";
    tempoBtn.className = "cmd-btn";
    tempoBtn.textContent = "🐢 Tempo: Groovy";
    const tempos = [[380, "🐌 Tempo: Slow"], [260, "🐢 Tempo: Groovy"], [170, "🐆 Tempo: FAST!"]];
    let tempoIdx = 1;
    tempoBtn.addEventListener("click", () => {
      tempoIdx = (tempoIdx + 1) % tempos.length;
      tempo = tempos[tempoIdx][0];
      tempoBtn.textContent = tempos[tempoIdx][1];
      nameOnce("tempo", "Tempo means how FAST the beat goes! Real DJs control the tempo!");
      if (seqTimer) { stopSeq(); startSeq(); }
    });
    controls.appendChild(tempoBtn);

    const remixBtn = document.createElement("button");
    remixBtn.type = "button";
    remixBtn.className = "cmd-btn";
    remixBtn.textContent = "🎲 Random Remix";
    remixBtn.addEventListener("click", () => {
      rows.forEach(([rowName]) => {
        for (let i = 0; i < 8; i++) {
          seqState[rowName][i] = Math.random() < 0.38;
          cellEls[rowName][i].classList.toggle("on", seqState[rowName][i]);
        }
      });
      seqState.kick[0] = true; cellEls.kick[0].classList.add("on");
      seqState.kick[4] = true; cellEls.kick[4].classList.add("on");
      fanfare();
      speak("Remix! The computer invented a beat — can you make it even better?");
    });
    controls.appendChild(remixBtn);

    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "cmd-btn cmd-go";
    playBtn.textContent = "▶️ Play My Beat";
    let step = 0;
    function startSeq() {
      playBtn.textContent = "⏹ Stop";
      seqTimer = setInterval(() => {
        document.querySelectorAll(".seq-cell.now").forEach(x => x.classList.remove("now"));
        rows.forEach(([rowName]) => cellEls[rowName][step].classList.add("now"));
        if (seqState.kick[step]) drumKick();
        if (seqState.snare[step]) drumSnare();
        if (seqState.bell[step]) tone(SCALE[6], 0, 0.3);
        if (step % 2 === 0) drumHat();
        step = (step + 1) % 8;
      }, tempo);
    }
    playBtn.addEventListener("click", () => {
      if (seqTimer) {
        stopSeq();
        playBtn.textContent = "▶️ Play My Beat";
        document.querySelectorAll(".seq-cell.now").forEach(x => x.classList.remove("now"));
        return;
      }
      speak("Counting the beat: one, two, three, four!");
      startSeq();
    });
    controls.appendChild(playBtn);

    const doneBtn = document.createElement("button");
    doneBtn.type = "button";
    doneBtn.className = "cmd-btn";
    doneBtn.textContent = "🎉 My Song is Done!";
    doneBtn.addEventListener("click", () => {
      stopSeq();
      fanfare();
      melody.forEach((m, i) => setTimeout(() => tone(SCALE[m], 0, 0.4), 300 * i));
      speak("DJ " + player().hero + ", everybody! A REAL song, made by YOU!");
      setTimeout(nextStage, 1400);
    });
    controls.appendChild(doneBtn);
    area.appendChild(controls);
  }
}



// ===== NUMBER NEBULA (real math) =====
function mathStage(stage) {
  const area = $("stageArea");

  function numOptions(opts, onPick) {
    const row = document.createElement("div");
    row.className = "shape-grid";
    opts.forEach(n => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "group-btn num-btn";
      b.textContent = n;
      b.addEventListener("click", () => onPick(n, b));
      row.appendChild(b);
    });
    area.appendChild(row);
  }
  function equationEl(text) {
    const eq = document.createElement("div");
    eq.className = "equation";
    eq.textContent = text;
    area.appendChild(eq);
    return eq;
  }
  function visualEl(html) {
    const v = document.createElement("div");
    v.className = "visual-row";
    v.innerHTML = html;
    area.appendChild(v);
    return v;
  }

  if (stage === 0) { // Addition
    const rounds = [
      { a: 3, b: 2, opts: [4, 5, 6] },
      { a: 4, b: 3, opts: [6, 7, 8] },
      { a: 5, b: 5, opts: [9, 10, 11] },
      { a: 6, b: 4, opts: [9, 10, 12] },
      { a: 7, b: 5, opts: [11, 12, 13] }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      const q = rounds[r], ans = q.a + q.b;
      speak(`What is ${q.a} plus ${q.b}? Count the stars!`, true);
      equationEl(`${q.a} + ${q.b} = ?`);
      visualEl(`<span>${"\u2B50".repeat(q.a)}</span> <span class="plus">+</span> <span>${"\uD83D\uDD35".repeat(q.b)}</span>`);
      numOptions(q.opts, (n, b) => {
        if (n === ans) {
          fanfare();
          r += 1;
          if (r >= rounds.length) { speak(`YES! ${q.a} plus ${q.b} equals ${ans}! Addition master!`); setTimeout(nextStage, 1500); }
          else { speak(`Yes! ${q.a} plus ${q.b} equals ${ans}!`); setTimeout(render, 1300); }
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak("Count ALL the stars and dots together!");
        }
      });
    }
    render();
  }

  if (stage === 1) { // Subtraction
    const rounds = [
      { a: 9, b: 4, opts: [4, 5, 6] },
      { a: 8, b: 3, opts: [5, 6, 4] },
      { a: 12, b: 5, opts: [6, 7, 8] },
      { a: 10, b: 6, opts: [3, 4, 5] }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      const q = rounds[r], ans = q.a - q.b;
      speak(`${q.a} take away ${q.b}. How many are left?`, true);
      equationEl(`${q.a} \u2212 ${q.b} = ?`);
      visualEl(`<span>${"\u2B50".repeat(ans)}</span> <span class="away">${"\uD83D\uDCA8".repeat(q.b)}</span>`);
      const note = document.createElement("p");
      note.className = "visual-note";
      note.textContent = "The puffs show the ones that floated away!";
      area.appendChild(note);
      numOptions(q.opts, (n, b) => {
        if (n === ans) {
          fanfare();
          r += 1;
          if (r >= rounds.length) { speak(`YES! ${q.a} take away ${q.b} leaves ${ans}! Subtraction star!`); setTimeout(nextStage, 1500); }
          else { speak(`Yes! ${q.a} take away ${q.b} leaves ${ans}!`); setTimeout(render, 1300); }
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak("Count only the stars that STAYED!");
        }
      });
    }
    render();
  }

  if (stage === 2) { // Skip counting
    const rounds = [
      { by: "twos", seq: [2, 4, 6, null, 10, 12], ans: 8, opts: [7, 8, 9] },
      { by: "fives", seq: [5, 10, 15, null, 25], ans: 20, opts: [18, 20, 22] },
      { by: "tens", seq: [10, 20, null, 40, 50], ans: 30, opts: [25, 30, 35] }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      const q = rounds[r];
      speak(`Skip counting by ${q.by}! What number is hiding?`, true);
      const row = document.createElement("div");
      row.className = "seq-display";
      q.seq.forEach(n => {
        const chip = document.createElement("span");
        chip.className = "num-chip" + (n === null ? " missing" : "");
        chip.textContent = n === null ? "?" : n;
        if (n === null) chip.id = "skipQ";
        row.appendChild(chip);
      });
      area.appendChild(row);
      numOptions(q.opts, (n, b) => {
        if (n === q.ans) {
          const chip = $("skipQ");
          if (chip) { chip.textContent = n; chip.classList.remove("missing"); chip.classList.add("revealed"); }
          fanfare();
          r += 1;
          if (r >= rounds.length) { speak("Skip counting champion! Twos, fives, and tens!"); setTimeout(nextStage, 1500); }
          else { speak(`Yes! ${n}! Keep the rhythm!`); setTimeout(render, 1400); }
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak("Say the numbers out loud and listen for the jump!");
        }
      });
    }
    render();
  }

  if (stage === 3) { // Comparing numbers
    const rounds = [
      { x: 17, y: 12 }, { x: 25, y: 31 }, { x: 48, y: 39 }, { x: 56, y: 65 }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      const q = rounds[r], big = Math.max(q.x, q.y), small = Math.min(q.x, q.y);
      speak("Which number is BIGGER? Tap it!", true);
      numOptions([q.x, q.y], (n, b) => {
        if (n === big) {
          fanfare();
          r += 1;
          if (r >= rounds.length) { speak("You can compare ANY numbers now!"); setTimeout(nextStage, 1500); }
          else { speak(`Yes! ${big} is bigger than ${small}!`); setTimeout(render, 1300); }
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak("Look at the FIRST number of each — which ten is bigger?");
        }
      });
    }
    render();
  }

  if (stage === 4) { // Word problems
    const rounds = [
      { story: "Ember has 7 gems. He gives 3 gems to Klausaiyan. How many gems does Ember have now?",
        opts: [3, 4, 5], ans: 4, cheer: "Yes! 7 take away 3 is 4!" },
      { story: "The rocket passes 5 planets in the morning and 4 more at night. How many planets did it pass in all?",
        opts: [8, 9, 10], ans: 9, cheer: "Yes! 5 plus 4 is 9 planets!" },
      { story: "Six bees are in the honeycomb. Two more bees fly in. How many bees are there now?",
        opts: [7, 8, 9], ans: 8, cheer: "Yes! 6 plus 2 is 8 bees!" }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      const q = rounds[r];
      speak("Word problem! " + q.story, true);
      const card = document.createElement("div");
      card.className = "story-card big-story";
      card.textContent = q.story;
      area.appendChild(card);
      numOptions(q.opts, (n, b) => {
        if (n === q.ans) {
          fanfare();
          r += 1;
          if (r >= rounds.length) { speak("You solved EVERY word problem! Number Nebula navigator!"); setTimeout(nextStage, 1600); }
          else { speak(q.cheer); setTimeout(render, 1400); }
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak("Think about the story — is it adding, or taking away?");
        }
      });
    }
    render();
  }
}

// ===== STORY STAR LIBRARY (real reading) =====
function readStage(stage) {
  const area = $("stageArea");

  if (stage === 0) { // Beginning blends / digraphs
    const rounds = [
      { emoji: "\uD83D\uDEA2", tail: "ip", opts: ["sh", "ch", "tr"], ans: "sh", word: "SHIP", sound: "Sh says shhh!" },
      { emoji: "\uD83E\uDE91", tail: "air", opts: ["ch", "sh", "fr"], ans: "ch", word: "CHAIR", sound: "Ch says chuh!" },
      { emoji: "\uD83C\uDF33", tail: "ee", opts: ["tr", "sh", "ch"], ans: "tr", word: "TREE", sound: "Tr says truh!" },
      { emoji: "\uD83D\uDC38", tail: "og", opts: ["fr", "tr", "sh"], ans: "fr", word: "FROG", sound: "Fr says fruh!" }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      const q = rounds[r];
      speak(`What sound does this word start with? The word is ${q.word}!`, true);
      const big = document.createElement("div");
      big.style.fontSize = "4.2em";
      big.textContent = q.emoji;
      area.appendChild(big);
      const partial = document.createElement("div");
      partial.className = "equation";
      partial.id = "blendWord";
      partial.textContent = "__" + q.tail;
      area.appendChild(partial);
      const row = document.createElement("div");
      row.className = "word-cards";
      q.opts.forEach(o => {
        const c = document.createElement("button");
        c.type = "button";
        c.className = "word-card";
        c.innerHTML = `<span class="wc-word">${o}</span>`;
        c.addEventListener("click", () => {
          if (o === q.ans) {
            $("blendWord").textContent = q.word;
            fanfare();
            r += 1;
            if (r >= rounds.length) { speak(`${q.sound} ${q.word}! You know your beginning sounds!`); setTimeout(nextStage, 1600); }
            else { speak(`${q.sound} ${q.word}!`); setTimeout(render, 1400); }
          } else {
            c.classList.remove("wobble"); void c.offsetWidth; c.classList.add("wobble");
            speak(`That is ${o}. Say ${q.word} slowly and listen to its start!`);
          }
        });
        row.appendChild(c);
      });
      area.appendChild(row);
    }
    render();
  }

  if (stage === 1) { // Sentence completion
    const rounds = [
      { s: "The frog can ___ across the pond.", opts: ["jump", "sun", "egg"], ans: "jump", full: "The frog can JUMP across the pond." },
      { s: "The bee makes sweet ___.", opts: ["honey", "rock", "shoe"], ans: "honey", full: "The bee makes sweet HONEY." },
      { s: "At night, we see the ___ in the sky.", opts: ["moon", "soup", "hat"], ans: "moon", full: "At night, we see the MOON in the sky." },
      { s: "The rocket flies to the ___.", opts: ["stars", "banana", "sock"], ans: "stars", full: "The rocket flies to the STARS." }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      const q = rounds[r];
      speak("Read the sentence! Which word finishes it? " + q.s.replace("___", "blank"), true);
      const card = document.createElement("div");
      card.className = "story-card big-story";
      card.textContent = q.s;
      area.appendChild(card);
      const row = document.createElement("div");
      row.className = "word-cards";
      q.opts.forEach(w => {
        const c = document.createElement("button");
        c.type = "button";
        c.className = "word-card";
        c.innerHTML = `<span class="wc-word">${w}</span>`;
        c.addEventListener("click", () => {
          if (w === q.ans) {
            card.textContent = q.full.replace(q.ans.toUpperCase(), q.ans);
            fanfare();
            r += 1;
            if (r >= rounds.length) { speak(q.full + " You finished EVERY sentence!"); setTimeout(nextStage, 1600); }
            else { speak(q.full); setTimeout(render, 1500); }
          } else {
            c.classList.remove("wobble"); void c.offsetWidth; c.classList.add("wobble");
            speak("Read the sentence with that word. Does it make sense?");
          }
        });
        row.appendChild(c);
      });
      area.appendChild(row);
    }
    render();
  }

  if (stage === 2) { // Read & answer (comprehension)
    const rounds = [
      { text: "Ember hid six gems under the hexagon rock. Klausaiyan searched at sunrise and found them shining.",
        q: "Where were the gems hidden?", opts: ["Under the hexagon rock", "In the river", "On the Moon"], ans: "Under the hexagon rock" },
      { text: "Comet Nova zoomed past Saturn on her way home. Saturn's rings sparkled like ice in the sunlight, and Nova waved as she flew by.",
        q: "Whose rings sparkled like ice?", opts: ["Saturn's", "The Moon's", "A frog's"], ans: "Saturn's" },
      { text: "The baby dino counted his square blocks: four red, four blue. He stacked all eight into the tallest tower on the beach.",
        q: "How many blocks did the dino stack?", opts: ["Four", "Six", "Eight"], ans: "Eight" }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      const q = rounds[r];
      speak("Story time! Listen, then answer. " + q.text + " " + q.q, true);
      const card = document.createElement("div");
      card.className = "story-card big-story";
      card.textContent = q.text;
      area.appendChild(card);
      const hear = document.createElement("button");
      hear.type = "button";
      hear.className = "cmd-btn";
      hear.textContent = "\uD83D\uDD0A Read it again";
      hear.addEventListener("click", () => speak(q.text + " " + q.q));
      area.appendChild(hear);
      const qEl = document.createElement("div");
      qEl.className = "equation small-eq";
      qEl.textContent = q.q;
      area.appendChild(qEl);
      const row = document.createElement("div");
      row.className = "word-cards";
      q.opts.forEach(o => {
        const c = document.createElement("button");
        c.type = "button";
        c.className = "word-card";
        c.innerHTML = `<span class="wc-word sm">${o}</span>`;
        c.addEventListener("click", () => {
          if (o === q.ans) {
            fanfare();
            r += 1;
            if (r >= rounds.length) { speak("You understood EVERY story! Reader hero!"); setTimeout(nextStage, 1600); }
            else { speak("That's right! Great listening AND reading!"); setTimeout(render, 1500); }
          } else {
            c.classList.remove("wobble"); void c.offsetWidth; c.classList.add("wobble");
            speak("Go back into the story in your mind. What did it say?");
          }
        });
        row.appendChild(c);
      });
      area.appendChild(row);
    }
    render();
  }

  if (stage === 3) { // Spelling builder
    const rounds = [
      { emoji: "\uD83D\uDC1D", word: "BEE", tiles: ["B", "E", "A", "E"] },
      { emoji: "\uD83D\uDC38", word: "FROG", tiles: ["F", "A", "R", "O", "G", "E"] },
      { emoji: "\uD83C\uDF19", word: "MOON", tiles: ["M", "O", "N", "O", "S"] }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      const q = rounds[r];
      speak(`Spell the word! This is a ${q.word.toLowerCase() === "bee" ? "bee" : q.word.toLowerCase() === "frog" ? "frog" : "moon"}! Tap its letters in order!`, true);
      const big = document.createElement("div");
      big.style.fontSize = "4em";
      big.textContent = q.emoji;
      area.appendChild(big);
      const wordRow = document.createElement("div");
      wordRow.className = "spell-word";
      const spans = q.word.split("").map(ch => {
        const s = document.createElement("span");
        s.className = "spell-letter";
        s.textContent = "\u2022";
        s.dataset.ch = ch;
        wordRow.appendChild(s);
        return s;
      });
      area.appendChild(wordRow);
      let expected = 0;
      const keyRow = document.createElement("div");
      keyRow.className = "key-row";
      q.tiles.forEach(letter => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "key-btn";
        b.textContent = letter;
        b.addEventListener("click", () => {
          if (b.disabled) return;
          if (letter === q.word[expected]) {
            b.disabled = true;
            b.style.opacity = "0.35";
            spans[expected].textContent = letter;
            spans[expected].classList.add("lit");
            expected += 1;
            chime(expected + 2);
            if (expected >= q.word.length) {
              fanfare();
              r += 1;
              if (r >= rounds.length) { speak(`You spelled ${q.word}! Spelling champion!`); setTimeout(nextStage, 1600); }
              else { speak(`You spelled ${q.word}!`); setTimeout(render, 1400); }
            } else speak("Letter " + letter + "!");
          } else {
            b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
            speak("The next letter is " + q.word[expected] + "!");
          }
        });
        keyRow.appendChild(b);
      });
      area.appendChild(keyRow);
    }
    render();
  }
}


// ===== SOPHIA'S RAINBOW MEADOW (gentle starter world, age 2) =====
function sophiaStage(stage) {
  const area = $("stageArea");

  function choiceRow(items, render, onPick) {
    const row = document.createElement("div");
    row.className = "shape-grid";
    items.forEach(item => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "group-btn";
      render(b, item);
      b.addEventListener("click", () => onPick(item, b));
      row.appendChild(b);
    });
    area.appendChild(row);
  }

  if (stage === 0) { // Rainbow colors by name
    const rounds = [
      { name: "RED", color: "#ff5a5a", opts: ["#7ecbff", "#ff5a5a", "#ffd94d"] },
      { name: "BLUE", color: "#7ecbff", opts: ["#ffd94d", "#8ff0c8", "#7ecbff"] },
      { name: "YELLOW", color: "#ffd94d", opts: ["#ffd94d", "#ff9ecb", "#7ecbff"] },
      { name: "GREEN", color: "#8ff0c8", opts: ["#ff5a5a", "#8ff0c8", "#ffb84d"] }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      if (r >= rounds.length) return;
      const q = rounds[r];
      speak("Sophia! Find " + q.name + "! Tap the " + q.name.toLowerCase() + " rainbow color!", true);
      const big = document.createElement("div");
      big.className = "big-number";
      big.textContent = "🌈";
      area.appendChild(big);
      choiceRow(q.opts, (b, c) => {
        b.style.background = c;
        b.style.minWidth = "104px";
        b.style.minHeight = "104px";
        b.style.borderRadius = "50%";
        b.innerHTML = "";
      }, (c, b) => {
        if (c === q.color) {
          fanfare();
          r += 1;
          if (r >= rounds.length) { speak(q.name + "! You found ALL the rainbow colors, Sophia!"); setTimeout(nextStage, 1500); }
          else { speak(q.name + "! Yes!"); setTimeout(render, 1100); }
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak("That is a pretty color! Ember is looking for " + q.name + "!");
        }
      });
    }
    render();
  }

  if (stage === 1) { // Count the horses, 1–5
    const rounds = [
      { n: 2, opts: [1, 2, 3] },
      { n: 3, opts: [2, 3, 4] },
      { n: 5, opts: [3, 4, 5] },
      { n: 4, opts: [3, 4, 5] }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      if (r >= rounds.length) return;
      const q = rounds[r];
      speak("How many horses do you see, Sophia? Count with Ember!", true);
      const v = document.createElement("div");
      v.className = "visual-row";
      v.style.fontSize = "3em";
      v.textContent = "🐴".repeat(q.n);
      area.appendChild(v);
      choiceRow(q.opts, (b, n) => { b.textContent = n; b.classList.add("num-btn"); }, (n, b) => {
        if (n === q.n) {
          fanfare();
          r += 1;
          if (r >= rounds.length) { speak("Five... four... you counted ALL the horses, Sophia!"); setTimeout(nextStage, 1500); }
          else { speak("Yes! " + NUM[q.n] + " horses!"); setTimeout(render, 1200); }
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak("Count the horses one by one, slowly!");
        }
      });
    }
    render();
  }

  if (stage === 2) { // First shapes, huge and friendly
    const rounds = [
      { name: "circle", say: "Find the CIRCLE — it is round like the Moon!", draw: b => { b.appendChild(shapeDiv("circle", "#ff9ecb", 76)); }, others: ["triangle", "square"] },
      { name: "star", say: "Find the STAR — it twinkles!", draw: b => { b.innerHTML = "<span style='font-size:3em'>⭐</span>"; }, others: ["circle", "square"] },
      { name: "heart", say: "Find the HEART — it means love!", draw: b => { b.innerHTML = "<span style='font-size:3em'>❤️</span>"; }, others: ["triangle", "circle"] }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      if (r >= rounds.length) return;
      const q = rounds[r];
      speak(q.say, true);
      const items = [{ kind: q.name }, { kind: q.others[0] }, { kind: q.others[1] }];
      // Shuffle gently so the answer is not always first.
      const order = [items[(r + 1) % 3], items[(r + 2) % 3], items[r % 3]];
      choiceRow(order, (b, item) => {
        b.classList.remove("group-btn");
        b.className = "shape-btn";
        if (item.kind === q.name) q.draw(b);
        else if (item.kind === "star") b.innerHTML = "<span style='font-size:3em'>⭐</span>";
        else if (item.kind === "heart") b.innerHTML = "<span style='font-size:3em'>❤️</span>";
        else b.appendChild(shapeDiv(item.kind, "#7ecbff", 76));
      }, (item, b) => {
        if (item.kind === q.name) {
          fanfare();
          r += 1;
          if (r >= rounds.length) { speak("You found every shape, Sophia! The meadow is AWAKE!"); setTimeout(nextStage, 1500); }
          else { speak("Yes! You found it!"); setTimeout(render, 1200); }
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak("Pretty shape! Ember is looking for another one!");
        }
      });
    }
    render();
  }
}


// ===== GEOMETRY LAB (sides, symmetry, 3D shapes, perimeter) =====
function geoStage(stage) {
  const area = $("stageArea");

  function optsRow(opts, onPick) {
    const row = document.createElement("div");
    row.className = "shape-grid";
    opts.forEach(o => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "group-btn num-btn";
      b.textContent = o.label;
      b.addEventListener("click", () => onPick(o, b));
      row.appendChild(b);
    });
    area.appendChild(row);
  }

  if (stage === 0) { // Count the sides — bigger polygons
    const rounds = [
      { name: "pentagon", cls: "pentagon", color: "#ff9ecb", sides: 5, opts: [4, 5, 6], fact: "A pentagon has FIVE sides. The famous Pentagon building has five sides too!" },
      { name: "hexagon", cls: "hexagon", color: "#ffd94d", sides: 6, opts: [5, 6, 8], fact: "Six sides — the bee shape! You already knew that one!" },
      { name: "heptagon", cls: "heptagon", color: "#8ff0c8", sides: 7, opts: [6, 7, 8], fact: "A heptagon has SEVEN sides. Hepta means seven!" },
      { name: "octagon", cls: "octagon", color: "#ff6b57", sides: 8, opts: [6, 8, 10], fact: "EIGHT sides! A stop sign is an octagon!" }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      if (r >= rounds.length) return;
      const q = rounds[r];
      speak("How many sides does a " + q.name + " have? Count each side slowly!", true);
      const wrap = document.createElement("div");
      wrap.className = "shape-grid";
      wrap.appendChild(shapeDiv(q.cls, q.color, 130));
      area.appendChild(wrap);
      optsRow(q.opts.map(n => ({ label: n, val: n })), (o, b) => {
        if (o.val === q.sides) {
          fanfare();
          r += 1;
          if (r >= rounds.length) { speak(q.fact + " Polygon master!"); setTimeout(nextStage, 1700); }
          else { speak(q.fact); setTimeout(render, 1700); }
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak("Count the sides one at a time, touching each one!");
        }
      });
    }
    render();
  }

  if (stage === 1) { // Symmetry
    const rounds = [
      { e: "⬛", name: "square", opts: ["2", "4", "6"], ans: "4", fact: "A square folds perfectly FOUR ways — up-down, side-to-side, and both diagonals!" },
      { e: "🔺", name: "triangle (all sides equal)", opts: ["1", "2", "3"], ans: "3", fact: "An equal-sided triangle has THREE lines of symmetry!" },
      { e: "❤️", name: "heart", opts: ["1", "2", "4"], ans: "1", fact: "A heart has ONE line of symmetry, right down the middle!" },
      { e: "⭕", name: "circle", opts: ["4", "10", "More than you can count!"], ans: "More than you can count!", fact: "A circle has INFINITE symmetry — every fold through the middle matches!" }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      if (r >= rounds.length) return;
      const q = rounds[r];
      speak("Symmetry hunt! If you fold this " + q.name + " so both halves match EXACTLY, how many fold lines work?", true);
      const big = document.createElement("div");
      big.className = "big-number";
      big.textContent = q.e;
      area.appendChild(big);
      optsRow(q.opts.map(s => ({ label: s, val: s })), (o, b) => {
        if (o.val === q.ans) {
          fanfare();
          r += 1;
          if (r >= rounds.length) { speak(q.fact + " Symmetry scientist!"); setTimeout(nextStage, 1800); }
          else { speak(q.fact); setTimeout(render, 1800); }
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak("Picture the shape folding in half. Do the two halves match?");
        }
      });
    }
    render();
  }

  if (stage === 2) { // 3D shapes
    const solids = [
      { n: "sphere", e: "⚽", fact: "A sphere is round all over, like a ball or a planet!" },
      { n: "cube", e: "🎲", fact: "A cube has 6 square faces — like dice!" },
      { n: "cone", e: "🍦", fact: "A cone has a circle bottom and a pointy top — like an ice-cream cone!" },
      { n: "cylinder", e: "🥫", fact: "A cylinder has two circle ends — like a can or a tree trunk!" }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      if (r >= solids.length) return;
      const want = solids[r];
      speak("3D shape hunt! Tap the " + want.n.toUpperCase() + "!", true);
      const row = document.createElement("div");
      row.className = "shape-grid";
      const shuffled = [solids[(r + 2) % 4], solids[r], solids[(r + 1) % 4], solids[(r + 3) % 4]];
      shuffled.forEach(s => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "group-btn";
        b.innerHTML = `<span style="font-size:2.2em">${s.e}</span><br><small>${s.n}</small>`;
        b.addEventListener("click", () => {
          if (s.n === want.n) {
            fanfare();
            r += 1;
            if (r >= solids.length) { speak(want.fact + " You know your 3D shapes!"); setTimeout(nextStage, 1700); }
            else { speak(want.fact); setTimeout(render, 1600); }
          } else {
            b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
            speak("That one is a " + s.n + "! Find the " + want.n + "!");
          }
        });
        row.appendChild(b);
      });
      area.appendChild(row);
    }
    render();
  }

  if (stage === 3) { // Perimeter: add all the sides
    const rounds = [
      { story: "A square garden bed. EVERY side is 3 steps long. Walk all the way AROUND it!", eq: "3 + 3 + 3 + 3 = ?", ans: 12, opts: [9, 12, 15] },
      { story: "A triangle sign. Every side is 4 steps long. Walk all the way around!", eq: "4 + 4 + 4 = ?", ans: 12, opts: [8, 12, 16] },
      { story: "A rectangle banner: 5, then 2, then 5, then 2 steps. All the way around!", eq: "5 + 2 + 5 + 2 = ?", ans: 14, opts: [10, 12, 14] }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      if (r >= rounds.length) return;
      const q = rounds[r];
      speak("Perimeter means: add up ALL the sides! " + q.story, true);
      const note = document.createElement("p");
      note.className = "visual-note";
      note.textContent = q.story;
      area.appendChild(note);
      const eq = document.createElement("div");
      eq.className = "equation";
      eq.textContent = q.eq;
      area.appendChild(eq);
      optsRow(q.opts.map(n => ({ label: n, val: n })), (o, b) => {
        if (o.val === q.ans) {
          fanfare();
          r += 1;
          if (r >= rounds.length) { speak("PERIMETER! The answer is " + q.ans + "! Builders measure perimeters every day!"); setTimeout(nextStage, 1700); }
          else { speak("Yes! The perimeter is " + q.ans + " steps!"); setTimeout(render, 1500); }
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak("Add EVERY side, one at a time. Do not skip any!");
        }
      });
    }
    render();
  }
}


// ===== ROCKET MATH LAB (×, ÷, fractions, place value, money/time) =====
function rocketStage(stage) {
  const area = $("stageArea");

  function numRow(opts, ans, onRight, onWrong) {
    const row = document.createElement("div");
    row.className = "shape-grid";
    opts.forEach(o => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "group-btn num-btn";
      b.textContent = o;
      b.addEventListener("click", () => {
        if (String(o) === String(ans)) onRight();
        else { b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble"); onWrong(); }
      });
      row.appendChild(b);
    });
    area.appendChild(row);
  }
  function eqEl(text, small) {
    const eq = document.createElement("div");
    eq.className = "equation" + (small ? " small-eq" : "");
    eq.textContent = text;
    area.appendChild(eq);
    return eq;
  }

  if (stage === 0) { // Multiplication = groups of
    const rounds = [
      { g: 2, n: 3, opts: [5, 6, 8] },
      { g: 3, n: 4, opts: [11, 12, 13] },
      { g: 4, n: 5, opts: [18, 20, 24] },
      { g: 5, n: 3, opts: [12, 15, 18] }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      if (r >= rounds.length) return;
      const q = rounds[r], ans = q.g * q.n;
      speak(q.g + " groups of " + q.n + ". That is " + q.g + " times " + q.n + ". How many stars in all?", true);
      eqEl(q.g + " × " + q.n + " = ?");
      const v = document.createElement("div");
      v.className = "visual-row";
      v.innerHTML = Array.from({ length: q.g }, () => "⭐".repeat(q.n)).join("<br>");
      area.appendChild(v);
      numRow(q.opts, ans,
        () => { fanfare(); r += 1;
          if (r >= rounds.length) { speak("YES! " + q.g + " times " + q.n + " equals " + ans + "! Multiplication is just fast adding!"); setTimeout(nextStage, 1700); }
          else { speak("Yes! " + q.g + " times " + q.n + " equals " + ans + "!"); setTimeout(render, 1400); } },
        () => speak("Count the groups: " + q.g + " groups, " + q.n + " in each group!"));
    }
    render();
  }

  if (stage === 1) { // Division = sharing fairly
    const rounds = [
      { a: 12, b: 3, opts: [3, 4, 6] },
      { a: 10, b: 2, opts: [4, 5, 6] },
      { a: 8, b: 4, opts: [2, 3, 4] },
      { a: 15, b: 5, opts: [3, 4, 5] }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      if (r >= rounds.length) return;
      const q = rounds[r], ans = q.a / q.b;
      speak("Share " + q.a + " moon rocks EQUALLY among " + q.b + " astronauts. How many does EACH astronaut get?", true);
      eqEl(q.a + " ÷ " + q.b + " = ?");
      const v = document.createElement("div");
      v.className = "visual-row";
      v.textContent = "🌑".repeat(q.a);
      area.appendChild(v);
      numRow(q.opts, ans,
        () => { fanfare(); r += 1;
          if (r >= rounds.length) { speak("YES! " + q.a + " shared by " + q.b + " is " + ans + " each! Division is FAIR sharing!"); setTimeout(nextStage, 1700); }
          else { speak("Yes! Each astronaut gets " + ans + "!"); setTimeout(render, 1400); } },
        () => speak("Deal the rocks out one at a time: one for you, one for you... until they are all shared!"));
    }
    render();
  }

  if (stage === 2) { // Fractions with bar models
    function bar(filled, total) {
      const wrap = document.createElement("div");
      wrap.className = "frac-bar";
      for (let i = 0; i < total; i++) {
        const seg = document.createElement("span");
        seg.className = "frac-seg" + (i < filled ? " full" : "");
        wrap.appendChild(seg);
      }
      return wrap;
    }
    const rounds = [
      { q: "Which bar shows ONE HALF — 1 out of 2 parts filled?", opts: [[1, 4], [1, 2], [3, 4]], ans: 1, say: "One half means the bar is cut into 2 EQUAL parts, with 1 part filled!" },
      { q: "Which bar shows THREE QUARTERS — 3 out of 4 parts filled?", opts: [[3, 4], [1, 2], [1, 4]], ans: 0, say: "Three quarters: 4 equal parts, 3 filled!" },
      { q: "A pizza is cut into 2 equal pieces. You eat 1 piece. What fraction did you eat?", opts: ["1/4", "1/2", "2/2"], ans: 1, text: true, say: "One out of two pieces is one HALF of the pizza!" }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      if (r >= rounds.length) return;
      const q = rounds[r];
      speak(q.q, true);
      const note = document.createElement("p");
      note.className = "visual-note";
      note.textContent = q.q;
      area.appendChild(note);
      const row = document.createElement("div");
      row.className = "shape-grid";
      q.opts.forEach((o, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "group-btn frac-btn";
        if (q.text) { b.textContent = o; b.style.fontSize = "1.6em"; }
        else b.appendChild(bar(o[0], o[1]));
        b.addEventListener("click", () => {
          if (i === q.ans) {
            fanfare();
            r += 1;
            if (r >= rounds.length) { speak(q.say + " Fraction explorer!"); setTimeout(nextStage, 1700); }
            else { speak(q.say); setTimeout(render, 1600); }
          } else {
            b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
            speak("Count the parts on the bottom, then count the FILLED parts on top!");
          }
        });
        row.appendChild(b);
      });
      area.appendChild(row);
    }
    render();
  }

  if (stage === 3) { // Place value
    const rounds = [
      { q: "In the number 47, which digit is in the TENS place?", opts: ["4", "7"], ans: "4", say: "The 4 is in the tens place — it means FOUR TENS, which is 40!" },
      { q: "Which number has 6 tens and 3 ones?", opts: ["36", "63", "60"], ans: "63", say: "6 tens and 3 ones make 63!" },
      { q: "52 is the same as 50 plus... what?", opts: ["2", "5", "20"], ans: "2", say: "52 = 50 + 2! That is called expanded form!" },
      { q: "In the number 85, the digit 8 means eight WHAT?", opts: ["ones", "tens", "hundreds"], ans: "tens", say: "Eight TENS is 80! Place tells a digit its power!" }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      if (r >= rounds.length) return;
      const q = rounds[r];
      speak(q.q, true);
      const note = document.createElement("p");
      note.className = "visual-note";
      note.textContent = q.q;
      area.appendChild(note);
      numRow(q.opts, q.ans,
        () => { fanfare(); r += 1;
          if (r >= rounds.length) { speak(q.say + " Place value champion!"); setTimeout(nextStage, 1700); }
          else { speak(q.say); setTimeout(render, 1600); } },
        () => speak("Think: TENS on the left, ONES on the right!"));
    }
    render();
  }

  if (stage === 4) { // Money + time
    const rounds = [
      { q: "Two quarters! 25 cents + 25 cents = ?", opts: ["40¢", "50¢", "75¢"], ans: "50¢", say: "Two quarters make 50 cents — half a dollar!" },
      { q: "A sticker costs 75 cents. You pay with 100 cents. How much change do you get?", opts: ["15¢", "25¢", "35¢"], ans: "25¢", say: "100 take away 75 is 25 — one quarter back!" },
      { q: "Four nickels! 5 + 5 + 5 + 5 = ?", opts: ["20¢", "25¢", "40¢"], ans: "20¢", say: "Four nickels make 20 cents!" },
      { q: "The rocket launches at 3 o'clock. It is 1 o'clock now. How many HOURS until launch?", opts: ["1 hour", "2 hours", "4 hours"], ans: "2 hours", say: "1... 2... two hours to go! Time math!" }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      if (r >= rounds.length) return;
      const q = rounds[r];
      speak(q.q, true);
      const note = document.createElement("p");
      note.className = "visual-note";
      note.textContent = q.q;
      area.appendChild(note);
      numRow(q.opts, q.ans,
        () => { fanfare(); r += 1;
          if (r >= rounds.length) { speak(q.say + " Money and time, mastered!"); setTimeout(nextStage, 1700); }
          else { speak(q.say); setTimeout(render, 1600); } },
        () => speak("Work it out step by step — you know how!"));
    }
    render();
  }
}


// ===== WORD WIZARD ACADEMY (rhymes, sentence building, main idea, vocabulary) =====
function wizardStage(stage) {
  const area = $("stageArea");

  function cardRow(cards, onPick) {
    const wrap = document.createElement("div");
    wrap.className = "word-cards";
    cards.forEach(c => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "word-card";
      b.innerHTML = `<span class="wc-emoji">${c.e || "✨"}</span><span class="wc-word sm">${c.w}</span>`;
      b.addEventListener("click", () => onPick(c, b));
      wrap.appendChild(b);
    });
    area.appendChild(wrap);
  }

  if (stage === 0) { // Rhyming words
    const rounds = [
      { word: "STAR", opts: [{ w: "car", e: "🚗" }, { w: "fish", e: "🐟" }, { w: "dog", e: "🐶" }], ans: "car" },
      { word: "MOON", opts: [{ w: "cat", e: "🐱" }, { w: "spoon", e: "🥄" }, { w: "pig", e: "🐷" }], ans: "spoon" },
      { word: "FROG", opts: [{ w: "bee", e: "🐝" }, { w: "log", e: "🪵" }, { w: "sun", e: "☀️" }], ans: "log" },
      { word: "CAKE", opts: [{ w: "cup", e: "🥤" }, { w: "ball", e: "⚽" }, { w: "snake", e: "🐍" }], ans: "snake" }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      if (r >= rounds.length) return;
      const q = rounds[r];
      speak("Rhyme time! Which word RHYMES with " + q.word + "? Rhyming words end with the same sound!", true);
      const big = document.createElement("div");
      big.className = "equation";
      big.textContent = q.word;
      area.appendChild(big);
      cardRow(q.opts, (c, b) => {
        if (c.w === q.ans) {
          b.classList.add("right");
          fanfare();
          r += 1;
          if (r >= rounds.length) { speak(q.word + " and " + q.ans + " rhyme! Rhyme wizard!"); setTimeout(nextStage, 1600); }
          else { speak(q.word + " and " + q.ans + " — they rhyme!"); setTimeout(render, 1400); }
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak("Say " + q.word + ", then say " + c.w + ". Do their endings sound the same?");
        }
      });
    }
    render();
  }

  if (stage === 1) { // Build a sentence, word by word, in order
    const sentences = [
      { words: ["The", "frog", "jumps", "over", "the", "moon."], tiles: ["moon.", "The", "jumps", "the", "frog", "over"] },
      { words: ["Brave", "astronauts", "fly", "to", "the", "stars."], tiles: ["fly", "stars.", "Brave", "the", "to", "astronauts"] }
    ];
    let s = 0;
    function render() {
      area.innerHTML = "";
      if (s >= sentences.length) return;
      const q = sentences[s];
      speak("Build the sentence! Listen: " + q.words.join(" ") + " Now tap the words IN ORDER!", true);
      let expected = 0;
      const display = document.createElement("div");
      display.className = "code-row";
      display.textContent = "📝 ...";
      area.appendChild(display);
      const row = document.createElement("div");
      row.className = "cmd-row";
      q.tiles.forEach(w => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "cmd-btn";
        b.textContent = w;
        b.addEventListener("click", () => {
          if (b.disabled) return;
          if (w === q.words[expected]) {
            b.disabled = true;
            b.style.opacity = "0.35";
            expected += 1;
            display.textContent = "📝 " + q.words.slice(0, expected).join(" ");
            chime(expected + 2);
            if (expected >= q.words.length) {
              fanfare();
              s += 1;
              if (s >= sentences.length) { speak("You built the WHOLE sentence: " + q.words.join(" ") + " Sentence builder!"); setTimeout(nextStage, 1900); }
              else { speak("Sentence built! " + q.words.join(" ") + " One more!"); setTimeout(render, 1700); }
            } else speak(w + "!");
          } else {
            b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
            speak("The next word is: " + q.words[expected]);
          }
        });
        row.appendChild(b);
      });
      area.appendChild(row);
    }
    render();
  }

  if (stage === 2) { // Main idea
    const stories = [
      { text: "Mia planted seeds in the spring. She watered them every single day. Soon, tall sunflowers grew — and the bees came to visit them!",
        q: "What is this story MOSTLY about?", opts: ["Mia growing sunflowers", "A trip to the Moon", "A dog who swims"], ans: "Mia growing sunflowers" },
      { text: "The rocket crew packed their space suits, checked their star maps, and counted down from ten. At zero — WHOOSH! — they blasted off toward the space station!",
        q: "What is this story MOSTLY about?", opts: ["Cooking a big dinner", "Riding the school bus", "Astronauts blasting off"], ans: "Astronauts blasting off" }
    ];
    let s = 0;
    function render() {
      area.innerHTML = "";
      if (s >= stories.length) return;
      const q = stories[s];
      speak("Listen to the story. Then tell Ember what it is MOSTLY about!", true);
      const card = document.createElement("div");
      card.className = "story-card big-story";
      card.textContent = q.text;
      area.appendChild(card);
      const readBtn = document.createElement("button");
      readBtn.type = "button";
      readBtn.className = "cmd-btn";
      readBtn.textContent = "🔊 Read it again";
      readBtn.addEventListener("click", () => speak(q.text));
      area.appendChild(readBtn);
      eqSpacer();
      function eqSpacer() {
        const qq = document.createElement("p");
        qq.className = "stage-msg";
        qq.textContent = q.q;
        area.appendChild(qq);
        cardRow(q.opts.map(w => ({ w })), (c, b) => {
          if (c.w === q.ans) {
            b.classList.add("right");
            fanfare();
            s += 1;
            if (s >= stories.length) { speak("Yes! That is the MAIN IDEA — the big point of the whole story!"); setTimeout(nextStage, 1700); }
            else { speak("Yes! That is the main idea! One more story!"); setTimeout(render, 1500); }
          } else {
            b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
            speak("That is a fun idea — but is it what the WHOLE story is about?");
          }
        });
      }
      speak(q.text);
    }
    render();
  }

  if (stage === 3) { // Vocabulary in context
    const rounds = [
      { sent: "The elephant is ENORMOUS.", word: "Enormous", opts: ["very tiny", "very big", "very sleepy"], ans: "very big" },
      { sent: "The astronaut was BRAVE when the rocket shook and roared.", word: "Brave", opts: ["not afraid", "very hungry", "very quiet"], ans: "not afraid" },
      { sent: "The library was SILENT. Not one single sound.", word: "Silent", opts: ["very loud", "very bright", "very quiet"], ans: "very quiet" },
      { sent: "The tiny seedling began to GROW toward the sunlight.", word: "Grow", opts: ["get bigger", "fall asleep", "run away"], ans: "get bigger" }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      if (r >= rounds.length) return;
      const q = rounds[r];
      speak("Word Wizard word: " + q.word + "! Listen: " + q.sent + " What does " + q.word + " mean?", true);
      const card = document.createElement("div");
      card.className = "story-card big-story";
      card.textContent = q.sent;
      area.appendChild(card);
      cardRow(q.opts.map(w => ({ w })), (c, b) => {
        if (c.w === q.ans) {
          b.classList.add("right");
          fanfare();
          r += 1;
          if (r >= rounds.length) { speak(q.word + " means " + q.ans + "! Your brain is collecting BIG words!"); setTimeout(nextStage, 1700); }
          else { speak("Yes! " + q.word + " means " + q.ans + "!"); setTimeout(render, 1500); }
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak("Use the clues in the sentence, Word Wizard!");
        }
      });
    }
    render();
  }
}


// ===== STAR SCIENTIST (planet order, space quiz, moon phases, deep space) =====
function starsStage(stage) {
  const area = $("stageArea");

  function quiz(rounds, intro) {
    let r = 0;
    function render() {
      area.innerHTML = "";
      if (r >= rounds.length) return;
      const q = rounds[r];
      speak(q.q, true);
      const note = document.createElement("p");
      note.className = "visual-note";
      note.textContent = q.q;
      area.appendChild(note);
      const row = document.createElement("div");
      row.className = "word-cards";
      q.opts.forEach((o, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "word-card";
        b.innerHTML = `<span class="wc-word sm">${o}</span>`;
        b.addEventListener("click", () => {
          if (i === q.ans) {
            b.classList.add("right");
            fanfare();
            r += 1;
            if (r >= rounds.length) { speak(q.fact + " Star Scientist!"); setTimeout(nextStage, 1900); }
            else { speak(q.fact); setTimeout(render, 1800); }
          } else {
            b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
            speak("Good guess, scientist! Think it over and try another!");
          }
        });
        row.appendChild(b);
      });
      area.appendChild(row);
    }
    if (intro) speak(intro, true);
    render();
  }

  if (stage === 0) { // Order the planets from the Sun
    const planets = [
      { n: "Mercury", e: "🩶", hint: "Mercury — the closest planet to the Sun, and the fastest!" },
      { n: "Venus", e: "🟡", hint: "Venus — the Morning Star, the hottest planet!" },
      { n: "Earth", e: "🌍", hint: "Earth — OUR planet, the only one with life we know!" },
      { n: "Mars", e: "🔴", hint: "Mars — the red planet, with the tallest volcano!" },
      { n: "Jupiter", e: "🟠", hint: "Jupiter — the GIANT, biggest planet of all!" },
      { n: "Saturn", e: "🪐", hint: "Saturn — the ringed jewel!" },
      { n: "Uranus", e: "🔵", hint: "Uranus — the planet tipped on its side!" },
      { n: "Neptune", e: "🌊", hint: "Neptune — the farthest, windiest, bluest planet!" }
    ];
    speak("Star Scientist mission! Tap the planets IN ORDER, starting closest to the Sun! Ember will give you hints!", true);
    let expected = 0;
    const sunRow = document.createElement("div");
    sunRow.className = "visual-row";
    sunRow.textContent = "☀️ The Sun →";
    area.appendChild(sunRow);
    const display = document.createElement("div");
    display.className = "code-row";
    display.textContent = "🪐 ...";
    area.appendChild(display);
    const row = document.createElement("div");
    row.className = "shape-grid";
    const shuffled = [planets[3], planets[0], planets[6], planets[2], planets[7], planets[1], planets[5], planets[4]];
    shuffled.forEach(p => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "group-btn";
      b.innerHTML = `<span style="font-size:1.8em">${p.e}</span><br><small>${p.n}</small>`;
      b.addEventListener("click", () => {
        if (b.disabled) return;
        if (p.n === planets[expected].n) {
          b.disabled = true;
          b.style.opacity = "0.4";
          expected += 1;
          display.textContent = "🪐 " + planets.slice(0, expected).map(x => x.n).join(" → ");
          chime(expected + 1);
          if (expected >= planets.length) {
            fanfare();
            speak("ALL EIGHT PLANETS IN ORDER! Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune! You know the solar system!");
            setTimeout(nextStage, 2200);
          } else speak(planets[expected - 1].hint + " Next: " + planets[expected].hint.split(" — ")[0] + " is planet number " + (expected + 1) + "!");
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak("Planet number " + (expected + 1) + " from the Sun is " + planets[expected].n + ". Find it!");
        }
      });
      row.appendChild(b);
    });
    area.appendChild(row);
  }

  if (stage === 1) {
    quiz([
      { q: "What is a LIGHT-YEAR?", opts: ["One year on the Sun", "The distance light travels in one year", "A very fast year"], ans: 1, fact: "A light-year is a DISTANCE — almost 6 trillion miles! Space is SO big we measure it in light-years!" },
      { q: "Which planet has a giant storm called the Great Red Spot?", opts: ["Mars", "Venus", "Jupiter"], ans: 2, fact: "Jupiter's Great Red Spot is a storm BIGGER THAN EARTH, and it has raged for hundreds of years!" },
      { q: "What invisible force pulls you back down when you jump?", opts: ["Gravity", "Magnetism", "The wind"], ans: 0, fact: "Gravity! Earth's gravity holds the Moon close, and the Sun's gravity holds ALL the planets!" },
      { q: "A picture made of stars in the sky is called a...", opts: ["Comet", "Constellation", "Crater"], ans: 1, fact: "A constellation! People have told stories about star pictures for thousands of years!" }
    ], "Space quiz! Real NASA-level questions, Star Scientist!");
  }

  if (stage === 2) { // Moon phases in growing order
    const phases = [
      { n: "New Moon", e: "🌑" },
      { n: "Crescent", e: "🌒" },
      { n: "Half Moon", e: "🌓" },
      { n: "Full Moon", e: "🌕" }
    ];
    speak("Moon phase mission! The Moon GROWS a little each night. Tap the moons in growing order: new, crescent, half, full!", true);
    let expected = 0;
    const display = document.createElement("div");
    display.className = "code-row";
    display.textContent = "🌙 ...";
    area.appendChild(display);
    const row = document.createElement("div");
    row.className = "shape-grid";
    [phases[2], phases[0], phases[3], phases[1]].forEach(p => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "group-btn";
      b.innerHTML = `<span style="font-size:2.2em">${p.e}</span><br><small>${p.n}</small>`;
      b.addEventListener("click", () => {
        if (b.disabled) return;
        if (p.n === phases[expected].n) {
          b.disabled = true;
          b.style.opacity = "0.4";
          expected += 1;
          display.textContent = "🌙 " + phases.slice(0, expected).map(x => x.e).join(" → ");
          chime(expected + 2);
          if (expected >= phases.length) {
            fanfare();
            speak("The Moon waxes — grows — from new to full in about two weeks! Scientists call growing WAXING!");
            setTimeout(nextStage, 1900);
          } else speak(p.n + "! The Moon is growing. This is called waxing!");
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak("Next comes the " + phases[expected].n + "!");
        }
      });
      row.appendChild(b);
    });
    area.appendChild(row);
  }

  if (stage === 3) {
    quiz([
      { q: "What is a BLACK HOLE?", opts: ["A hole in the Moon", "A dark cloud", "Gravity so strong that even LIGHT cannot escape"], ans: 2, fact: "A black hole's gravity is so strong, nothing escapes — not even light, the fastest thing there is!" },
      { q: "Baby stars are born inside giant glowing clouds called...", opts: ["Nebulas", "Comets", "Rings"], ans: 0, fact: "Nebulas are star nurseries! The Orion Nebula is making new stars RIGHT NOW!" },
      { q: "Long from now, after the Sun puffs up into a red giant, it will shrink into a...", opts: ["Planet", "White dwarf", "Moon"], ans: 1, fact: "A white dwarf — a hot, tiny, super-heavy star cinder, about the size of Earth!" },
      { q: "How long does sunlight take to travel to Earth?", opts: ["8 minutes", "8 hours", "8 days"], ans: 0, fact: "Eight minutes! The sunlight warming your face left the Sun 8 minutes ago!" }
    ], "Deep space questions! These are the mysteries real astronomers study!");
  }
}


// ===== MINDFULNESS JOURNEY (breath, feelings, kindness, loving wishes) =====
// Rooted in what the family loves: Buddhist loving-kindness and compassion,
// and the Taoist way of flowing like water — soft, patient, and strong.
function zenStage(stage) {
  const area = $("stageArea");

  function cardRow(cards, onPick) {
    const wrap = document.createElement("div");
    wrap.className = "word-cards";
    cards.forEach(c => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "word-card";
      b.innerHTML = `<span class="wc-emoji">${c.e || "✨"}</span><span class="wc-word sm">${c.w}</span>`;
      b.addEventListener("click", () => onPick(c, b));
      wrap.appendChild(b);
    });
    area.appendChild(wrap);
  }

  if (stage === 0) { // Dragon breath — guided breathing with Ember
    speak("Mindfulness Journey. First: the Dragon Breath. Watch Ember's circle. When it GROWS, breathe in slowly. When it SHRINKS, breathe out even slower.", true);
    const circle = document.createElement("div");
    circle.className = "breath-circle";
    circle.textContent = "🐉";
    area.appendChild(circle);
    const cue = document.createElement("p");
    cue.className = "stage-msg";
    area.appendChild(cue);
    let breaths = 0;
    function cycle() {
      if (!circle.isConnected) return; // left the stage — stop quietly
      cue.textContent = "Breathe in… 🌸";
      speak("Breathe in, slowly…");
      circle.style.transform = "scale(1.45)";
      setTimeout(() => {
        if (!circle.isConnected) return;
        cue.textContent = "Breathe out… 🍃";
        speak("And breathe out, even slower…");
        circle.style.transform = "scale(1)";
        setTimeout(() => {
          if (!circle.isConnected) return;
          breaths += 1;
          if (breaths < 3) cycle();
          else {
            cue.textContent = "Three dragon breaths. Feel how calm your body is? 🌈";
            speak("Three dragon breaths. Your body is calm, and your heart is quiet. Beautiful.");
          }
        }, 4200);
      }, 4200);
    }
    setTimeout(cycle, 600);
    const calm = document.createElement("button");
    calm.type = "button";
    calm.className = "cmd-btn cmd-go";
    calm.textContent = "🌿 I Feel Calm";
    calm.addEventListener("click", () => { fanfare(); speak("Calm and strong, like a mountain lake."); setTimeout(nextStage, 1200); });
    area.appendChild(calm);
  }

  if (stage === 1) { // Name the feeling — emotional intelligence
    const rounds = [
      { e: "😢", scene: "Ember's ice-cream fell on the ground. How does Ember feel?", opts: ["Sad", "Excited", "Proud"], ans: "Sad",
        teach: "Sad. Sad is okay — feelings are like clouds. They visit, and they float away. A hug or a kind word helps." },
      { e: "😊", scene: "Ember's friend shared their favorite toy. How does Ember feel?", opts: ["Angry", "Happy", "Sleepy"], ans: "Happy",
        teach: "Happy! When something feels good inside, we can say it out loud: “I feel happy!”" },
      { e: "😤", scene: "Ember's block tower fell down — three times! How does Ember feel?", opts: ["Frustrated", "Silly", "Calm"], ans: "Frustrated",
        teach: "Frustrated! That's the feeling when something is hard. A dragon breath helps. Then we can try again." },
      { e: "😨", scene: "Boom! A big thunder sound outside. How does Ember feel?", opts: ["Bored", "Scared", "Hungry"], ans: "Scared",
        teach: "Scared. When we feel scared, we find a grown-up we love. Being scared is never something to hide." }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      if (r >= rounds.length) return;
      const q = rounds[r];
      speak("Feelings detective! " + q.scene, true);
      const big = document.createElement("div");
      big.className = "big-number";
      big.textContent = q.e;
      area.appendChild(big);
      const note = document.createElement("p");
      note.className = "visual-note";
      note.textContent = q.scene;
      area.appendChild(note);
      cardRow(q.opts.map(w => ({ w })), (c, b) => {
        if (c.w === q.ans) {
          b.classList.add("right");
          fanfare();
          r += 1;
          if (r >= rounds.length) { speak(q.teach + " You can name feelings — that's a superpower!"); setTimeout(nextStage, 2100); }
          else { speak(q.teach); setTimeout(render, 2000); }
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak("Look at Ember's face again. What is it telling you?");
        }
      });
    }
    render();
  }

  if (stage === 2) { // Choose kindness — compassion in action
    const rounds = [
      { scene: "Your friend is crying at the park. What could you do?", kind: "Sit with them and listen 💛", other: "Laugh at them",
        reframe: "Hmm — laughing might make the sad feeling even bigger. Kindness makes it smaller. Try another choice!" },
      { scene: "A new kid doesn't know how to play your game. What could you do?", kind: "Teach them how to play 🎲", other: "Keep it a secret",
        reframe: "Keeping secrets about games leaves friends out. Teaching someone makes TWO people happy. Try another choice!" },
      { scene: "You find a tiny hurt bird on the path. What could you do?", kind: "Get a grown-up to help 🐦", other: "Chase it",
        reframe: "Chasing would frighten the little bird. Gentle helpers get a grown-up. Try another choice!" },
      { scene: "You have two cookies. Your sister has none. What could you do?", kind: "Share one with her 🍪", other: "Eat both very fast",
        reframe: "Ha! Fast cookie eating! But sharing tastes even sweeter — and it fills TWO hearts. Try another choice!" }
    ];
    let r = 0;
    function render() {
      area.innerHTML = "";
      if (r >= rounds.length) return;
      const q = rounds[r];
      speak("Kindness choice! " + q.scene, true);
      const note = document.createElement("p");
      note.className = "visual-note";
      note.textContent = q.scene;
      area.appendChild(note);
      const order = r % 2 === 0 ? [q.kind, q.other] : [q.other, q.kind];
      cardRow(order.map(w => ({ w, e: w === q.kind ? "💛" : "🤔" })), (c, b) => {
        if (c.w === q.kind) {
          b.classList.add("right");
          fanfare();
          r += 1;
          if (r >= rounds.length) { speak("Kindness every time! A kind heart is the strongest thing in the whole garden!"); setTimeout(nextStage, 1900); }
          else { speak("Kindness! That choice makes the world softer."); setTimeout(render, 1600); }
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak(q.reframe);
        }
      });
    }
    render();
  }

  if (stage === 3) { // Loving-kindness wishes + the love reminder
    speak("Now: loving-kindness wishes. Tap each lantern to send a kind wish out into the world!", true);
    const wishes = [
      { e: "🪷", wish: "May *I* be happy. May I be calm and safe." },
      { e: "🏮", wish: "May my family be happy. May they be calm and safe." },
      { e: "💛", wish: "May my friends be happy. May they be calm and safe." },
      { e: "🐘", wish: "May all the animals be happy. May they be calm and safe." },
      { e: "🌍", wish: "May everyone, everywhere, be happy. May they be calm and safe." }
    ];
    let sent = 0;
    const count = document.createElement("p");
    count.className = "fact-line";
    count.textContent = "⭐ Wishes sent: 0 of " + wishes.length;
    area.appendChild(count);
    const row = document.createElement("div");
    row.className = "shape-grid";
    wishes.forEach(w => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "group-btn wish-btn";
      b.innerHTML = `<span style="font-size:2.4em">${w.e}</span>`;
      b.addEventListener("click", () => {
        if (b.disabled) return;
        b.disabled = true;
        b.classList.add("found");
        sent += 1;
        count.textContent = "⭐ Wishes sent: " + sent + " of " + wishes.length;
        fanfare();
        if (sent >= wishes.length) {
          speak(w.wish + " And now the most important wish of all, from Ember: " + player().hero + ", you are LOVED. Exactly as you are. Today, tomorrow, always.");
          setTimeout(nextStage, 2600);
        } else speak(w.wish);
      });
      row.appendChild(b);
    });
    area.appendChild(row);
  }
}


// ===== ANIMAL KINGDOM (habitats, groups, riddles, babies) =====
function animalsStage(stage) {
  const area = $("stageArea");

  function cardRow(cards, onPick) {
    const wrap = document.createElement("div");
    wrap.className = "word-cards";
    cards.forEach(c => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "word-card";
      b.innerHTML = `<span class="wc-emoji">${c.e || "✨"}</span><span class="wc-word sm">${c.w}</span>`;
      b.addEventListener("click", () => onPick(c, b));
      wrap.appendChild(b);
    });
    area.appendChild(wrap);
  }
  function ask(text) {
    speak(text, true);
    const note = document.createElement("p");
    note.className = "visual-note";
    note.textContent = text;
    area.appendChild(note);
  }
  function quiz(rounds) {
    let r = 0;
    function render() {
      area.innerHTML = "";
      if (r >= rounds.length) return;
      const q = rounds[r];
      ask(q.q);
      if (q.big) { const big = document.createElement("div"); big.className = "big-number"; big.textContent = q.big; area.appendChild(big); }
      cardRow(q.opts, (c, b) => {
        if (c.w === q.ans) {
          b.classList.add("right");
          fanfare();
          r += 1;
          if (r >= rounds.length) { speak(q.fact + " Animal expert!"); setTimeout(nextStage, 1900); }
          else { speak(q.fact); setTimeout(render, 1700); }
        } else {
          b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
          speak(q.hint || "Think like the animal! Where would IT want to live?");
        }
      });
    }
    render();
  }

  if (stage === 0) { // Habitats — where do they live?
    quiz([
      { q: "Where does a PENGUIN live?", big: "🐧", opts: [{ w: "Icy Antarctica", e: "🧊" }, { w: "Hot desert", e: "🏜️" }, { w: "Jungle trees", e: "🌴" }], ans: "Icy Antarctica", fact: "Penguins live where it's icy — their feathers are waterproof wetsuits!", hint: "Penguins love to swim in chilly water!" },
      { q: "Where does a CAMEL live?", big: "🐪", opts: [{ w: "The ocean", e: "🌊" }, { w: "Hot desert", e: "🏜️" }, { w: "Snowy mountains", e: "🏔️" }], ans: "Hot desert", fact: "Camels store fat in their humps and can go for weeks without water!", hint: "Camels are called ships of the DESERT!" },
      { q: "Where does a FROG live?", big: "🐸", opts: [{ w: "A pond", e: "💧" }, { w: "The desert", e: "🏜️" }, { w: "Outer space", e: "🚀" }], ans: "A pond", fact: "Frogs live near ponds — they begin life as tadpoles swimming in the water!", hint: "You coded a frog at the coding pond, remember?" },
      { q: "Where does a POLAR BEAR live?", big: "🐻‍❄️", opts: [{ w: "The sunny beach", e: "🏖️" }, { w: "The forest", e: "🌲" }, { w: "The icy Arctic", e: "❄️" }], ans: "The icy Arctic", fact: "Polar bears have see-through fur that only LOOKS white — and black skin underneath!", hint: "Brrr! Think of the coldest place on Earth!" }
    ]);
  }

  if (stage === 1) { // Animal groups — real collective nouns
    quiz([
      { q: "A group of WOLVES is called a…?", big: "🐺", opts: [{ w: "Pack" }, { w: "Flock" }, { w: "Herd" }], ans: "Pack", fact: "A PACK! Wolves hunt, play, and howl together as a family!", hint: "It rhymes with BACK!" },
      { q: "A group of ELEPHANTS is called a…?", big: "🐘", opts: [{ w: "School" }, { w: "Herd" }, { w: "Pack" }], ans: "Herd", fact: "A HERD! The oldest grandmother elephant leads and remembers where the water is!", hint: "Cows travel in one of these too!" },
      { q: "A group of FISH is called a…?", big: "🐟", opts: [{ w: "Flock" }, { w: "Pride" }, { w: "School" }], ans: "School", fact: "A SCHOOL of fish! They swirl together like one giant silver ribbon!", hint: "It's where YOU go to learn — fish go too!" },
      { q: "A group of LIONS is called a…?", big: "🦁", opts: [{ w: "Pride" }, { w: "Herd" }, { w: "Swarm" }], ans: "Pride", fact: "A PRIDE of lions! The lionesses do most of the hunting, together!", hint: "It also means feeling good about something you did well!" }
    ]);
  }

  if (stage === 2) { // Who am I? — animal riddles
    quiz([
      { q: "Who am I? I am the biggest land animal. I spray water with my long trunk, and my ears look like the shape of Africa!", opts: [{ w: "Elephant", e: "🐘" }, { w: "Hippo", e: "🦛" }, { w: "Horse", e: "🐴" }], ans: "Elephant", fact: "The ELEPHANT! Elephants comfort each other when they're sad — just like people.", hint: "Think of the animal with the trunk!" },
      { q: "Who am I? I sleep hanging upside down all day, and at night I fly using echoes to find my way!", opts: [{ w: "Owl", e: "🦉" }, { w: "Bat", e: "🦇" }, { w: "Bee", e: "🐝" }], ans: "Bat", fact: "The BAT — the only mammal that truly flies! Its ears 'see' with sound: echolocation!", hint: "This animal's ears do the seeing!" },
      { q: "Who am I? I have three hearts, blue blood, and I can change color to hide!", opts: [{ w: "Octopus", e: "🐙" }, { w: "Frog", e: "🐸" }, { w: "Penguin", e: "🐧" }], ans: "Octopus", fact: "The OCTOPUS! One of the smartest animals in the whole ocean!", hint: "Count its arms — there are eight!" },
      { q: "Who am I? I carry my home on my back, I move very slowly, and I might live to be 100 years old!", opts: [{ w: "Snail", e: "🐌" }, { w: "Turtle", e: "🐢" }, { w: "Crab", e: "🦀" }], ans: "Turtle", fact: "The TURTLE! Slow, patient, and strong — the Tao says the slow way can be the wise way.", hint: "Its home is a shell it never leaves!" }
    ]);
  }

  if (stage === 3) { // Baby animal names
    quiz([
      { q: "A baby BEAR is called a…?", big: "🐻", opts: [{ w: "Cub" }, { w: "Calf" }, { w: "Pup" }], ans: "Cub", fact: "A CUB! Bear babies, lion babies, and tiger babies are all called cubs!", hint: "It starts with C and rhymes with TUB!" },
      { q: "A baby COW is called a…?", big: "🐮", opts: [{ w: "Chick" }, { w: "Calf" }, { w: "Kit" }], ans: "Calf", fact: "A CALF! Elephant babies and whale babies are called calves too!", hint: "Elephants and whales share this baby name!" },
      { q: "A baby CHICKEN is called a…?", big: "🐔", opts: [{ w: "Chick" }, { w: "Cub" }, { w: "Fawn" }], ans: "Chick", fact: "A CHICK! Soft, yellow, and peeping — peep peep!", hint: "Listen: what sound does it make? Peep!" },
      { q: "A baby DEER is called a…?", big: "🦌", opts: [{ w: "Pup" }, { w: "Fawn" }, { w: "Joey" }], ans: "Fawn", fact: "A FAWN! And a baby kangaroo is a joey — it rides in its mother's pouch!", hint: "It has spots and wobbly legs!" }
    ]);
  }
}


// ===== EMBER'S STORY TALES (original interactive stories) =====
function talesStage(stage) {
  const area = $("stageArea");

  const STORIES = [
    {
      title: "The Little Star Who Was Afraid of the Dark",
      scenes: [
        { e: "⭐", text: "High above the garden lived Pip, a little star. Every morning, Pip shone happily. But every EVENING, when the sky grew dark… Pip trembled. “The dark is too big,” Pip whispered. “And I am so small.”",
          choices: [
            { label: "Hide behind a cloud ☁️", response: "Pip hid behind a soft cloud. “I can't see the dark from here,” Pip said. But the cloud was not a very good hiding place — a kind voice was already there…" },
            { label: "Twinkle anyway ✨", response: "Pip squeezed both eyes shut and twinkled as hard as possible. “If I shine bright enough,” Pip thought, “maybe the dark will seem smaller…”" }
          ] },
        { e: "🌙", text: "“Little star,” said the Moon, in her silver voice, “why do you tremble?” “I'm afraid of the dark,” said Pip. The Moon smiled. “Oh, my dear. The dark is not your enemy. The dark is the blanket that lets you REST — and the stage that lets you SHINE.”",
          choices: [
            { label: "Ask the Moon to stay 🌙", response: "“Will you stay near me?” asked Pip. “Always,” said the Moon. “Look around — you have never once been alone in the dark.”" },
            { label: "Look around the sky 👀", response: "Pip looked… and gasped. A million other stars were twinkling all around! “We were here the whole time,” they sang. “You were never alone in the dark.”" }
          ] },
        { e: "🦉", text: "Just then, wise old Owl floated past. “The dark brings the fireflies,” hooted Owl. “It brings dreams, and owls, and YOU. Nothing that shines can shine in the daytime, little star. This is YOUR time.”",
          question: { q: "Why did Pip stop being afraid?", opts: ["Friends were near, and the dark let him shine", "The dark went away forever", "Pip became the Sun"], ans: 0,
            teach: "That's right — friends were near, and Pip learned the dark is where stars get to shine." } },
        { e: "🌌", text: "So Pip took a deep breath — a dragon breath! — and twinkled. First one ray… then two… then ALL of them! And far below, in a garden, two children pointed up and said, “Look! That star is shining just for us!” The End. 💛 Moral: Sometimes the thing that scares us is exactly where we get to shine — and we are never, ever alone." }
      ]
    },
    {
      title: "The Seed Who Wanted to Hurry",
      scenes: [
        { e: "🌱", text: "Under the garden soil lived a tiny seed named Suki. Above the soil, flowers were blooming and bees were buzzing, and Suki called out, “HEY! I want to be a flower TODAY! Not tomorrow — TODAY!” So Suki pushed… and pushed… and pushed…",
          choices: [
            { label: "Push even harder! 💪", response: "Suki pushed until — pop! — a tiny root popped out the wrong way, upside down! “Oops,” said Suki. “Growing is harder than I thought.”" },
            { label: "Shout at the rain ☔", response: "“RAIN! Hurry up! SUN! Shine harder!” Suki shouted. But the rain fell when it fell, and the sun shone when it shone. They did not hurry for anyone." }
          ] },
        { e: "🌊", text: "A drop of river water trickled past. “Little seed,” bubbled the river, “I never hurry, and I travel the WHOLE world. Flowing is stronger than forcing. Rest. Drink. Your season is coming.” So Suki rested. Suki drank. Suki waited — through warm days and cool, quiet nights.",
          choices: [
            { label: "Rest and drink 💧", response: "Day by day, Suki softened. Day by day, Suki swelled. Something wonderful was happening inside, slowly, silently, in the dark — the way all important growing happens." },
            { label: "Peek at the flowers 🌼", response: "Through a crack in the soil, Suki peeked at the tall flowers. “Your turn is coming,” they whispered. “Every flower you see was once a seed that waited.”" }
          ] },
        { e: "🐢", text: "“How long must I wait?” Suki asked old Turtle, who was passing VERY slowly. Turtle smiled. “I have waited one hundred years for things,” he said, “and I have never once been late for my own life.”",
          question: { q: "What did Suki the seed learn?", opts: ["Good things grow in their own time", "Pushing harder always works", "Seeds don't need water"], ans: 0,
            teach: "Yes — good things grow in their own time. Flowing, like the river, is stronger than forcing." } },
        { e: "🌻", text: "And then one golden morning — crack! — Suki's shell opened. Up, up, up through the soil stretched a green shoot… and by summer, Suki stood taller than anyone: a SUNFLOWER, with a face full of sunshine and spirals of seeds. “I didn't hurry,” Suki laughed. “I GREW.” The End. 💛 Moral: You don't have to hurry to become who you are. Growing takes exactly as long as growing takes — and you are right on time." }
      ]
    }
  ];

  const story = STORIES[stage];
  let scene = 0;
  speak("Story time! " + story.title + ". Listen, choose, and live the story!", true);
  const title = document.createElement("p");
  title.className = "stage-msg";
  title.textContent = "📖 " + story.title;
  area.appendChild(title);
  const stageBox = document.createElement("div");
  area.appendChild(stageBox);

  function renderScene() {
    stageBox.innerHTML = "";
    const s = story.scenes[scene];
    const em = document.createElement("div");
    em.className = "big-number";
    em.textContent = s.e;
    stageBox.appendChild(em);
    const card = document.createElement("div");
    card.className = "story-card big-story";
    card.textContent = s.text;
    stageBox.appendChild(card);
    const listen = document.createElement("button");
    listen.type = "button";
    listen.className = "cmd-btn";
    listen.textContent = "🔊 Listen to the story";
    listen.addEventListener("click", () => speak(s.text));
    stageBox.appendChild(listen);
    speak(s.text);

    const controls = document.createElement("div");
    controls.className = "cmd-row";
    stageBox.appendChild(controls);

    if (s.choices) {
      s.choices.forEach(ch => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "cmd-btn";
        b.textContent = ch.label;
        b.addEventListener("click", () => {
          controls.innerHTML = "";
          const resp = document.createElement("div");
          resp.className = "story-card big-story";
          resp.textContent = ch.response;
          stageBox.appendChild(resp);
          speak(ch.response);
          const cont = document.createElement("button");
          cont.type = "button";
          cont.className = "cmd-btn cmd-go";
          cont.textContent = "Keep going ➡️";
          cont.addEventListener("click", () => { scene += 1; renderScene(); });
          controls.appendChild(cont);
          stageBox.appendChild(controls);
        });
        controls.appendChild(b);
      });
    } else if (s.question) {
      const q = s.question;
      const qEl = document.createElement("p");
      qEl.className = "stage-msg";
      qEl.textContent = q.q;
      stageBox.appendChild(qEl);
      speak(q.q);
      const wrap = document.createElement("div");
      wrap.className = "word-cards";
      q.opts.forEach((o, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "word-card";
        b.innerHTML = `<span class="wc-word sm">${o}</span>`;
        b.addEventListener("click", () => {
          if (i === q.ans) {
            b.classList.add("right");
            fanfare();
            speak(q.teach);
            controls.innerHTML = "";
            const cont = document.createElement("button");
            cont.type = "button";
            cont.className = "cmd-btn cmd-go";
            cont.textContent = "Keep going ➡️";
            cont.addEventListener("click", () => { scene += 1; renderScene(); });
            controls.appendChild(cont);
          } else {
            b.classList.remove("wobble"); void b.offsetWidth; b.classList.add("wobble");
            speak("Think about the story, story detective!");
          }
        });
        wrap.appendChild(b);
      });
      stageBox.appendChild(wrap);
    } else {
      const fin = document.createElement("button");
      fin.type = "button";
      fin.className = "cmd-btn cmd-go";
      fin.textContent = "💛 Finish the Story";
      fin.addEventListener("click", () => { fanfare(); setTimeout(nextStage, 900); });
      controls.appendChild(fin);
    }
  }
  renderScene();
}


// ===== Wiring =====
// The front page spells the CURRENT player's name in tappable letters —
// KLAUSAIYAN for Klaus, SOPHIA for Princess Sophia. Tapping the letters in
// order lights them up and earns a name fanfare.
function renderNameLetters() {
  const wrap = $("nameLetters");
  if (!wrap) return;
  wrap.innerHTML = "";
  const name = playerId === "klaus" ? "KLAUSAIYAN" : "SOPHIA";
  let expected = 0;
  name.split("").forEach((letter, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "name-letter";
    b.textContent = letter;
    b.addEventListener("click", () => {
      chime(i % SCALE.length);
      if (i === expected) {
        b.classList.add("lit");
        expected += 1;
        if (expected >= name.length) {
          fanfare();
          speak(name + "! That's YOUR name, " + player().hero + "! And you are so loved!");
          expected = 0;
          setTimeout(() => wrap.querySelectorAll(".name-letter").forEach(x => x.classList.remove("lit")), 2400);
        } else speak("Letter " + letter + "!");
      } else speak("Letter " + letter + "!");
    });
    wrap.appendChild(b);
  });
}

// ===== Player profiles: tap a name on the title page to switch =====
function renderPlayerUI() {
  tg("playerKlaus", "active", playerId === "klaus");
  tg("playerSophia", "active", playerId === "sophia");
  renderNameLetters();
  const title = $("gameTitle");
  if (title) title.textContent = playerId === "klaus" ? "Klausaiyan" : "Sophia";
  const g = $("playerGreeting");
  if (g) g.textContent = playerId === "klaus"
    ? "Klaus's garden: advanced missions — Rocket Math, Geometry Lab, Star Scientist, DJ Studio PRO!"
    : "Princess Sophia's garden: Rainbow Meadow, horses, colors and counting — her gems save separately!";
  const st = $("storyText");
  if (st) st.innerHTML = playerId === "klaus"
    ? "Ember the dragon is waiting for you, Klausaiyan!<br>The garden flowers fell asleep. Only a shape hero can wake them up…<br>And remember — you are loved, exactly as you are. 💛"
    : "Ember the dragon is waiting for you, Princess Sophia!<br>The Rainbow Meadow is sleepy — the horses need your colors to wake it up…<br>And remember — you are loved, exactly as you are. 💛";
}
function switchPlayer(id) {
  if (!PLAYERS[id] || id === playerId) { renderPlayerUI(); return; }
  stopSeq();
  playerId = id;
  try { localStorage.setItem("klausaiyanPlayer", id); } catch (e) {}
  gems = loadGems();
  discoveredFacts = loadFacts();
  current = null;
  renderPlayerUI();
  renderMap();
  show("screenTitle");
  speak("Hello, " + player().hero + "! This is YOUR garden!");
}
wire("playerKlaus", () => switchPlayer("klaus"));
wire("playerSophia", () => switchPlayer("sophia"));

wire("playBtn", () => {
  tone(660, 0, 0.2);
  renderMap();
  show("screenMap");
  speak("Hello, " + player().hero + "! Choose a world, hero!");
});
wire("worldCircle", () => startLevel("circle"));
wire("worldHex", () => startLevel("hex"));
wire("worldPlanet", () => startLevel("planet"));
wire("worldTriangle", () => startLevel("triangle"));
wire("worldSquare", () => startLevel("square"));
wire("worldSpiral", () => startLevel("spiral"));
wire("worldMatch", () => startLevel("match"));
wire("worldFrog", () => startLevel("frog"));
wire("worldDJ", () => startLevel("dj"));
wire("worldKeys", () => startLevel("keys"));
wire("worldMath", () => startLevel("math"));
wire("worldRead", () => startLevel("read"));
wire("worldSophia", () => startLevel("sophia"));
wire("worldGeo", () => startLevel("geo"));
wire("worldRocket", () => startLevel("rocket"));
wire("worldWizard", () => startLevel("wizard"));
wire("worldStars", () => startLevel("stars"));
wire("worldZen", () => startLevel("zen"));
wire("worldAnimals", () => startLevel("animals"));
wire("worldTales", () => startLevel("tales"));
wire("worldDiscover", () => openDiscover());
wire("discoverBack", () => { renderMap(); show("screenMap"); });
wire("homeBtn", () => {
  current = null;
  try { speechSynthesis.cancel(); } catch (e) {}
  renderPlayerUI();
  show("screenTitle");
  speak("Home! Hello, " + player().hero + "!");
});
wire("worldFlower", () => {
  if (!allWorldsDone() && !gems.flower) {
    tone(300, 0, 0.15);
    speak("The Great Flower is still sleeping. Wake all six worlds first, hero!");
    return;
  }
  startLevel("flower");
});
wire("backToMap", () => {
  current = null;
  try { speechSynthesis.cancel(); } catch (e) {}
  renderMap();
  show("screenMap");
});
wire("repeatBtn", () => {
  if (lastInstruction) speak(lastInstruction, true);
  else speak("You can do it, hero!");
});
wire("celebrateBtn", () => {
  $("celebrate").classList.add("hidden");
  renderMap();
  show("screenMap");
});
wire("muteBtn", () => {
  muted = !muted;
  $("muteBtn").textContent = muted ? "🔇" : "🔊";
  if (muted) { try { speechSynthesis.cancel(); } catch (e) {} }
});
wire("resetBtn", () => {
  // Reset clears ONLY the current player's gems — the other child's garden is safe.
  gems = {};
  saveGems();
  renderMap();
  show("screenMap");
  speak("A brand new garden for " + player().short + "! Let's play!");
});

renderPlayerUI();
renderMap();
