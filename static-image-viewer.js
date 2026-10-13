// Keep existing enlargement controls and carousel media untouched.
document.querySelectorAll('.portfolio-project-page figure').forEach((figure) => {
  if (figure.closest('[data-project-carousel], [data-carousel], [data-how-to-gallery]') || figure.querySelector('a, button')) return;
  const image = figure.querySelector(':scope > img');
  if (!image) return;
  const link = document.createElement('a');
  link.className = 'full-size-image-link';
  link.href = image.getAttribute('src');
  link.target = '_blank';
  link.rel = 'noopener';
  link.setAttribute('aria-label', document.documentElement.lang === 'he' ? 'פתיחת התמונה בגודל מלא' : 'Open full-size image');
  image.replaceWith(link);
  link.append(image);
  const icon = document.createElement('span');
  icon.className = 'full-size-image-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" /></svg>';
  link.append(icon);
});
