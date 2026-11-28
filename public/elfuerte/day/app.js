// The day as chapters that slide over one another, with the schedule along the foot.
// Everything that moves inside a chapter is driven by the scroll position.
const $ = s => document.querySelector(s);
const clamp = v => Math.min(1, Math.max(0, v));
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
$('#logo').src = LOGO; $('#book').href = BOOK;

const scenes = DAY.map((a, n) => {
  const s = scene(a, n), slot = document.createElement('section'), last = n === DAY.length - 1;
  slot.className = 'slot'; slot.id = a.id; slot.append(s.root); $('#day').append(slot);
  // one screen to arrive, `len` to play, one screen while the next chapter covers it
  if (!still) slot.style.height = `${a.len + (last ? 100 : 200)}svh`;
  const play = () => slot.offsetHeight - innerHeight * (last ? 1 : 2);
  const ui = { still, seek: p => scrollTo({ top: slot.offsetTop + p * play(), behavior: still ? 'instant' : 'smooth' }) };
  const fx = a.fx ? FX[a.fx](s, a, ui) : null;
  return { ...s, slot, fx, play: go => { s.play(go); fx?.play?.(go); }, span: play };
});
const list = $('#hours');
list.innerHTML = DAY.map(a => `<li><a href="#${a.id}"><time>${a.time}</time><span>${a.name}</span></a></li>`).join('');
const links = [...list.querySelectorAll('a')];
// pictures are fetched a chapter ahead, so nothing is still loading when it arrives
const warm = i => [i, i + 1, i + 2].forEach(k => scenes[k]?.root.querySelectorAll('img[loading=lazy]').forEach(m => m.loading = 'eager'));

// The hotel's mark: large in the middle while the blind is shut, at home in the corner while the day runs.
const logo = $('#logo'), home = $('.brand'), night = scenes.length - 1;
const ease = t => (t = clamp(t), t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
function mark(k, evening) {
  const sideways = innerHeight <= 520 && innerWidth > innerHeight, narrow = !sideways && innerWidth <= 860, from = home.getBoundingClientRect();
  const w = narrow ? innerWidth * .72 : Math.min(innerWidth * (sideways ? .36 : .32), 560), h = w * from.height / from.width;
  const cx = innerWidth * (sideways ? .62 : .5), cy = innerHeight * (narrow ? (evening ? .24 : .32) : .43);
  logo.style.width = from.width + (w - from.width) * k + 'px';
  logo.style.left = from.left + (cx - w / 2 - from.left) * k + 'px';
  logo.style.top = from.top + (cy - h / 2 - from.top) * k + 'px';
}

let current = -1, queued = false;
function frame() {
  queued = false;
  const vh = innerHeight;
  let now = 0, done = 0, opening = 0, closing = 0;
  scenes.forEach((s, i) => {
    const r = s.slot.getBoundingClientRect(), p = still ? s.fx?.rest ?? 0 : clamp(-r.top / Math.max(1, s.span()));
    if (r.top <= vh * .5) { now = i; done = p; }
    if (!i) opening = p;
    if (i === night) closing = p;
    if (r.bottom < -vh * .2 || r.top > vh * 1.2) return s.play(false);
    const enter = still ? 1 : clamp(1 - r.top / vh);
    s.root.style.setProperty('--enter', enter.toFixed(4));                                         // arriving over the one before
    s.root.style.setProperty('--leave', (still ? 0 : clamp(1 - (r.bottom - vh) / vh)).toFixed(4)); // being covered by the next
    s.root.style.setProperty('--hold', p.toFixed(4));
    if (r.top < vh * .4) s.root.classList.add('in'); else if (r.top > vh * .95) s.root.classList.remove('in');
    s.fx?.update(p, enter);
    s.play(r.top < vh * .75 && r.bottom > vh * 1.1 || r.top < vh * .55 && r.bottom > vh * .55);
  });
  if (still) scenes[night].slot.querySelector('.end').inert = false;
  const evening = still ? +(now === night) : ease((closing - .52) / .3);
  mark(Math.max(still ? 0 : 1 - ease((opening - .06) / .6), evening), evening > 0);
  // the line fills to the marker of the current hour, then onward to the next
  const a = links[now].parentElement, b = links[now + 1]?.parentElement;
  list.style.setProperty('--x', a.offsetLeft + a.offsetWidth / 2 + (b ? (b.offsetLeft - a.offsetLeft) * done : 0) + 'px');
  if (now !== current) {
    current = now; warm(now);
    links.forEach((l, i) => i === now ? l.setAttribute('aria-current', 'step') : l.removeAttribute('aria-current'));
    list.scrollTo({ left: a.offsetLeft - list.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' });
    $('#nowT').textContent = DAY[now].time;
  }
}
const queue = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
addEventListener('scroll', queue, { passive: true });
addEventListener('resize', queue);
addEventListener('load', queue);
document.addEventListener('visibilitychange', () => document.hidden ? scenes.forEach(s => s.play(false)) : queue());
scenes[0].root.classList.add('in');
frame();
