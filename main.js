// APNA FPS BOOSTER — website interactions
// Edit navigation and screenshot-preview behavior here.

const menuToggle=document.getElementById('menuToggle');
const navlinks=document.getElementById('navlinks');
menuToggle.addEventListener('click',()=>{const open=navlinks.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.textContent=open?'✕':'☰';});
navlinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navlinks.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.textContent='☰';}));
// Internal page links intentionally use the current tab, preserving normal browser Back navigation.
const imageLightbox=document.getElementById('imageLightbox');
const lightboxImage=document.getElementById('lightboxImage');
const lightboxClose=document.getElementById('lightboxClose');
document.querySelectorAll('.image-preview').forEach(link=>{
  link.addEventListener('click',event=>{
    event.preventDefault();
    const img=link.querySelector('img');
    lightboxImage.src=img.currentSrc||img.src;
    lightboxImage.alt=img.alt||'Screenshot preview';
    if(typeof imageLightbox.showModal==='function') imageLightbox.showModal();
  });
});
lightboxClose.addEventListener('click',()=>imageLightbox.close());
document.addEventListener('keydown',event=>{
  if(event.key==='Escape' && imageLightbox.open) imageLightbox.close();
});

imageLightbox.addEventListener('click',event=>{if(event.target===imageLightbox) imageLightbox.close();});
imageLightbox.addEventListener('close',()=>{lightboxImage.src='';});


// Theme: device preference by default; a visitor's choice is saved on this device.
(function(){
  const root=document.documentElement;
  const toggle=document.getElementById('themeToggle');
  if(!toggle) return;
  const icon=toggle.querySelector('.theme-icon');
  const systemDark=window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  let saved=null;
  try{saved=localStorage.getItem('apnafps-theme');}catch(e){}
  function applyTheme(theme){
    root.setAttribute('data-theme',theme);
    const dark=theme==='dark';
    if(icon) icon.textContent=dark?'☀':'☾';
    toggle.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');
    toggle.setAttribute('title',dark?'Switch to light mode':'Switch to dark mode');
  }
  applyTheme(saved==='dark'||saved==='light'?saved:(systemDark&&systemDark.matches?'dark':'light'));
  toggle.addEventListener('click',function(){
    const next=root.getAttribute('data-theme')==='dark'?'light':'dark';
    applyTheme(next);
    try{localStorage.setItem('apnafps-theme',next);}catch(e){}
  });
  if(systemDark){
    const onSystemChange=function(event){
      let manual=null;try{manual=localStorage.getItem('apnafps-theme');}catch(e){}
      if(manual!=='dark'&&manual!=='light') applyTheme(event.matches?'dark':'light');
    };
    if(systemDark.addEventListener) systemDark.addEventListener('change',onSystemChange);
    else if(systemDark.addListener) systemDark.addListener(onSystemChange);
  }
})();


// FAQ: keep the page compact by showing three questions initially.
const faqList = document.querySelector('.seo-faq-list');
const faqMoreToggle = document.getElementById('faqMoreToggle');
if (faqList && faqMoreToggle) {
  const faqItems = faqList.querySelectorAll(':scope > details');
  if (faqItems.length <= 3) {
    faqMoreToggle.hidden = true;
  } else {
    faqMoreToggle.addEventListener('click', () => {
      const expanded = faqList.classList.toggle('faq-expanded');
      faqMoreToggle.setAttribute('aria-expanded', String(expanded));
      faqMoreToggle.innerHTML = expanded
        ? 'Show fewer FAQs <span aria-hidden="true">⌃</span>'
        : 'Show more FAQs <span aria-hidden="true">⌄</span>';
    });
  }
}
