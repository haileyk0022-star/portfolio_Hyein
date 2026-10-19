(() => {
 const projects = [...document.querySelectorAll('#projects > .project')];
 const reader = document.querySelector('#project-reader');
 const body = reader.querySelector('.reader-body');
 const title = reader.querySelector('#reader-title');
 const status = reader.querySelector('.reader-status');
 const previous = reader.querySelector('[data-reader-prev]');
 const next = reader.querySelector('[data-reader-next]');
 const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
 const names = projects.map(project => project.querySelector('.project-top h2').childNodes[0].textContent.trim());
 // The safety project title contains a line break; use its full book title.
 const bookNames = [...document.querySelectorAll('[data-reader-open]')].reduce((map, button) => {
  map.set(button.dataset.readerOpen, button.dataset.bookTitle || names[projects.findIndex(p => p.id === button.dataset.readerOpen)]);
  return map;
 }, new Map());
 let currentIndex = 0;
 let opener;
 let pageAnimation;
 let transitionBusy = false;
 let transitionToken = 0;
 let readProjects = new Set();
 try { readProjects = new Set(JSON.parse(sessionStorage.getItem('hyein-read-projects') || '[]')); } catch { /* Reading remains available without storage. */ }
 function updateReadState() {
  document.querySelectorAll('.project-book').forEach(book => {
   const read = readProjects.has(book.dataset.readerOpen);
   book.classList.toggle('has-read', read);
   book.querySelector('.book-read-state').textContent = read ? '읽은 사례' : '펼쳐보기';
  });
 }
 function renderProject(index, direction = 1) {
  currentIndex = Math.max(0, Math.min(projects.length - 1, index));
  const source = projects[currentIndex];
  const copy = source.cloneNode(true);
  copy.hidden = false;
  // Prefix IDs and their label references so the full page remains valid while reading.
  const idMap = new Map();
  [copy, ...copy.querySelectorAll('[id]')].forEach(element => {
   if (element.id) { idMap.set(element.id, 'reader-' + element.id); element.id = 'reader-' + element.id; }
  });
  copy.querySelectorAll('[aria-labelledby], [aria-describedby], a[href^="#"]').forEach(element => {
   for (const attr of ['aria-labelledby', 'aria-describedby']) {
    if (element.hasAttribute(attr)) element.setAttribute(attr, element.getAttribute(attr).split(' ').map(id => idMap.get(id) || id).join(' '));
   }
   const href = element.getAttribute('href');
   if (href?.startsWith('#') && idMap.has(href.slice(1))) element.setAttribute('href', '#' + idMap.get(href.slice(1)));
  });
  copy.querySelectorAll('img[loading="lazy"]').forEach(image => { image.loading = 'eager'; });
  body.replaceChildren(copy);
  body.scrollTop = 0;
  title.textContent = bookNames.get(source.id) || names[currentIndex];
  status.textContent = `${currentIndex + 1} / ${projects.length} · 이 프로젝트만 읽고 있습니다`;
  previous.disabled = currentIndex === 0;
  next.disabled = currentIndex === projects.length - 1;
  reader.querySelectorAll('[data-reader-page]').forEach(button => {
   button.disabled = false;
   if (Number(button.dataset.readerPage) === currentIndex) button.setAttribute('aria-current', 'step');
   else button.removeAttribute('aria-current');
  });
  readProjects.add(source.id);
  try { sessionStorage.setItem('hyein-read-projects', JSON.stringify([...readProjects])); } catch { /* Storage is optional. */ }
  updateReadState();
  pageAnimation?.cancel();
  if (!reducedMotion.matches && copy.animate) {
   pageAnimation = copy.animate([
    { opacity: 0, transform: `translateX(${direction * 44}px) scale(.985)` },
    { opacity: 1, transform: 'translateX(0) scale(1)' }
   ], { duration: 620, easing: 'cubic-bezier(.16,.75,.25,1)' });
  }
 }
 function lockNavigation(locked) {
  previous.disabled = locked || currentIndex === 0;
  next.disabled = locked || currentIndex === projects.length - 1;
  reader.querySelectorAll('[data-reader-page]').forEach(button => { button.disabled = locked; });
  body.setAttribute('aria-busy', String(locked));
 }
 async function transitionProject(index, direction) {
  if (transitionBusy || index === currentIndex || index < 0 || index >= projects.length) return;
  const token = ++transitionToken;
  transitionBusy = true;
  lockNavigation(true);
  try {
   pageAnimation?.cancel();
   const outgoing = body.firstElementChild;
   if (!reducedMotion.matches && outgoing?.animate) {
    pageAnimation = outgoing.animate([
     { opacity: 1, transform: 'translateX(0) scale(1)' },
     { opacity: 0, transform: `translateX(${-direction * 26}px) scale(.99)` }
    ], { duration: 190, easing: 'cubic-bezier(.4,0,.8,.4)', fill: 'forwards' });
    await pageAnimation.finished.catch(() => {});
   }
   if (token !== transitionToken || !reader.open) return;
   renderProject(index, direction);
   lockNavigation(true);
   if (pageAnimation && !reducedMotion.matches) await pageAnimation.finished.catch(() => {});
  } finally {
   if (token === transitionToken) { transitionBusy = false; lockNavigation(false); }
  }
 }
 document.querySelectorAll('[data-reader-open]').forEach(button => button.addEventListener('click', () => {
  opener = button;
  const index = projects.findIndex(project => project.id === button.dataset.readerOpen);
  renderProject(index < 0 ? 0 : index);
  reader.showModal();
  document.body.classList.add('reader-open');
 }));
 document.querySelector('[data-reader-launch]').addEventListener('click', event => {
  opener = event.currentTarget;
  const firstVisible = projects.findIndex(project => !project.hidden);
  renderProject(firstVisible < 0 ? 0 : firstVisible);
  reader.showModal();
  document.body.classList.add('reader-open');
 });
 reader.querySelector('[data-reader-close]').addEventListener('click', () => reader.close());
 reader.addEventListener('close', () => {
  transitionToken++;
  transitionBusy = false;
  pageAnimation?.cancel();
  lockNavigation(false);
  document.body.classList.remove('reader-open');
  body.replaceChildren();
  opener?.focus({ preventScroll: true });
 });
 previous.addEventListener('click', () => { if (currentIndex > 0) transitionProject(currentIndex - 1, -1); });
 next.addEventListener('click', () => { if (currentIndex < projects.length - 1) transitionProject(currentIndex + 1, 1); });
 reader.querySelectorAll('[data-reader-page]').forEach(button => button.addEventListener('click', () => {
  const index = Number(button.dataset.readerPage);
  transitionProject(index, index < currentIndex ? -1 : 1);
 }));
 reader.addEventListener('keydown', event => {
  if (document.querySelector('#lightbox').open || event.target.closest('input, textarea, select')) return;
  if (event.key === 'ArrowLeft' && currentIndex > 0) { event.preventDefault(); transitionProject(currentIndex - 1, -1); }
  if (event.key === 'ArrowRight' && currentIndex < projects.length - 1) { event.preventDefault(); transitionProject(currentIndex + 1, 1); }
 });
 updateReadState();
})();
