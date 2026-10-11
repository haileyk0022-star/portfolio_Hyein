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
window.addEventListener('beforeprint',()=>{previouslyOpen=[...document.querySelectorAll('details')].filter(d=>d.open);document.querySelectorAll('details').forEach(d=>d.open=true);});
window.addEventListener('afterprint',()=>document.querySelectorAll('details').forEach(d=>d.open=previouslyOpen.includes(d)));
document.querySelector('#print').addEventListener('click',()=>window.print());
const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){document.querySelectorAll('nav a').forEach(a=>{const active=a.getAttribute('href')==='#'+e.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}},{rootMargin:'-15% 0px -60% 0px'});
['about','projects','experience','contact'].forEach(id=>observer.observe(document.getElementById(id)));
