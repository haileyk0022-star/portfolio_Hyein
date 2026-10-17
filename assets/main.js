const modal = document.querySelector('#lightbox');
let imageTrigger;
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
 imageTrigger = button;
 modal.querySelector('img').src = button.dataset.image;
 modal.querySelector('img').alt = button.dataset.caption;
 modal.querySelector('p').textContent = button.dataset.caption;
 modal.showModal(); document.body.classList.add('modal-open');
}));
modal.querySelector('button').addEventListener('click', () => modal.close());
modal.addEventListener('click', event => { if(event.target === modal) { const rect=modal.getBoundingClientRect(); if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) modal.close(); } });
modal.addEventListener('close', () => { document.body.classList.remove('modal-open'); imageTrigger?.focus(); });
document.querySelector('#copy-email').addEventListener('click', async () => {
 const status = document.querySelector('#copy-status');
 try { await navigator.clipboard.writeText('haileyk0022@gmail.com'); status.textContent='이메일을 복사했습니다.'; }
 catch { status.textContent='위 이메일 주소를 선택해 복사해 주세요.'; }
});
let previouslyOpen=[];
let previouslyHidden=[];
window.addEventListener('beforeprint',()=>{previouslyOpen=[...document.querySelectorAll('details')].filter(d=>d.open);document.querySelectorAll('details').forEach(d=>d.open=true);previouslyHidden=[...document.querySelectorAll('.project[hidden]')];previouslyHidden.forEach(p=>p.hidden=false);});
window.addEventListener('afterprint',()=>{document.querySelectorAll('details').forEach(d=>d.open=previouslyOpen.includes(d));previouslyHidden.forEach(p=>p.hidden=true);});
document.querySelector('#print').addEventListener('click',()=>window.print());
const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){document.querySelectorAll('nav a').forEach(a=>{const active=a.getAttribute('href')==='#'+e.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}},{rootMargin:'-15% 0px -60% 0px'});
['about','projects','experience','contact'].forEach(id=>observer.observe(document.getElementById(id)));

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
function closeMenu() {
 menuToggle.setAttribute('aria-expanded', 'false');
 menuToggle.setAttribute('aria-label', '메뉴 열기');
 nav.classList.remove('is-open');
}
menuToggle.addEventListener('click', () => {
 const open = menuToggle.getAttribute('aria-expanded') !== 'true';
 menuToggle.setAttribute('aria-expanded', String(open));
 menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
 nav.classList.toggle('is-open', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
 if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
  closeMenu(); menuToggle.focus();
 }
});
document.addEventListener('click', event => {
 if (!event.target.closest('.site-header')) closeMenu();
});
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const projectArticles = [...document.querySelectorAll('.project[data-category]')];
function applyFilter(category) {
 filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
 projectArticles.forEach(article => { article.hidden = category !== 'all' && article.dataset.category !== category; });
 document.querySelector('#filter-status').textContent = `${projectArticles.filter(article => !article.hidden).length}개 프로젝트`;
}
filterButtons.forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.filter)));
// Direct project links remain usable after selecting a category.
function revealHashProject(hash) {
 const project = projectArticles.find(article => '#' + article.id === hash);
 if (project?.hidden) applyFilter('all');
}
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => revealHashProject(link.getAttribute('href'))));
window.addEventListener('hashchange', () => { revealHashProject(location.hash); });
revealHashProject(location.hash);

const pressPhoto = document.querySelector('.press-photo');
function showPressPhotoFallback() {
 if (!pressPhoto) return;
 pressPhoto.hidden = true;
 document.querySelector('.press-photo-fallback').hidden = false;
}
pressPhoto?.addEventListener('error', showPressPhotoFallback);
if (pressPhoto?.complete && pressPhoto.naturalWidth === 0) showPressPhotoFallback();
