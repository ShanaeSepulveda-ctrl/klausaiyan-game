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
  planet: { title: "Planet Parade", stages: 3, gem: "🪐", celebrateEmoji: "🚀",
    celebrateText: "Ember says: What a countdown! You met ALL the planets and counted to TEN like a real space hero!" },
  triangle: { title: "Triangle Mountain", stages: 4, gem: "🔺", celebrateEmoji: "⛰️",
    celebrateText: "Ember says: Triangles are the STRONGEST shape — that's why mountains and bridges wear them!" },
  square: { title: "Square Dino Home", stages: 4, gem: "🦖", celebrateEmoji: "🦖",
    celebrateText: "Ember says: Squares stack and build ANYTHING — houses, towers, whole cities of blocks!" },
  spiral: { title: "Spiral Shell Beach", stages: 4, gem: "🐚", celebrateEmoji: "🌀",
    celebrateText: "Ember says: Spirals hide in shells and sunflowers — and whole GALAXIES swirl like spirals in space!" },
  flower: { title: "The Great Flower", stages: 1, gem: "🌸", celebrateEmoji: "🌸",
    celebrateText: "Ember says: You grew the Flower of Life — circles holding hands! You are a true Geometry Garden hero, Klausaiyan!" },
  match: { title: "Match Quest", stages: 3, gem: "🧩", celebrateEmoji: "🧩",
    celebrateText: "Ember says: Shadow matcher, number matcher, word matcher — you matched them ALL!" },
  frog: { title: "Frog Coding Pond", stages: 2, gem: "🐸", celebrateEmoji: "🐸",
    celebrateText: "Ember says: You are a CODER now! You told the frog exactly what to do — and it worked!" }
};

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
  frog: "🌟 Show & Tell Mission: give someone three instructions — hop, spin, hop — and watch them follow YOUR code!"
};

const WORLD_KEYS = ["circle", "hex", "planet", "triangle", "square", "spiral"];
function allWorldsDone() { return WORLD_KEYS.every(k => gems[k]); }

