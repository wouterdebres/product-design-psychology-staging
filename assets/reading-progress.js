(function () {
  const language = document.body.dataset.language || 'en';
  const storageKey = language === 'en' ? 'lastChapterUrl' : `lastChapterUrl:${language}`;
  const home = document.body.dataset.homeUrl || '/';
  const path = window.location.pathname;

  function dedupeHomeToc() {
    const seen = new Set();
    const tocLinks = document.querySelectorAll('.toc-list .toc-link[href]');

    tocLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const item = link.closest('li');

      if (!href || !item) return;

      if (seen.has(href)) {
        item.remove();
        return;
      }

      seen.add(href);
    });
  }

  function isChapterPath(value) {
    if (!value.startsWith(home)) return false;
    return /^\d{2}-[^/]+\/$/.test(value.slice(home.length));
  }

  try {
    if (document.body.dataset.pageType === 'chapter') {
      if (document.body.dataset.chapterId === '40') {
        window.localStorage.removeItem(storageKey);
      } else if (isChapterPath(path)) {
        window.localStorage.setItem(storageKey, path);
      }
    }

    if (document.body.dataset.pageType === 'home') {
      dedupeHomeToc();

      const continueUrl = window.localStorage.getItem(storageKey);
      const link = document.querySelector('[data-continue-reading]');
      const label = document.querySelector('[data-continue-reading-label]');

      if (link && label && continueUrl && isChapterPath(continueUrl) &&
          Array.from(document.querySelectorAll('.toc-link[href]')).some((item) => new URL(item.getAttribute('href'), window.location.origin).pathname === continueUrl)) {
        link.href = continueUrl;
        label.textContent = link.dataset.continueLabel;
      }
    }
  } catch (error) {}
})();
