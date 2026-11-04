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
    celebrateText: "Ember says: You found the circles, counted the stars, and read the word MOON!" },
  hex: { title: "Hexagon Honeycomb", stages: 4, gem: "🍯", celebrateEmoji: "🐝",
    celebrateText: "Ember says: You KNOW the hexagon now — six sides! And the bees have their honeycomb!" },
  planet: { title: "Planet Parade", stages: 2, gem: "🪐", celebrateEmoji: "🚀",
    celebrateText: "Ember says: What a countdown! You visited the planets like a real space hero!" }
};

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
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1.12;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch (e) {}
}

// ===== Screens =====
function show(id) {
  ["screenTitle", "screenMap", "screenLevel"].forEach(s => $(s).classList.toggle("hidden", s !== id));
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
  const fn = { circle: circleStage, hex: hexStage, planet: planetStage }[key];
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
  $("celebrate").classList.remove("hidden");
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
          if (found >= 5) { speak("You found five circles! Amazing!"); setTimeout(nextStage, 1000); }
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
    speak("Tap each planet, and say hello!", true);
    const planets = [
      { name: "Earth", fact: "Earth! Our home!", emoji: "🌍", size: 96 },
      { name: "Mars", fact: "Mars! The red planet!", color: "#ff6b57", size: 78 },
      { name: "Jupiter", fact: "Jupiter! The biggest planet!", color: "#ffb84d", size: 122 },
      { name: "Saturn", fact: "Saturn! It has beautiful rings!", emoji: "🪐", size: 108 }
    ];
    let visited = 0;
    const row = document.createElement("div");
    row.className = "planet-row";
    planets.forEach(p => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "planet";
      const ball = document.createElement("span");
      ball.className = "p-ball";
      ball.style.width = p.size + "px";
      ball.style.height = p.size + "px";
      if (p.emoji) { ball.textContent = p.emoji; ball.style.fontSize = (p.size * 0.82) + "px"; }
      else ball.style.background = `radial-gradient(circle at 35% 32%, #ffffff88, ${p.color} 55%)`;
      const label = document.createElement("span");
      label.textContent = p.name;
      b.appendChild(ball);
      b.appendChild(label);
      b.addEventListener("click", () => {
        if (!b.classList.contains("visited")) {
          b.classList.add("visited");
          visited += 1;
          chime(visited + 2);
          if (visited >= planets.length) {
            speak(p.fact + " You visited ALL the planets!");
            setTimeout(nextStage, 1400);
            return;
          }
        }
        speak(p.fact);
      });
      row.appendChild(b);
    });
    area.appendChild(row);
  }
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
