// A wooden venetian blind over a photo, drawn from three numbers (0..1): tilt of the slats, lift of the blind, push of the camera.
// Opens the day and closes it.
window.drawBlinds = (g, img, W, H, { tilt, lift, push, dusk = 0 }) => {
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const open = clamp(tilt * .35 + lift * .65);
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = '#120a05'; g.fillRect(0, 0, W, H);
  const iw = img.videoWidth || img.naturalWidth, ih = img.videoHeight || img.naturalHeight;
  if (iw) {
    // cover-crop the doorway, then move in towards the pool and the palm
    const ar = W / H, k = 1 + push * .3;
    const sw = (ar > iw / ih ? iw : ih * ar) / k, sh = sw / ar;
    const sx = clamp(iw * (H > W ? .475 + push * .03 : .5 - push * .01) - sw / 2, 0, iw - sw), sy = clamp(ih * (.51 + push * .0) - sh / 2, 0, ih - sh);
    g.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
  }
  g.fillStyle = `rgba(14,8,4,${(1 - open) * .66})`; g.fillRect(0, 0, W, H);
  if (dusk) { g.globalCompositeOperation = 'multiply'; g.globalAlpha = dusk; g.fillStyle = '#243a5e'; g.fillRect(0, 0, W, H); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; }
  const unit = H / 720;
  if (lift < .999) {
    const N = H > W ? 34 : 24, pitch = (H + 20 * unit) / N, bottom = H + 14 * unit - lift * (H + 30 * unit);
    const face = pitch * (1.08 - tilt * .86);                        // closed slats overlap, open slats show their edge
    for (let n = N - 1; n >= 0; n--) {
      const natural = n * pitch, stacked = bottom - (N - n) * 3.2 * unit;
      const y = Math.min(natural, stacked), h = stacked < natural ? Math.min(face, 5 * unit) : face;
      if (y + h < -2) continue;
      const s = g.createLinearGradient(0, y, 0, y + h), L = 9 + tilt * 5 - dusk * 3;
      s.addColorStop(0, `hsl(24 34% ${L + 15}%)`); s.addColorStop(.18, `hsl(22 36% ${L + 6}%)`);
      s.addColorStop(.8, `hsl(20 38% ${L}%)`); s.addColorStop(1, `hsl(34 62% ${L + 6 + tilt * 22 * (1 - dusk)}%)`);
      g.shadowColor = 'rgba(10,5,2,.45)'; g.shadowBlur = 7 * unit; g.shadowOffsetY = 4 * unit;
      g.fillStyle = s; g.fillRect(-10, y, W + 20, h);
      g.shadowColor = 'transparent';
    }
    for (const x of [W * .13, W * .5, W * .87]) {                    // the ladder tapes
      g.fillStyle = 'rgba(30,17,9,.75)'; g.fillRect(x - 7 * unit, 0, 14 * unit, Math.max(0, bottom - 6 * unit));
      g.fillStyle = 'rgba(255,214,170,.12)'; g.fillRect(x - 7 * unit, 0, 1.5 * unit, Math.max(0, bottom - 6 * unit));
    }
    g.fillStyle = '#3a2316'; g.fillRect(-10, bottom - 7 * unit, W + 20, 15 * unit);
    g.fillStyle = 'rgba(255,215,165,.35)'; g.fillRect(-10, bottom - 7 * unit, W + 20, 1.5 * unit);
  }
  const shaft = tilt * (1 - lift) * (1 - dusk);
  if (shaft > .01) {
    g.globalCompositeOperation = 'screen';
    const s = g.createLinearGradient(W * .75, 0, W * .2, H);
    s.addColorStop(0, `rgba(255,214,150,${shaft * .34})`); s.addColorStop(1, 'rgba(255,214,150,0)');
    g.fillStyle = s; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over';
  }
};
