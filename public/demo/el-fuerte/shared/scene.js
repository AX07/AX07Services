// Builds one activity (media + words). The scroll behaviour on top of it lives in ../day/fx.js.
(() => {
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const el = (tag, cls, html = '') => { const e = document.createElement(tag); if (cls) e.className = cls; e.innerHTML = html; return e; };
const img = s => `<img src="${s.src}" alt="${s.alt}" decoding="async" loading="lazy">`;

// A film that never shows its seam: a second copy fades in over the last second of the first.
function film(f) {
  const box = el('div', 'media', `<img src="${f.poster}" alt="${f.alt}" decoding="async" loading="lazy">`);
  if (still) return { box, play() {} };
  const vids = [0, 1].map(() => {
    const v = el('video');
    v.muted = true; v.playsInline = true; v.preload = 'none'; v.setAttribute('aria-hidden', 'true'); v.dataset.src = f.src;
    v.defaultPlaybackRate = f.rate || 1;                            // survives the src being set later
    v.addEventListener('error', () => v.remove());                // the poster stays underneath
    v.addEventListener('playing', () => v.classList.add('on'));
    box.append(v); return v;
  });
  const local = f.src.includes('shared/film/');                          // our own loops already match end to start
  let cur = 0, on = false;
  vids[0].loop = local;
  vids.forEach((v, i) => v.addEventListener('timeupdate', () => {
    if (local || !on || i !== cur || !(v.duration - v.currentTime < 1)) return;
    const next = vids[cur = 1 - cur];
    next.src ||= next.dataset.src; next.currentTime = 0; next.style.zIndex = 2; v.style.zIndex = 1;
    next.play().catch(() => {});
    setTimeout(() => { if (cur !== i) { v.classList.remove('on'); v.pause(); } }, 1700);
  }));
  return { box, play(go) {
    if (go === on) return;
    on = go;
    const v = vids[cur];
    if (!go) return vids.forEach(x => x.pause());
    v.src ||= v.dataset.src; v.play().catch(() => {});
  } };
}

// Stills that cross-fade as the page is scrolled: scrub(2.5) is halfway between the third and fourth picture.
function slides(list) {
  const box = el('div', 'media scrubbed', list.map(img).join(''));
  const pics = [...box.children];
  const scrub = x => pics.forEach((p, i) => {
    const k = Math.min(1, Math.max(0, (x - i + .65) / .3));       // fades in just before its turn
    p.style.opacity = i ? k * k * (3 - 2 * k) : 1;
  });
  scrub(0);
  return { box, scrub, play() {} };
}

window.popup = ({ label, video, youtube }) => {
  const a = el('a', 'textlink', label);
  a.href = youtube ? `https://www.youtube.com/watch?v=${youtube}` : video;
  a.target = '_blank'; a.rel = 'noopener';
  a.addEventListener('click', e => {
    if (youtube && location.protocol === 'file:') return;          // YouTube refuses to play inside a local file
    e.preventDefault();
    const d = el('dialog', 'player' + (youtube ? ' tall' : ''), `<form method="dialog"><button aria-label="Close the film">Close</button></form>` +
      (youtube ? `<iframe src="https://www.youtube-nocookie.com/embed/${youtube}?autoplay=1&rel=0&playsinline=1" title="${label}" allow="autoplay; encrypted-media; fullscreen" referrerpolicy="strict-origin-when-cross-origin"></iframe>`
        : `<video src="${video}" controls autoplay playsinline></video>`));
    d.addEventListener('click', ev => ev.target === d && d.close());
    d.addEventListener('close', () => d.remove());
    document.body.append(d); d.showModal();
  });
  const p = el('p', 'more'); p.append(a); return p;
};

window.scene = (a, n) => {
  const root = el('article', `scene layout-${a.layout} tone-${a.tone || 'dark'} fx-${a.fx || 'none'}`);
  const H = n ? 'h2' : 'h1';
  const copy = el('div', 'copy', `<p class="kicker"><span>${a.time}</span>${a.kicker}</p>
    <${H}>${a.title.map((l, i) => `<span class="line"><span style="--d:${i}">${i === a.title.length - 1 ? `<em>${l}</em>` : l}</span></span> `).join('')}</${H}>
    <p class="text">${a.text}</p>`);
  const m = a.film ? film(a.film) : a.slides ? slides(a.slides) : { box: el('div', 'media bare'), play() {} };
  const list = a.items || a.rooms;
  if (list) copy.append(el('ul', 'index', list.map(([t, s], i) => `<li><button type="button" aria-pressed="${!i}"><b>${t}</b><small>${s}</small></button></li>`).join('')));
  if (a.popup) copy.append(popup(a.popup));
  const visual = el('div', 'visual'); visual.append(m.box);
  root.append(visual, copy);
  return { root, visual, copy, media: m, play: m.play, el };
};
})();
