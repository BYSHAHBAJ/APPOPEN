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
