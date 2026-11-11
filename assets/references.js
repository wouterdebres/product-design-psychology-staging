(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const accordions = document.querySelectorAll('.references');

  const animateAccordion = (details) => {
    const summary = details.querySelector('.references-summary');
    if (!summary) return;

    let animation = null;
    let isClosing = false;
    let isExpanding = false;

    const finish = (open) => {
      details.open = open;
      details.style.height = '';
      details.style.overflow = '';
      animation = null;
      isClosing = false;
      isExpanding = false;
    };

    const startAnimation = (startHeight, endHeight, open) => {
      details.style.overflow = 'hidden';
      if (animation) animation.cancel();

      animation = details.animate(
        {
          height: [`${startHeight}px`, `${endHeight}px`],
        },
        {
          duration: 220,
          easing: 'ease',
        }
      );

      animation.onfinish = () => finish(open);
      animation.oncancel = () => {
        animation = null;
      };
    };

    const expand = () => {
      isExpanding = true;
      const startHeight = details.offsetHeight;
      details.open = true;
      const endHeight = details.offsetHeight;
      details.style.height = `${startHeight}px`;
      startAnimation(startHeight, endHeight, true);
    };

    const collapse = () => {
      isClosing = true;
      const startHeight = details.offsetHeight;
      const endHeight = summary.offsetHeight;
      details.style.height = `${startHeight}px`;
      startAnimation(startHeight, endHeight, false);
    };

    summary.addEventListener('click', (event) => {
      if (reduceMotion.matches) return;

      event.preventDefault();
      details.style.overflow = 'hidden';

      if (isClosing || !details.open) {
        expand();
      } else if (isExpanding || details.open) {
        collapse();
      }
    });
  };

  accordions.forEach(animateAccordion);
})();
