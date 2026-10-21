document.getElementById('year').textContent = new Date().getFullYear();
// Add your real video URL here when ready.
const FEATURED_VIDEO_URL = '';
document.getElementById('videoLink').addEventListener('click', function(e){
  e.preventDefault();
  if (FEATURED_VIDEO_URL) window.open(FEATURED_VIDEO_URL, '_blank', 'noopener');
  else alert('Featured video placeholder: add your YouTube/video URL in the HTML.');
});
