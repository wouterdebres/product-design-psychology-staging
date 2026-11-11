(() => {
  const root = document.documentElement;
  const storage = (() => {
    try {
      return window.localStorage;
    } catch (e) {
      return null;
    }
  })();

  const stored = storage ? storage.getItem('theme') : null;
  if (stored === 'dark') {
    root.classList.add('dark');
  }

  const button = document.getElementById('theme-toggle');
  if (!button) return;

  const updateLabel = () => {
    const isDark = root.classList.contains('dark');
    button.setAttribute(
      'aria-label',
      isDark ? button.dataset.lightLabel : button.dataset.darkLabel,
    );
  };

  button.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    if (storage) {
      storage.setItem('theme', isDark ? 'dark' : 'light');
    }
    updateLabel();
  });

  updateLabel();
})();
