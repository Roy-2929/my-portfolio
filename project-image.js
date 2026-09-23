const imageFigures = document.querySelectorAll(".project-image");

imageFigures.forEach((figure) => {
  const toggle = figure.querySelector(".project-image-toggle");

  if (!toggle) return;

  const updateToggle = () => {
    const pageGutter = window.matchMedia("(max-width: 40rem)").matches ? 40 : 48;
    const availableWidth = window.innerWidth - pageGutter;
    const canExpand = availableWidth - figure.getBoundingClientRect().width > 1;

    if (!figure.classList.contains("is-expanded")) {
      toggle.disabled = !canExpand;
    }
  };

  toggle.addEventListener("click", () => {
    const isExpanded = figure.classList.toggle("is-expanded");
    toggle.setAttribute("aria-label", isExpanded
      ? toggle.dataset.reduceLabel
      : toggle.dataset.enlargeLabel);
    updateToggle();
  });

  window.addEventListener("resize", updateToggle);
  updateToggle();
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const viewport = carousel.querySelector("[data-carousel-viewport]");
  const track = carousel.querySelector(".onboarding-carousel-track");
  const slides = [...carousel.querySelectorAll(".onboarding-carousel-slide")];
  const previousButton = carousel.querySelector("[data-carousel-previous]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  let current = 0;
  let touchStartX = null;

  const visibleCount = () => {
    if (window.matchMedia("(max-width: 40rem)").matches) return 1;
    if (window.matchMedia("(max-width: 56rem)").matches) return 2;
    return 3;
  };

  const render = () => {
    const visible = visibleCount();
    const lastPosition = slides.length - visible;
    current = Math.max(0, Math.min(current, lastPosition));
    const step = slides[0].getBoundingClientRect().width
      + parseFloat(getComputedStyle(track).columnGap || 0);
    track.style.transform = `translateX(${current * step}px)`;
    previousButton.disabled = current === 0;
    nextButton.disabled = current === lastPosition;
  };

  const move = (change) => {
    current += change;
    render();
  };

  previousButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));
  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && !nextButton.disabled) {
      event.preventDefault();
      move(1);
    }
    if (event.key === "ArrowRight" && !previousButton.disabled) {
      event.preventDefault();
      move(-1);
    }
  });
  viewport.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });
  viewport.addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 45) move(distance < 0 ? 1 : -1);
    touchStartX = null;
  }, { passive: true });
  window.addEventListener("resize", render);
  render();
});
