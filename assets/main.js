const modal = document.querySelector('#lightbox');
let imageTrigger;
document.addEventListener('click', event => {
 const button = event.target.closest('[data-image]');
 if (!button) return;
 imageTrigger = button;
 modal.querySelector('img').src = button.dataset.image;
 modal.querySelector('img').alt = button.dataset.caption;
 modal.querySelector('p').textContent = button.dataset.caption;
 modal.showModal(); document.body.classList.add('modal-open');
});
modal.querySelector('button').addEventListener('click', () => modal.close());
modal.addEventListener('click', event => { if(event.target === modal) { const rect=modal.getBoundingClientRect(); if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) modal.close(); } });
modal.addEventListener('close', () => { document.body.classList.remove('modal-open'); imageTrigger?.focus({preventScroll:true}); });
document.querySelector('#copy-email').addEventListener('click', async () => {
 const status = document.querySelector('#copy-status');
 try { await navigator.clipboard.writeText('haileyk0022@gmail.com'); status.textContent='이메일을 복사했습니다.'; }
 catch { status.textContent='위 이메일 주소를 선택해 복사해 주세요.'; }
});
let printProjects;
window.addEventListener('beforeprint', () => {
 if (printProjects) return;
 printProjects = document.createElement('div');
 printProjects.id = 'print-projects';
 printProjects.append(document.querySelector('#project-library').content.cloneNode(true));
 printProjects.querySelectorAll('details').forEach(detail => { detail.open = true; });
 document.querySelector('#projects').append(printProjects);
});
window.addEventListener('afterprint', () => { printProjects?.remove(); printProjects = null; });

document.querySelector('#print').addEventListener('click',()=>window.print());
const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){document.querySelectorAll('#main-nav a').forEach(a=>{const active=a.getAttribute('href')==='#'+e.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}},{rootMargin:'-15% 0px -60% 0px'});
['about','bookshelf','experience','contact'].forEach(id=>observer.observe(document.getElementById(id)));

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
// Image fallback also works for project pages cloned from the book library.
function showPressPhotoFallback(photo) {
 photo.hidden = true;
 const fallback = photo.parentElement.querySelector('.press-photo-fallback');
 if (fallback) fallback.hidden = false;
}
document.addEventListener('error', event => {
 if (event.target.matches?.('.press-photo')) showPressPhotoFallback(event.target);
}, true);
