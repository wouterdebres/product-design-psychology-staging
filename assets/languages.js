(() => {
  const preferenceKey = 'preferredLanguage';
  const current = document.body.dataset.language;
  const links = Array.from(document.querySelectorAll('a[data-language]'));
  if (!links.length) return;

  function save(language) {
    try { localStorage.setItem(preferenceKey, language); } catch (error) {}
  }

  links.forEach((link) => {
    link.addEventListener('click', () => save(link.dataset.language));
  });

  const menu = document.querySelector('.language-menu');
  if (menu) {
    document.addEventListener('click', (event) => {
      if (menu.open && !menu.contains(event.target)) menu.open = false;
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.open) {
        menu.open = false;
        menu.querySelector('summary').focus();
      }
    });
    menu.addEventListener('focusout', (event) => {
      if (event.relatedTarget && !menu.contains(event.relatedTarget)) menu.open = false;
    });
  }

  // Manual choices take priority. Otherwise use the browser's primary language.
  const supported = new Set(['en', 'es', 'zh', 'ja']);
  let saved;
  try { saved = localStorage.getItem(preferenceKey); } catch (error) {}
  const browserLanguage = ((navigator.languages || [])[0] || navigator.language || '').toLowerCase().split('-')[0];
  const preferred = supported.has(saved) ? saved :
    (supported.has(browserLanguage) ? browserLanguage : 'en');
  const target = links.find((link) => link.dataset.language === preferred);
  if (target && preferred !== current) window.location.replace(target.href);
})();
