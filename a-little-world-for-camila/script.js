const $ = id => document.getElementById(id);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = {
  get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } },
  set(k,v){ try { localStorage.setItem(k,v); } catch(e){} },
  del(k){ try { localStorage.removeItem(k); } catch(e){} }
};

/* ---------- Page navigation (with #hash links) ---------- */
const pages = [...document.querySelectorAll('.panel')].map(p => p.id);
const navButtons = document.querySelectorAll('nav button');
function showPage(id, push = true){
  if(!pages.includes(id)) id = 'home';
  navButtons.forEach(b => {
    const on = b.dataset.page === id;
    b.classList.toggle('active', on);
    if(on){ b.setAttribute('aria-current','page'); b.scrollIntoView({inline:'center',block:'nearest',behavior:reduceMotion?'auto':'smooth'}); }
    else b.removeAttribute('aria-current');
  });
  document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === id));
  if(push && location.hash !== '#' + id) history.pushState(null, '', '#' + id);
  window.scrollTo({top:0, behavior:'auto'});
  if(id === 'little-things') measureRoad();
}
navButtons.forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.page)));
document.querySelectorAll('[data-go]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); showPage(el.dataset.go); }));
window.addEventListener('popstate', () => showPage(location.hash.slice(1), false));
if(location.hash) showPage(location.hash.slice(1), false);

/* ---------- Falling lily & spider-lily petals ---------- */
(function makePetals(){
  if(reduceMotion) return;
  const box = $('petals');
  const count = window.innerWidth < 600 ? 12 : 22;
  for(let i = 0; i < count; i++){
    const p = document.createElement('span');
    p.className = 'petal' + (i % 3 === 0 ? ' silver' : '') + (i % 4 === 1 ? ' thin' : '');
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = 11 + Math.random() * 14 + 's';
    p.style.animationDelay = -Math.random() * 20 + 's';
    p.style.setProperty('--sway', (Math.random() * 160 - 80) + 'px');
    p.style.setProperty('--spin', (Math.random() * 720 - 360) + 'deg');
    p.style.scale = (0.6 + Math.random() * 0.8).toFixed(2);
    box.appendChild(p);
  }
})();

/* ---------- Welcome: hidden star ---------- */
const starNotes = [
  'You found a hidden star. Just like I found you. ✧',
  'Fun fact: you’re my favourite notification.',
  'Okay, last one: you look really cute when you laugh.'
];
let starIdx = 0;
$('hiddenStar').onclick = () => { $('starNote').textContent = starNotes[starIdx % starNotes.length]; starIdx++; };

/* ---------- The question (existing feature) ---------- */
function celebrate(){
  if(reduceMotion) return;
  const box = $('celebrate');
  const bits = ['♡','💗','🌸','🖤','🎀','✦','💕','🌹'];
  for(let i = 0; i < 46; i++){
    const s = document.createElement('span');
    s.className = 'burst';
    s.textContent = bits[i % bits.length];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.fontSize = 16 + Math.random() * 22 + 'px';
    s.style.setProperty('--dx', (Math.random() * 200 - 100) + 'px');
    s.style.setProperty('--dy', -(60 + Math.random() * 50) + 'vh');
    s.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
    s.style.setProperty('--t', 2.2 + Math.random() * 2 + 's');
    s.style.animationDelay = Math.random() * .6 + 's';
    box.appendChild(s);
    setTimeout(() => s.remove(), 5200);
  }
}
$('yes').onclick = () => {
  $('reply').innerHTML = 'You just made me really happy, Camila! 💖<br><small>Now go check the countdown. We have a date to plan.</small>';
  $('reply').classList.add('show');
  celebrate();
};
$('think').onclick = () => {
  $('reply').textContent = "That's completely okay. Take your time, no pressure at all. 💗";
  $('reply').classList.add('show');
};

/* ---------- Poster (existing feature) ---------- */
function updatePoster(){ $('posterName').textContent = $('nameInput').value.trim().toUpperCase() || 'CAMILA'; $('posterText').textContent = $('posterInput').value; }
$('nameInput').addEventListener('input', updatePoster);
$('posterInput').addEventListener('input', updatePoster);
$('resetPoster').onclick = () => { $('nameInput').value = 'Camila'; $('posterInput').value = 'You make ordinary days feel a little more special.'; updatePoster(); };

/* ---------- Letter (existing feature + saved edits + envelope) ---------- */
const suggestedLetter = `Dear Camila,

I wanted to make something a little special for you, because there's something I've been wanting to ask. I really enjoy talking with you, spending time with you, and getting to know you. You have a way of making my days brighter, and I treasure the little moments we share.

I love how you light up talking about the things you care about: the anime you're watching, FNAF lore that somehow always gets deeper, the LEGO sets you'd build, motorcycles, and that perfect mix of Hello Kitty sweetness and Kuromi mischief. Every one of those things is so you, and I like all of it.

You're a wonderful person, and I'd love the chance to make more happy memories together. I don't want you to feel pressured to answer a certain way. I just wanted to be honest about how I feel and ask you properly.

So here's my question: would you like to be my girlfriend?

Whatever your answer is, thank you for taking the time to read this. You deserve kindness, honesty, and happiness, always.

From,
Someone who thinks you're pretty special 💗`;
$('letterInput').value = store.get('camila-letter') || suggestedLetter;
function updateLetter(){ $('letterPreview').textContent = $('letterInput').value; }
$('updateLetter').onclick = () => {
  updateLetter();
  if($('letterInput').value === suggestedLetter) store.del('camila-letter'); else store.set('camila-letter', $('letterInput').value);
  $('envelope').classList.add('open'); $('openEnvelope').setAttribute('aria-expanded','true');
};
$('resetLetter').onclick = () => { $('letterInput').value = suggestedLetter; store.del('camila-letter'); updateLetter(); };
$('copyLetter').onclick = async () => {
  try { await navigator.clipboard.writeText($('letterInput').value); }
  catch(e){ $('letterInput').select(); document.execCommand('copy'); }
  $('copyLetter').textContent = 'Copied! 💗';
  setTimeout(() => $('copyLetter').textContent = 'Copy letter', 2200);
};
updateLetter();
$('openEnvelope').onclick = () => { $('envelope').classList.add('open'); $('openEnvelope').setAttribute('aria-expanded','true'); };

/* ---------- Secret message (existing feature) ---------- */
$('reveal').onclick = () => {
  const open = $('secretText').classList.toggle('show');
  $('reveal').closest('.secret').classList.toggle('open', open);
  $('reveal').setAttribute('aria-expanded', String(open));
  $('reveal').textContent = open ? 'Hide my message' : 'Open my secret message';
};

/* ---------- Countdown (existing feature + tiles + remembered date) ---------- */
let countdownTimer;
function renderCountdown(){
  const box = $('countdown');
  const target = new Date($('dateInput').value).getTime();
  if(!Number.isFinite(target)){ box.innerHTML = '<p class="count-empty">Choose a date above ♡</p>'; clearInterval(countdownTimer); return; }
  let diff = target - Date.now();
  if(diff <= 0){ box.innerHTML = '<p class="count-done">It’s date time!</p>'; clearInterval(countdownTimer); return; }
  const d = Math.floor(diff / 86400000); diff %= 86400000;
  const h = Math.floor(diff / 3600000); diff %= 3600000;
  const m = Math.floor(diff / 60000); const s = Math.floor(diff % 60000 / 1000);
  const tile = (n, l) => `<div class="tile"><b>${String(n).padStart(2,'0')}</b><small>${l}</small></div>`;
  box.innerHTML = `<div class="tiles" role="timer" aria-label="${d} days, ${h} hours, ${m} minutes left">${tile(d,'days')}${tile(h,'hours')}${tile(m,'mins')}${tile(s,'secs')}</div>`;
}
function startCountdown(){
  clearInterval(countdownTimer);
  renderCountdown();
  countdownTimer = setInterval(renderCountdown, 1000);
}
$('dateInput').addEventListener('input', () => {
  if($('dateInput').value) store.set('camila-date', $('dateInput').value); else store.del('camila-date');
  startCountdown();
});
const savedDate = store.get('camila-date');
if(savedDate){ $('dateInput').value = savedDate; startCountdown(); }

/* ---------- Little tune (existing feature) ---------- */
let audioCtx = null, oscillators = [], musicOn = false, musicTimer;
function playTune(){
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if(!AudioContext){ $('musicNote').textContent = 'This browser does not support the little tune.'; return; }
  if(musicOn){ oscillators.forEach(o => { try { o.stop(); } catch(e){} }); oscillators = []; musicOn = false; clearTimeout(musicTimer); $('musicButton').textContent = 'Play a little tune ♪'; return; }
  audioCtx = audioCtx || new AudioContext(); audioCtx.resume();
  const notes = [523.25,659.25,783.99,659.25,587.33,659.25,523.25,392.00,523.25];
  const step = .34;
  notes.forEach((freq, i) => {
    const t = audioCtx.currentTime + i * step;
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(.07, t + .04);
    gain.gain.exponentialRampToValueAtTime(.001, t + .3);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(t); osc.stop(t + .32); oscillators.push(osc);
  });
  musicOn = true; $('musicButton').textContent = 'Stop the tune ■';
  musicTimer = setTimeout(() => { musicOn = false; $('musicButton').textContent = 'Play a little tune ♪'; oscillators = []; }, notes.length * step * 1000 + 300);
}
$('musicButton').onclick = playTune;

/* ---------- Little things: shared helper ---------- */
function swapText(el, text){
  el.classList.add('fade');
  setTimeout(() => { el.textContent = text; el.classList.remove('fade'); }, 250);
}

/* Anime: episodes */
const episodes = [
  'If our story were an anime, this would be the slow-motion episode. Petals in the wind, the soundtrack swelling…',
  'Episode 2: the part where I pretend I’m not nervous, but the background is literally full of sparkles.',
  'Episode 3: the filler episode where we just hang out, eat snacks and talk for hours. Everyone’s favourite.',
  'Episode 4: the confession arc. You already know how this one goes. ♡',
  'Season finale: to be continued… together, I hope.'
];
let ep = 0;
$('animeBtn').onclick = e => {
  ep = (ep + 1) % episodes.length;
  swapText($('animeText'), episodes[ep]);
  $('animeBtn').textContent = ep === episodes.length - 1 ? 'Rewatch from the start ↺' : 'Next episode ▸';
  if(reduceMotion) return;
  const card = e.target.closest('.thing');
  for(let i = 0; i < 10; i++){
    const s = document.createElement('span');
    s.className = 'sparkle'; s.textContent = i % 2 ? '✦' : '✧';
    s.style.left = 30 + Math.random() * 60 + 'px'; s.style.bottom = '30px';
    s.style.setProperty('--dx', (Math.random() * 120 - 30) + 'px');
    s.style.setProperty('--dy', -(30 + Math.random() * 80) + 'px');
    card.appendChild(s); setTimeout(() => s.remove(), 1100);
  }
};

/* FNAF: flashlight + survive until 6 AM */
const fnaf = $('fnafCard'), room = $('fnafRoom');
let fnafTimer = null, hour = 0;
function moveLight(e){
  const r = room.getBoundingClientRect();
  room.style.setProperty('--x', (e.clientX - r.left) + 'px');
  room.style.setProperty('--y', (e.clientY - r.top) + 'px');
}
room.addEventListener('pointermove', moveLight);
room.addEventListener('pointerdown', moveLight);
$('flashBtn').onclick = () => {
  const on = !fnaf.classList.contains('lit');
  fnaf.classList.toggle('lit', on);
  $('flashBtn').setAttribute('aria-pressed', String(on));
  $('flashBtn').textContent = on ? '🔦 Flashlight off' : '🔦 Flashlight on';
  if(on && !fnafTimer && !fnaf.classList.contains('won')){
    fnafTimer = setInterval(() => {
      hour++;
      $('fnafClock').textContent = hour + ' AM';
      if(hour >= 6){
        clearInterval(fnafTimer); fnafTimer = null;
        fnaf.classList.add('won');
        $('fnafClock').textContent = '6 AM ✓';
      }
    }, 1100);
  }
};

/* LEGO: build a little tower */
const brickColors = ['#c0213f','#9a73c9','#d7dae3','#4a0c1d','#ff6f88','#2c1240'];
let bricks = 0;
$('brickBtn').onclick = () => {
  const stage = $('brickStage');
  if(bricks >= 6){
    stage.innerHTML = ''; bricks = 0;
    $('legoText').textContent = 'Let’s build something together, one brick at a time.';
    $('brickBtn').textContent = 'Add a brick +';
    $('brickCount').textContent = '0 / 6';
    stage.closest('.thing').classList.remove('done');
    return;
  }
  const b = document.createElement('div');
  b.className = 'brick';
  b.style.background = brickColors[bricks];
  b.style.color = brickColors[bricks];
  stage.appendChild(b);
  bricks++;
  $('brickCount').textContent = bricks + ' / 6';
  if(bricks === 6){
    stage.closest('.thing').classList.add('done');
    swapText($('legoText'), 'Some pieces just click. You and me? Perfect fit, no instructions needed.');
    $('brickBtn').textContent = 'Build it again ↺';
  }
};

/* Motorcycle: ride across */
const motoLines = [
  'Helmet on, hold on tight. Wherever the road goes, I want you on the back seat.',
  'Sunset ride, open road, your arms around me. That’s the dream.',
  'Fast bikes are cool. You’re cooler.'
];
let moto = 0;
function measureRoad(){
  const road = document.querySelector('.road');
  if(road && road.offsetWidth) road.style.setProperty('--road', road.offsetWidth + 'px');
}
window.addEventListener('resize', measureRoad);
$('revBtn').onclick = () => {
  const card = $('revBtn').closest('.thing');
  measureRoad();
  card.classList.remove('riding'); void card.offsetWidth; card.classList.add('riding');
  swapText($('motoText'), motoLines[moto++ % motoLines.length]);
  setTimeout(() => card.classList.remove('riding'), 2600);
};

/* Hello Kitty & Kuromi: sweet / spooky */
const kittyLines = {
  sweet: ['Your Hello Kitty side: soft, kind, the kind of sweet that makes everyone around you feel safe.','🎀', 'sweet'],
  spooky: ['Your Kuromi side: a little chaotic, a little mischievous, totally iconic. Honestly? I adore both.','🖤', 'spooky']
};
document.querySelectorAll('.switch button').forEach(btn => btn.addEventListener('click', () => {
  const mode = btn.dataset.mode;
  document.querySelectorAll('.switch button').forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-pressed', String(b === btn)); });
  $('kittyCard').dataset.mode = mode;
  $('kittyIcon').textContent = kittyLines[mode][1];
  swapText($('kittyText'), kittyLines[mode][0]);
}));
