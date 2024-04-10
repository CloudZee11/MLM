document.addEventListener("DOMContentLoaded", () => {
  const currentUrl = window.location.pathname;

  if (currentUrl) {
    const normalizedCurrentUrl = currentUrl.toLowerCase().replace(/\s+/g, '');
    const sidebarLinks = document.querySelectorAll('.sidebar a');

    

    sidebarLinks.forEach(link => {
      const href = link.getAttribute('href');

      if (href) {
        const normalizedHref = normalizeHref(href).toLowerCase();
        if (normalizedCurrentUrl.includes(normalizedHref)) {
          link.classList.add('active');
        }
      } else {
        console.warn('Link has no href attribute:', link);
      }
    });
  }
});

function normalizeHref(href) {
  const url = new URL(href, window.location.origin);
  return url.pathname.replace(/\s+/g, '');
}
