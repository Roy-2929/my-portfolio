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
  const slides = [...track.children];
  const previousButton = carousel.querySelector("[data-carousel-previous]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const cloneCount = Math.min(3, slides.length);
  let current = 0;
  let touchStartX = null;
  let isMoving = false;

  const makeClone = (slide) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("inert", "");
    clone.dataset.carouselClone = "";
    return clone;
  };

  slides.slice(-cloneCount).reverse().forEach((slide) => {
    track.prepend(makeClone(slide));
  });
  slides.slice(0, cloneCount).forEach((slide) => {
    track.append(makeClone(slide));
  });

  const render = (animate = true) => {
    const step = slides[0].getBoundingClientRect().width
      + parseFloat(getComputedStyle(track).columnGap || 0);
    track.style.transition = animate ? "" : "none";
    track.style.transform = `translateX(${(cloneCount + current) * step}px)`;
  };

  const move = (change) => {
    if (isMoving) return;
    isMoving = true;
    current += change;
    render();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (current >= slides.length) current -= slides.length;
      if (current < 0) current += slides.length;
      render(false);
      isMoving = false;
    }
  };

  track.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "transform") return;
    if (current >= slides.length) current -= slides.length;
    if (current < 0) current += slides.length;
    render(false);
    // Force the reset to be applied before transitions are restored.
    track.getBoundingClientRect();
    track.style.transition = "";
    isMoving = false;
  });

  previousButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));
  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(1);
    }
    if (event.key === "ArrowRight") {
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
  window.addEventListener("resize", () => render(false));
  render(false);
});
