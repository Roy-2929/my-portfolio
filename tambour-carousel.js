const tambourCarousel = document.querySelector("[data-tambour-carousel]");

if (tambourCarousel) {
  const viewport = tambourCarousel.querySelector("[data-tambour-carousel-viewport]");
  const track = tambourCarousel.querySelector("[data-tambour-carousel-track]");
  const slides = [...track.children];
  const cloneCount = 2;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let current = 0;
  let isMoving = false;
  let pointerId = null;
  let pointerStartX = 0;
  let dragDistance = 0;

  const makeClone = (slide) => {
    const clone = slide.cloneNode(true);
    clone.dataset.tambourCarouselClone = "";
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("inert", "");
    return clone;
  };

  slides.slice(-cloneCount).reverse().forEach((slide) => {
    track.prepend(makeClone(slide));
  });
  slides.slice(0, cloneCount).forEach((slide) => {
    track.append(makeClone(slide));
  });

  const metrics = () => {
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return {
      step: slideWidth + gap,
      centeredOffset: (viewport.clientWidth - slideWidth) / 2,
    };
  };

  const render = ({ animate = true, drag = 0 } = {}) => {
    const { step, centeredOffset } = metrics();
    const offset = centeredOffset - (cloneCount + current) * step + drag;
    track.style.transition = animate ? "" : "none";
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
  };

  const finishMove = () => {
    if (current >= slides.length) current = 0;
    if (current < 0) current = slides.length - 1;
    render({ animate: false });
    track.getBoundingClientRect();
    track.style.transition = "";
    isMoving = false;
  };

  const move = (change) => {
    if (isMoving || pointerId !== null) return;
    isMoving = true;
    current += change;
    render();
    if (prefersReducedMotion.matches) finishMove();
  };

  track.addEventListener("transitionend", (event) => {
    if (event.propertyName === "transform" && isMoving) finishMove();
  });

  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
  });

  viewport.addEventListener("pointerdown", (event) => {
    if (isMoving || event.button !== 0) return;
    pointerId = event.pointerId;
    pointerStartX = event.clientX;
    dragDistance = 0;
    viewport.setPointerCapture(pointerId);
    viewport.classList.add("is-dragging");
    track.style.transition = "none";
  });

  viewport.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;
    const { step } = metrics();
    dragDistance = Math.max(-step, Math.min(step, event.clientX - pointerStartX));
    render({ animate: false, drag: dragDistance });
  });

  const finishDrag = (event) => {
    if (event.pointerId !== pointerId) return;
    const threshold = Math.min(100, viewport.clientWidth * 0.12);
    viewport.classList.remove("is-dragging");
    pointerId = null;
    track.style.transition = "";

    if (Math.abs(dragDistance) >= threshold) {
      move(dragDistance < 0 ? 1 : -1);
    } else if (dragDistance) {
      isMoving = true;
      render();
    } else {
      render({ animate: false });
    }
    dragDistance = 0;
  };

  viewport.addEventListener("pointerup", finishDrag);
  viewport.addEventListener("pointercancel", finishDrag);
  window.addEventListener("resize", () => render({ animate: false }));
  render({ animate: false });
}
