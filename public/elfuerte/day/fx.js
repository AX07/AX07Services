// Scroll behaviour, one builder per kind of activity. Each receives the built scene and returns update(p, enter),
// where p runs 0..1 while the chapter holds the screen. `rest` is the frame shown when motion is reduced.
(() => {
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = t => (t = clamp(t), t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const seg = (p, a, b) => ease((p - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const pic = (s, cls = '') => `<img class="${cls}" src="${s.src}" alt="${s.alt}" decoding="async" loading="lazy">`;
const press = (btns, k) => btns.forEach((b, i) => b.setAttribute('aria-pressed', i === k));
// 0..1 of the chapter mapped to picture 0..n-1, with a short rest on the first and last
const along = (p, n) => clamp(p * 1.1 - .05) * (n - 1);

// a canvas that keeps itself the size of the screen and redraws when its picture arrives
function canvas(s, cls) {
  const c = s.el('canvas', cls);
  s.visual.append(c);
  const g = c.getContext('2d');
  return { c, g, fit() {
    const d = Math.min(1.5, devicePixelRatio || 1), w = Math.round(c.clientWidth * d), h = Math.round(c.clientHeight * d);
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; return true; }
    return false;
  } };
}
// The blind is drawn over a moving view: a looping video, or its first frame when motion is reduced.
function blindScene(s, a, state) {
  const k = canvas(s, 'blind');
  k.c.setAttribute('role', 'img'); k.c.setAttribute('aria-label', a.view.alt);
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const poster = new Image(), film = document.createElement('video');
  film.muted = film.loop = film.playsInline = true; film.preload = 'auto';
  let last = 0, on = false, drawn = 0;
  const paint = () => { k.fit(); if (k.c.width) drawBlinds(k.g, film.readyState > 1 ? film : poster, k.c.width, k.c.height, state(last)); };
  poster.onload = paint; poster.src = a.view.poster;
  if (!still) film.src = a.view.video;
  const tick = t => { if (!on) return; if (t - drawn > 32) { drawn = t; paint(); } requestAnimationFrame(tick); };
  return {
    update: p => { last = p; paint(); },
    play(go) {
      if (still || go === on) return;
      on = go;
      if (!go) return film.pause();
      film.play().catch(() => {}); requestAnimationFrame(tick);
    },
  };
}

window.FX = {
  morning(s, a) {
    const draw = blindScene(s, a, p => ({ tilt: seg(p, .04, .34), lift: seg(p, .26, .72), push: seg(p, .3, 1) }));
    return { rest: .9, ...draw };
  },

  night(s, a, ui) {
    const draw = blindScene(s, a, p => ({ tilt: 1 - seg(p, .52, .76), lift: 1 - seg(p, .24, .62), push: 1 - seg(p, .05, .6), dusk: seg(p, 0, .3) * .8 }));
    const end = s.el('div', 'end', `<a class="btn solid" href="${BOOK}">Book your stay</a>
      <p><a href="tel:+34951562004">+34 951 562 004</a><a href="https://api.whatsapp.com/send?phone=34676409755">WhatsApp</a><a href="https://www.instagram.com/elfuertemarbella/">Instagram</a></p>
      <small>Showcase concept by AX07.DEV. Not the official website. Photography and film belong to El Fuerte Marbella, Soleo and Kena.</small>
      <img class="maker" src="/elfuerte/shared/ax07-mark.png" alt="AX07.DEV" width="30" height="28">`);
    s.copy.append(end);
    return { rest: 1, play: draw.play, update(p) {
      draw.update(p);
      const shown = p > .76 || ui.still;
      s.root.classList.toggle('closed', shown);
      end.inert = !shown;
    } };
  },

  bento(s, a) {
    const wrap = s.el('div', 'bento', a.cards.map((c, i) => `<figure style="--i:${i}"><div>${pic(c)}</div></figure>`).join(''));
    s.visual.append(wrap);
    return { rest: .5, update(p, enter) {
      [...wrap.children].forEach((f, i) => {
        const k = ease(clamp(enter * 1.5 - .35 - i * .05));
        f.style.setProperty('--k', k.toFixed(3));
        f.style.setProperty('--drift', ((p - .5) * -(24 + (i * 37) % 70)).toFixed(1) + 'px');
      });
    } };
  },

  orbit(s, a) {
    const n = a.ring.length;
    const ring = s.el('div', 'orbit', `<div class="ring3d">${a.ring.map((c, i) => pic(c).replace('<img', `<img style="--i:${i}"`)).join('')}</div>`);
    const acts = s.el('ol', 'acts', a.courses.map(([t, d, art]) => `<li><img src="${art}" alt="" loading="lazy"><b>${t}</b><small>${d}</small></li>`).join(''));
    s.visual.append(ring, acts);
    const wheel = ring.firstChild, li = [...acts.children];
    return { rest: .02, update(p) {
      // one turn for the whole chapter: three pictures, a third of the way round, for each act
      const at = along(p, n);
      wheel.style.setProperty('--turn', (-at * 360 / n).toFixed(2) + 'deg');
      const k = Math.min(2, Math.floor((at + .5) / 3));
      li.forEach((l, i) => l.classList.toggle('on', i === k));
    } };
  },

  qahwa(s, a) {
    const intro = s.el('div', 'qahwa', `<p class="word" aria-hidden="true">Qahwa</p>${a.arches.map((c, i) => pic(c, 'arch a' + i)).join('')}`);
    s.root.append(intro);
    return { rest: 1, update(p) {
      intro.style.setProperty('--fill', seg(p, 0, .42).toFixed(4));
      intro.style.setProperty('--rise', seg(p, .08, .5).toFixed(4));
      const w = seg(p, .56, .82);
      intro.style.setProperty('--wipe', w.toFixed(4));
      s.root.classList.toggle('revealed', w > .35);
    } };
  },

  deck(s, a, ui) {
    s.media.box.remove();
    const deck = s.el('div', 'deck', a.slides.map((c, i) => `<figure style="--i:${i}">${pic(c)}<figcaption>${a.items[i][0]}<span>${a.items[i][1]}</span></figcaption></figure>`).join(''));
    s.visual.append(deck);
    const cards = [...deck.children], btns = [...s.copy.querySelectorAll('.index button')], n = cards.length;
    btns.forEach((b, i) => b.onclick = () => ui.seek((i / (n - 1) + .05) / 1.1));
    return { rest: 0, update(p) {
      const at = along(p, n);
      cards.forEach((c, i) => c.style.setProperty('--k', ease(clamp((at - i - .15) / .7)).toFixed(4)));   // the last card stays
      cards.forEach((c, i) => c.firstChild.style.objectPosition = innerWidth <= 860 && innerHeight > innerWidth ? `${pan(at - i)}% 50%` : '');
      press(btns, Math.round(at));
    } };
  },

  scrub(s, a, ui) {
    const n = a.slides.length, btns = [...s.copy.querySelectorAll('.index button')];
    btns.forEach((b, i) => b.onclick = () => ui.seek((i / (n - 1) + .05) / 1.1));
    return { rest: 0, update(p) { const at = along(p, n); s.media.scrub(at); press(btns, Math.round(at)); s.root.style.setProperty('--n', Math.round(at)); } };
  },

  parasols(s, a, ui) {
    const base = FX.scrub(s, a, ui);
    s.visual.append(s.el('div', 'parasol one'), s.el('div', 'parasol two'));
    return { rest: 0, update(p, enter) { base.update(p); s.root.style.setProperty('--sun', (enter * .25 + p * .75).toFixed(4)); } };
  },

  walk(s, a) {
    s.media.box.remove();
    const track = s.el('div', 'track');
    track.append(s.copy);
    a.places.forEach(([name, note, photos]) => track.append(s.el('section', 'place n' + photos.length,
      `<div class="plates">${photos.map(x => pic(x)).join('')}</div><h3>${name}</h3><p>${note}</p>`)));
    s.visual.append(track);
    return { rest: 0, update(p) {
      const far = Math.max(0, track.scrollWidth - s.root.clientWidth);
      track.style.setProperty('--x', (-far * clamp(p * 1.06 - .03)).toFixed(1) + 'px');
    } };
  },

  shutters(s, a) {
    const n = a.slides.length;
    s.visual.append(s.el('div', 'shutter l'), s.el('div', 'shutter r'));
    return { rest: .3, update(p) {
      s.root.style.setProperty('--open', seg(p, .02, .24).toFixed(4));
      s.media.scrub(clamp((p - .24) / .72) * (n - 1));
    } };
  },

  steam(s) {
    const k = canvas(s, 'steam'), hand = s.el('div', 'hand');
    s.visual.append(hand);
    const fog = document.createElement('canvas'), brush = document.createElement('canvas');
    brush.width = brush.height = 192;
    {
      const g = brush.getContext('2d');
      const dab = (x, y, R, alpha) => { const d = g.createRadialGradient(x, y, 0, x, y, R); d.addColorStop(0, `rgba(0,0,0,${alpha})`); d.addColorStop(.45, `rgba(0,0,0,${alpha * .7})`); d.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = d; g.fillRect(x - R, y - R, R * 2, R * 2); };
      dab(96, 96, 80, .5);
      for (let i = 1; i < 46; i++) { const q = i * 2.39996, far = 12 + 62 * Math.sqrt(i / 46); dab(96 + Math.cos(q) * far, 96 + Math.sin(q) * far, 9 + (i * 7) % 15, .2); }
    }
    function mist() {                                                // painted once per size
      fog.width = k.c.width; fog.height = k.c.height;
      const g = fog.getContext('2d'), w = fog.width, h = fog.height;
      g.fillStyle = 'rgba(196,212,214,.8)'; g.fillRect(0, 0, w, h);
      const r = n => { const x = Math.sin(n * 91.7) * 43758.5; return x - Math.floor(x); };
      for (let i = 0; i < 110; i++) {
        const x = r(i) * w, y = r(i + 200) * h, R = (0.08 + r(i + 400) * .14) * Math.max(w, h);
        const grd = g.createRadialGradient(x, y, 0, x, y, R);
        grd.addColorStop(0, `rgba(${i % 3 ? '232,240,240' : '170,190,196'},.28)`); grd.addColorStop(1, 'rgba(210,225,226,0)');
        g.fillStyle = grd; g.fillRect(x - R, y - R, R * 2, R * 2);
      }
    }
    // the path of a hand cleaning a window: across, down a little, and back
    const ROWS = 5, STEPS = 60;
    const spot = (t, w, h) => {
      const row = Math.min(ROWS - 1, Math.floor(t * ROWS)), f = clamp(t * ROWS - row), side = ease(f);
      const x = lerp(-.04, 1.04, row % 2 ? 1 - side : side);
      const y = (row + .5) / ROWS + Math.sin(f * Math.PI) * .045 * (row % 2 ? -1 : 1) + (f - .5) * .06;
      return [x * w, y * h];
    };
    let last = 0;
    function paint(p) {
      if (k.fit() || !fog.width) mist();
      const { g, c } = k, w = c.width, h = c.height;
      if (!w) return;
      const t = clamp((p - .06) / .74);
      g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, w, h); g.drawImage(fog, 0, 0);
      if (t > 0) {
        g.globalCompositeOperation = 'destination-out';
        // soft, uneven dabs along the path, so the cleared glass has the ragged edge of a real hand
        const band = h / ROWS, step = 1 / (ROWS * Math.max(60, Math.round(w / band * 9)));
        for (let u = 0; u <= t; u += step) {
          const [x, y] = spot(u, w, h), j = Math.sin(u * 997), size = band * (1.5 + .22 * Math.sin(u * 211) + .14 * j);
          g.drawImage(brush, x - size / 2 + j * band * .05, y - size / 2 + Math.sin(u * 613) * band * .07, size, size);
        }
      }
      const [hx, hy] = spot(t, c.clientWidth, c.clientHeight);
      hand.style.translate = `${hx}px ${hy}px`;
      hand.style.opacity = t > 0 && t < 1 ? 1 : 0;
      k.c.style.opacity = 1 - clamp((p - .8) / .14);                  // the last of the mist lifts
    }
    return { rest: 1, update(p) {
      last = p; paint(p);
      const x = innerWidth <= 860 && innerHeight > innerWidth ? `${Math.round(40 + 44 * ease(clamp((p - .1) / .85)))}% 50%` : '';
      s.media.box.querySelectorAll('img,video').forEach(m => m.style.objectPosition = x);
    } };
  },

  tiers(s, a) {
    s.media.box.remove();
    const stack = s.el('div', 'tiers', '<i class="rod"></i>' + a.layers.map(l => `<figure>${pic(l)}</figure>`).join(''));
    s.visual.append(stack);
    const figs = [...stack.querySelectorAll('figure')];
    return { rest: 1, update(p) {
      const W = stack.clientWidth, H = stack.clientHeight, narrow = W <= 860 && H > W;
      const bar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bar')), top = H <= 520 ? 76 : 96;
      // where the finished stand sits: to the right of the words, or under them on a phone
      const box = narrow ? { x: 16, y: H * .47, w: W - 32, h: H * .53 - bar - 10 } : { x: W * .45, y: top, w: W * .5, h: H - top - bar - 14 };
      const tier = box.h / 4, gap = 12;
      let settled = 0;
      figs.forEach((f, i) => {
        const t = clamp(p * 4.15 - i), show = i ? clamp(t / .22) : 1, k = ease((t - .42) / .5);
        const wide = box.w * (1 - i * .19);                            // widest at the foot
        const r = { x: box.x + (box.w - wide) / 2, y: box.y + box.h - (i + 1) * tier + gap / 2, w: wide, h: tier - gap };
        Object.assign(f.style, { opacity: show, left: lerp(0, r.x, k) + 'px', top: lerp(0, r.y, k) + 'px', width: lerp(W, r.w, k) + 'px', height: lerp(H, r.h, k) + 'px', borderRadius: k * r.h / 2 + 'px', borderWidth: k * 3 + 'px', zIndex: k > .98 ? 1 : 2 + i, scale: i && !k ? 1.06 - show * .06 : 1 });
        settled += k;
      });
      stack.style.setProperty('--rod', clamp(settled - 3).toFixed(3));
      Object.assign(stack.firstChild.style, { left: box.x + box.w / 2 + 'px', top: box.y - 26 + 'px', height: box.h + 34 + 'px' });
    } };
  },

  plan(s, a, ui) {
    s.media.box.remove();
    const photos = s.el('div', 'media scrubbed', a.setups.map(x => pic({ src: x.src, alt: a.rooms[x.r].join(', ') })).join(''));
    const count = s.el('p', 'layout', '<b></b> <span></span>'), plan = s.el('div', 'plan'), side = s.el('div', 'floor');
    plan.setAttribute('aria-hidden', 'true'); plan.innerHTML = '<i></i>'.repeat(138);
    side.append(count, plan); s.visual.append(photos, side);
    // seat positions in % of the plan, exactly one per guest
    const grid = (n, cols, x, y) => [...Array(n)].map((_, i) => [x(i % cols), y(i / cols | 0)]);
    const round = (n, per, at, rx, ry) => [...Array(n)].map((_, i) => { const t = i / per | 0, q = i % per * 2 * Math.PI / per, [x, y] = at(t); return [x + Math.cos(q) * rx, y + Math.sin(q) * ry]; });
    const seats = {
      theatre: () => grid(138, 23, c => 4 + c * 4 + (c > 11 ? 4 : 0), r => 18 + r * 13),
      school: () => grid(75, 15, c => 5 + c * 5.7 + (c / 3 | 0) * 2.5, r => 18 + r * 17),
      u: () => [...grid(14, 1, () => 22, r => 18 + r * 5), ...grid(14, 14, c => 24 + c * 4, () => 88), ...grid(14, 1, () => 78, r => 18 + r * 5)],
      banquet: () => round(96, 8, t => [14 + t % 4 * 24, 20 + (t / 4 | 0) * 30], 6.5, 10),
      board: n => round(n, n, () => [50, 50], 32, 30),
      lounge: () => round(24, 4, t => [[16, 24], [44, 38], [76, 22], [24, 70], [56, 76], [82, 62]][t], 5, 8),
    };
    const layouts = a.setups.map(x => seats[x.k](x.n));
    console.assert(layouts.every((l, i) => l.length === a.setups[i].n && l.every(q => q.every(v => v >= 0 && v <= 100))), 'floor plan seats');
    const dots = [...plan.children], btns = [...s.copy.querySelectorAll('.index button')], imgs = [...photos.children], n = layouts.length;
    btns.forEach((b, i) => b.onclick = () => ui.seek((a.setups.findIndex(x => x.r === i) / (n - 1) + .05) / 1.1));
    let now = -1;
    return { rest: 0, update(p) {
      const at = along(p, n), k = Math.round(at);
      imgs.forEach((m, i) => m.style.opacity = i ? clamp((at - i + .65) / .3) : 1);
      if (k === now) return;
      now = k;
      const l = layouts[k], set = a.setups[k];
      dots.forEach((d, i) => { const [x, y] = l[i] || l[l.length - 1]; d.style.left = x + '%'; d.style.top = y + '%'; d.style.opacity = i < l.length ? 1 : 0; });
      plan.className = 'plan ' + set.k;
      count.firstChild.textContent = set.k === 'lounge' ? '' : set.n; count.lastChild.textContent = set.c;
      press(btns, set.r);
    } };
  },
};
})();