function loadGems() {
  try { return JSON.parse(localStorage.getItem("klausaiyanGems")) || {}; }
  catch (e) { return {}; }
}
function saveGems() {
  try { localStorage.setItem("klausaiyanGems", JSON.stringify(gems)); } catch (e) {}
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

function speak(text, isInstruction = false) {
  if (isInstruction) {
    lastInstruction = text;
    $("stageMsg").textContent = text;
  }
  if (muted) return;
  try {
    // The screen shows "Klausaiyan", but the voice says it the way Mommy says it:
    // "Klouse" (rhymes with house) + "Say-yen" (the end of Saiyan, Dragon Ball Z style).
    const spoken = text.replace(/Klausaiyan/g, "Klouse Say-yen");
    const u = new SpeechSynthesisUtterance(spoken);
    u.rate = 0.95;
    u.pitch = 1.12;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch (e) {}
}

// ===== Screens =====
function show(id) {
  ["screenTitle", "screenMap", "screenLevel", "screenDiscover"].forEach(s => $(s).classList.toggle("hidden", s !== id));
}

function renderMap() {
  const keys = Object.keys(LEVELS);
  $("gemRow").innerHTML = keys.map(k =>
    `<span class="gem${gems[k] ? " earned" : ""}">${LEVELS[k].gem}</span>`).join("");
  const earned = keys.filter(k => gems[k]).length;
  $("gardenBed").textContent = earned === 0 ? "🌱 🌱 🌱" : "🌸🌼".repeat(earned) + "🌷";
  $("worldCircle").classList.toggle("done", !!gems.circle);
  $("worldHex").classList.toggle("done", !!gems.hex);
  $("worldPlanet").classList.toggle("done", !!gems.planet);
  $("worldTriangle").classList.toggle("done", !!gems.triangle);
  $("worldSquare").classList.toggle("done", !!gems.square);
  $("worldSpiral").classList.toggle("done", !!gems.spiral);
  $("worldFlower").classList.toggle("done", !!gems.flower);
  $("worldFlower").classList.toggle("sleeping", !allWorldsDone() && !gems.flower);
  $("flowerHint").textContent = gems.flower ? "Bloomed! 🌸" : allWorldsDone() ? "Tap to bloom!" : "Wake all 6 worlds first…";
  $("worldMatch").classList.toggle("done", !!gems.match);
  $("worldFrog").classList.toggle("done", !!gems.frog);
  $("factLine").textContent = discoveredFacts.size > 0
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
function startLevel(key) {
  current = { key, stage: 0 };
  show("screenLevel");
  $("levelTitle").textContent = LEVELS[key].title;
  renderStage();
}

function renderStage() {
  const { key, stage } = current;
  const total = LEVELS[key].stages;
  $("stageDots").textContent = "● ".repeat(stage + 1) + "○ ".repeat(total - stage - 1);
  $("stageArea").innerHTML = "";
  const fn = { circle: circleStage, hex: hexStage, planet: planetStage,
    triangle: triangleStage, square: squareStage, spiral: spiralStage, flower: flowerStage,
    match: matchStage, frog: frogStage }[key];
  fn(stage);
}

function nextStage() {
  if (!current) return;
  sparkles();
  current.stage += 1;
  if (current.stage >= LEVELS[current.key].stages) completeLevel();
  else setTimeout(renderStage, 650);
}

function completeLevel() {
  const key = current.key;
  gems[key] = true;
  saveGems();
  fanfare();
  $("celebrateEmoji").textContent = LEVELS[key].celebrateEmoji;
  $("celebrateTitle").textContent = "You did it, Klausaiyan!";
  $("celebrateText").textContent = LEVELS[key].celebrateText;
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
  speak("You did it, Klausaiyan! " + LEVELS[key].celebrateText);
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
  { e: "\uD83D\uDC09", n: "Ember", facts: ["I am Ember, your dragon guide!", "In stories, dragons guard treasure \u2014 I guard YOUR garden!", "Tell someone a fact you learned today, hero!"] }
];

function loadFacts() {
  try { return new Set(JSON.parse(localStorage.getItem("klausaiyanFacts")) || []); }
  catch (e) { return new Set(); }
}
function saveFacts() {
  try { localStorage.setItem("klausaiyanFacts", JSON.stringify([...discoveredFacts])); } catch (e) {}
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
}

// ===== FROG CODING POND =====
function frogStage(stage) {
  const area = $("stageArea");
  const cfg = stage === 0
    ? { cells: 5, target: 4, big: false,
        intro: "You are the CODER! Tap HOP to write code for the frog. Then press GO!" }
    : { cells: 7, target: 6, big: true,
        intro: "A bigger pond! Use HOP and BIG JUMP to code the frog to the fly!" };
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
  const ICONS = { hop: "\u27A1\uFE0F", big: "\u23EB", spin: "\uD83C\uDF00" };

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
  makeBtn("\u21BA Clear", "", () => { if (!running) { code = []; renderCode(); tone(300, 0, 0.12); } });
  makeBtn("\u25B6\uFE0F GO!", "cmd-go", () => {
    if (running || code.length === 0) { if (!running) speak("Write some code first, coder! Tap HOP!"); return; }
    running = true;
    let pos = 0;
    frog.style.left = "3px";
    let i = 0;
    speak("Running your code!");
    function step() {
      if (i >= code.length) {
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
      const c = code[i];
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


// ===== Wiring =====
"KLAUSAIYAN".split("").forEach((letter, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "name-letter";
  b.textContent = letter;
  b.addEventListener("click", () => { chime(i % SCALE.length); speak("Letter " + letter + "!"); });
  $("nameLetters").appendChild(b);
});

$("playBtn").addEventListener("click", () => {
  tone(660, 0, 0.2);
  renderMap();
  show("screenMap");
  speak("Hello, Klausaiyan! Choose a world, hero!");
});
$("worldCircle").addEventListener("click", () => startLevel("circle"));
$("worldHex").addEventListener("click", () => startLevel("hex"));
$("worldPlanet").addEventListener("click", () => startLevel("planet"));
$("worldTriangle").addEventListener("click", () => startLevel("triangle"));
$("worldSquare").addEventListener("click", () => startLevel("square"));
$("worldSpiral").addEventListener("click", () => startLevel("spiral"));
$("worldMatch").addEventListener("click", () => startLevel("match"));
$("worldFrog").addEventListener("click", () => startLevel("frog"));
$("worldDiscover").addEventListener("click", () => openDiscover());
$("discoverBack").addEventListener("click", () => { renderMap(); show("screenMap"); });
$("homeBtn").addEventListener("click", () => {
  current = null;
  try { speechSynthesis.cancel(); } catch (e) {}
  show("screenTitle");
  speak("Home! Hello, Klausaiyan!");
});
$("worldFlower").addEventListener("click", () => {
  if (!allWorldsDone() && !gems.flower) {
    tone(300, 0, 0.15);
    speak("The Great Flower is still sleeping. Wake all six worlds first, hero!");
    return;
  }
  startLevel("flower");
});
$("backToMap").addEventListener("click", () => {
  current = null;
  try { speechSynthesis.cancel(); } catch (e) {}
  renderMap();
  show("screenMap");
});
$("repeatBtn").addEventListener("click", () => {
  if (lastInstruction) speak(lastInstruction, true);
  else speak("You can do it, hero!");
});
$("celebrateBtn").addEventListener("click", () => {
  $("celebrate").classList.add("hidden");
  renderMap();
  show("screenMap");
});
$("muteBtn").addEventListener("click", () => {
  muted = !muted;
  $("muteBtn").textContent = muted ? "🔇" : "🔊";
  if (muted) { try { speechSynthesis.cancel(); } catch (e) {} }
});
$("resetBtn").addEventListener("click", () => {
  gems = {};
  saveGems();
  renderMap();
  show("screenMap");
  speak("A brand new garden! Let's play!");
});

renderMap();
