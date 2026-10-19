(() => {
 if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
 const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
 const selectors = [
  '#home .hero-inner', '#about .intro-grid', '#about .competencies',
  '#projects > .section-heading', '#bookshelf', '.project-toolbar',
  '#projects > .project > .project-intro', '#projects > .project > .case-brief',
  '#projects > .project > .case-grid', '#projects > .project > .architecture',
  '#projects > .project > figure', '#projects > .project > .scope-grid',
  '#projects > .project > .outcome-grid', '#projects > .project > .yogeun-intro',
  '#projects > .project > .press-story', '#projects > .project > .phone-gallery',
  '#projects > .project > .evidence-gallery',
  '#experience > h2', '#experience .experience-card', '#experience .credentials',
  '#contact .contact-inner'
 ];
 const blocks = [...document.querySelectorAll(selectors.join(','))];
 const states = new WeakMap();
 let lastScroll = window.scrollY;
 let direction = 1;
 window.addEventListener('scroll', () => {
  const position = window.scrollY;
  if (Math.abs(position - lastScroll) > 2) direction = position > lastScroll ? 1 : -1;
  lastScroll = position;
 }, { passive: true });
 const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
   const state = states.get(entry.target);
   if (!entry.isIntersecting) { state.inView = false; continue; }
   if (state.inView) continue;
   state.inView = true;
   if (reduced.matches || state.animation?.playState === 'running') continue;
   state.animation?.cancel();
   state.animation = entry.target.animate([
    { opacity: .08, transform: `translateY(${direction * 46}px) scale(.992)` },
    { opacity: 1, transform: 'translateY(0) scale(1)' }
   ], { duration: 880, easing: 'cubic-bezier(.16,.75,.22,1)' });
  }
 }, { threshold: 0, rootMargin: '0px 0px -9% 0px' });
 blocks.forEach(block => { states.set(block, { inView: false, animation: null }); observer.observe(block); });
 const stopMotion = () => blocks.forEach(block => states.get(block).animation?.cancel());
 reduced.addEventListener('change', event => { if (event.matches) stopMotion(); });
 window.addEventListener('beforeprint', stopMotion);
})();
