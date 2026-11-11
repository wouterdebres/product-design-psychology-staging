(() => {
  const root = document.querySelector('.thank-you-page');
  const canvas = document.querySelector('.thank-you-confetti');
  if (!root || !canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('is-ready');
  if (prefersReducedMotion) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const colors = ['#0076ff', '#0a84ff', '#ff6b6b', '#ffd166', '#24c18a', '#ff8fab', '#7c5cff'];
  const particles = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let animationFrame = 0;
  let lastTimestamp = 0;

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const addParticle = (options = {}) => {
    particles.push({
      x: options.x ?? Math.random() * width,
      y: options.y ?? (-40 - Math.random() * height * 0.25),
      vx: options.vx ?? ((Math.random() - 0.5) * 2.8),
      vy: options.vy ?? (2 + Math.random() * 4.4),
      gravity: options.gravity ?? (0.025 + Math.random() * 0.04),
      drag: options.drag ?? (0.994 + Math.random() * 0.003),
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: (Math.random() - 0.5) * 0.18,
      tilt: Math.random() * Math.PI,
      tiltSpeed: (Math.random() - 0.5) * 0.3,
      size: options.size ?? (9 + Math.random() * 18),
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.82 ? 'circle' : 'rect',
      alpha: options.alpha ?? 0.95,
      life: options.life ?? (5200 + Math.random() * 2600),
      age: 0,
    });
  };

  const spawnScreenRain = (count) => {
    for (let index = 0; index < count; index += 1) {
      addParticle();
    }
  };

  const drawParticle = (particle) => {
    context.save();
    context.globalAlpha = Math.max(0, particle.alpha * (1 - particle.age / particle.life));
    context.translate(particle.x, particle.y);
    context.rotate(particle.tilt);
    context.fillStyle = particle.color;

    if (particle.shape === 'circle') {
      context.beginPath();
      context.arc(0, 0, particle.size * 0.34, 0, Math.PI * 2);
      context.fill();
    } else {
      context.fillRect(-particle.size * 0.45, -particle.size * 0.24, particle.size * 0.9, particle.size * 0.48);
    }

    context.restore();
  };

  const tick = (timestamp) => {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = Math.min(32, timestamp - lastTimestamp);
    lastTimestamp = timestamp;

    context.clearRect(0, 0, width, height);

    for (let index = particles.length - 1; index >= 0; index -= 1) {
      const particle = particles[index];
      particle.age += delta;

      if (particle.age >= particle.life || particle.y > height + 80) {
        particles.splice(index, 1);
        continue;
      }

      particle.wobble += particle.wobbleSpeed * (delta / 16);
      particle.tilt += particle.tiltSpeed * (delta / 16);
      particle.vx *= particle.drag;
      particle.vy = (particle.vy * particle.drag) + particle.gravity;
      particle.x += (particle.vx + Math.sin(particle.wobble) * 0.6) * (delta / 16);
      particle.y += particle.vy * (delta / 16);

      drawParticle(particle);
    }

    animationFrame = window.requestAnimationFrame(tick);
  };

  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', resize);
  window.addEventListener(
    'load',
    () => {
      spawnScreenRain(Math.max(180, Math.floor(width / 5)));
      window.setTimeout(() => spawnScreenRain(Math.max(120, Math.floor(width / 7))), 250);
      window.setInterval(() => spawnScreenRain(Math.max(50, Math.floor(width / 14))), 700);
    },
    { once: true },
  );

  animationFrame = window.requestAnimationFrame(tick);
  window.addEventListener('pagehide', () => window.cancelAnimationFrame(animationFrame), { once: true });
})();
