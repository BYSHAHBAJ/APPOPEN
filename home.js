// Frame-rate demo: shows how motion looks at 60-165 FPS, capped by the visitor's real screen refresh rate.
(() => {
  const box = document.getElementById('fpsDemo');
  if (!box) return;
  const ball = box.querySelector('.ball'), track = box.querySelector('.track');
  const o = { fps: box.querySelector('[data-r=fps]'), ms: box.querySelector('[data-r=ms]'), hz: box.querySelector('[data-r=hz]'), note: box.querySelector('.note') };
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hz = 60, target = 60, running = !reduce, last = 0, visible = true;

  // Measure the display refresh rate from ~40 animation frames, then snap to a common value.
  const s = []; let p = 0;
  const probe = (t) => {
    if (p) s.push(t - p); p = t;
    if (s.length < 40) return requestAnimationFrame(probe);
    s.sort((a, b) => a - b);
    const f = 1000 / s[s.length >> 1];
    hz = [60, 75, 90, 120, 144, 165, 240].reduce((a, b) => Math.abs(b - f) < Math.abs(a - f) ? b : a);
    o.hz.textContent = hz; update();
  };
  requestAnimationFrame(probe);

  const update = () => {
    const eff = Math.min(target, hz);
    o.fps.textContent = eff; o.ms.textContent = (1000 / eff).toFixed(1);
    o.note.textContent = target > hz
      ? 'Your screen refreshes at ' + hz + ' Hz, so it cannot show more than ' + hz + ' FPS. Settings above that look the same here.'
      : 'Demo only. It shows how smooth motion looks at each rate and does not change your game.';
  };
  box.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => {
    box.querySelectorAll('.seg button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    target = +b.dataset.fps; running = true; update();
  }));

  const loop = (t) => {
    requestAnimationFrame(loop);
    if (!running || !visible) return;
    const step = 1000 / Math.min(target, hz);
    if (t - last < step - 2) return;
    last = t;
    const w = track.clientWidth - ball.offsetWidth, ph = (t % 1400) / 1400;
    ball.style.transform = 'translateX(' + (ph < .5 ? ph * 2 : 2 - ph * 2) * w + 'px)';
  };
  requestAnimationFrame(loop);
  if ('IntersectionObserver' in window) new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(box);
  update();
})();
