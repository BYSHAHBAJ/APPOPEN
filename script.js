document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Video thumbnail and title link directly to the supplied YouTube video.
  // SEO video description is intentionally kept in structured metadata, not displayed on the page.
});
