document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Video thumbnail and title link directly to the supplied YouTube video.
  // SEO video description is intentionally kept in structured metadata, not displayed on the page.

  // Screenshot lightbox for the imported screenshot gallery.
  const imageLightbox = document.getElementById("imageLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  if (imageLightbox && lightboxImage && lightboxClose) {
    document.querySelectorAll(".image-preview").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const img = link.querySelector("img");
        if (!img) return;
        lightboxImage.src = img.currentSrc || img.src;
        lightboxImage.alt = img.alt || "Screenshot preview";
        if (typeof imageLightbox.showModal === "function") imageLightbox.showModal();
        else window.open(lightboxImage.src, "_blank", "noopener");
      });
    });
    lightboxClose.addEventListener("click", () => imageLightbox.close());
    imageLightbox.addEventListener("click", (event) => {
      if (event.target === imageLightbox) imageLightbox.close();
    });
    imageLightbox.addEventListener("close", () => { lightboxImage.src = ""; });
  }

});
