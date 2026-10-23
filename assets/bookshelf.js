(() => {
 const projects = [...document.querySelector('#project-library').content.children];
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
  if (reader.open) history.replaceState(null, '', '#' + source.id);
  const copy = source.cloneNode(true);
  copy.hidden = false;
  // A book opens the complete case directly, without another disclosure step.
  copy.querySelectorAll('details').forEach(detail => {
   const section = document.createElement('section');
   section.className = 'case-detail case-process';
   const heading = document.createElement('h4');
   heading.textContent = detail.querySelector('summary').childNodes[0].textContent.trim().replace(' 자세히 보기', '');
   section.append(heading, ...[...detail.children].filter(child => child.tagName !== 'SUMMARY'));
   detail.replaceWith(section);
  });
  // Role and evidence already appear in the introduction and result blocks.
  copy.querySelector('.case-brief')?.remove();
  copy.querySelector('.key-description')?.remove();
  const outcomes = copy.querySelector('.outcome-grid');
  const introduction = copy.querySelector('.project-intro');
  if (outcomes && introduction) introduction.after(outcomes);
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
  status.textContent = `${currentIndex + 1} / ${projects.length} · 선택한 경험을 읽고 있습니다`;
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
 function openProject(index, trigger, targetHash) {
  opener = trigger || document.querySelector(`[data-reader-open="${projects[index].id}"]`);
  renderProject(index);
  if (!reader.open) reader.showModal();
  document.body.classList.add('reader-open');
  const targetId = targetHash?.replace(/^#/, '');
  const target = targetId && body.querySelector('#reader-' + CSS.escape(targetId));
  history.replaceState(null, '', target ? targetHash : '#' + projects[index].id);
  if (target && targetId !== projects[index].id) {
   target.tabIndex = -1;
   target.focus({ preventScroll: true });
   target.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
 }
 document.querySelectorAll('[data-reader-open]').forEach(button => button.addEventListener('click', () => {
  const index = projects.findIndex(project => project.id === button.dataset.readerOpen);
  if (index >= 0) openProject(index, button);
 }));
 document.querySelector('[data-reader-launch]').addEventListener('click', event => openProject(0, event.currentTarget));
 function hashIndex(hash) {
  const id = hash.replace(/^#/, '');
  return projects.findIndex(project => project.id === id || [...project.querySelectorAll('[id]')].some(node => node.id === id));
 }
 document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const hash = link.getAttribute('href');
  if (reader.contains(link)) {
   const target = [...body.querySelectorAll('[id]')].find(node => '#' + node.id === hash);
   if (target) { event.preventDefault(); target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' }); }
   return;
  }
  const index = hashIndex(hash);
  if (index >= 0) { event.preventDefault(); openProject(index, link, hash); }
 });
 window.addEventListener('hashchange', () => {
  const index = hashIndex(location.hash);
  if (index >= 0) openProject(index, undefined, location.hash);
  else if (reader.open && !document.querySelector('#lightbox').open) reader.close();
 });
 reader.querySelector('[data-reader-close]').addEventListener('click', () => reader.close());
 reader.addEventListener('close', () => {
  transitionToken++;
  transitionBusy = false;
  pageAnimation?.cancel();
  lockNavigation(false);
  document.body.classList.remove('reader-open');
  body.replaceChildren();
  history.replaceState(null, '', '#bookshelf');
  const returnBook = opener?.matches('.project-book, .reader-launch') ? opener : document.querySelector(`[data-reader-open="${projects[currentIndex].id}"]`);
  returnBook?.focus({ preventScroll: true });
  document.querySelector('#bookshelf').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
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
 const initialIndex = hashIndex(location.hash);
 if (initialIndex >= 0) openProject(initialIndex, undefined, location.hash);
})();
