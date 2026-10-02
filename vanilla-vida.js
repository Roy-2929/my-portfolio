const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const isHebrew = document.documentElement.lang === "he";

function setVideoToggle(toggle, video) {
  const paused = video.paused;
  toggle.toggleAttribute("data-paused", paused);
  toggle.setAttribute(
    "aria-label",
    isHebrew ? (paused ? "הפעלת הסרטון" : "עצירת הסרטון") : (paused ? "Play video" : "Pause video"),
  );
}

function connectVideoToggle(toggle) {
  const video = toggle.parentElement.querySelector("video");
  if (!video) return;
  ["pointerdown", "mousedown", "touchstart"].forEach((eventName) => {
    toggle.addEventListener(eventName, (event) => event.stopPropagation());
  });
  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    if (video.paused) video.play().catch(() => setVideoToggle(toggle, video));
    else video.pause();
  });
  video.addEventListener("play", () => setVideoToggle(toggle, video));
  video.addEventListener("pause", () => setVideoToggle(toggle, video));
  setVideoToggle(toggle, video);
}

document.querySelectorAll("[data-video-toggle]").forEach(connectVideoToggle);

const headerMedia = document.querySelector(".vanilla-header-media");
if (headerMedia) {
  const headerVideo = headerMedia.querySelector("video");
  const tryHeaderPlayback = () => {
    if (reducedMotion.matches) headerVideo.pause();
    else headerVideo.play().catch(() => {});
  };
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) tryHeaderPlayback();
    else headerVideo.pause();
  }, { threshold: 0.15 }).observe(headerMedia);
  reducedMotion.addEventListener("change", tryHeaderPlayback);
  tryHeaderPlayback();
}

const carousel = document.querySelector("[data-vanilla-carousel]");
if (carousel) {
  const viewport = carousel.querySelector("[data-carousel-viewport]");
  const track = carousel.querySelector("[data-carousel-track]");
  const previous = carousel.querySelector("[data-carousel-previous]");
  const next = carousel.querySelector("[data-carousel-next]");
  const slides = [...track.children];
  const cloneCount = Math.min(2, slides.length);
  let current = 0;
  let moving = false;
  let pointerId = null;
  let startX = 0;
  let dragDistance = 0;
  let visible = false;

  const cloneSlide = (slide) => {
    const clone = slide.cloneNode(true);
    clone.dataset.carouselClone = "";
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("inert", "");
    clone.querySelectorAll("video").forEach((video) => video.removeAttribute("autoplay"));
    return clone;
  };
  slides.slice(-cloneCount).reverse().forEach((slide) => track.prepend(cloneSlide(slide)));
  slides.slice(0, cloneCount).forEach((slide) => track.append(cloneSlide(slide)));

  const allSlides = () => [...track.children];
  const metrics = () => {
    const width = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return { step: width + gap, center: (viewport.clientWidth - width) / 2 };
  };
  const render = ({ animate = true, drag = 0 } = {}) => {
    const { step, center } = metrics();
    track.style.transition = animate && !reducedMotion.matches ? "" : "none";
    track.style.transform = `translate3d(${center - (cloneCount + current) * step + drag}px, 0, 0)`;
  };
  const updateVideos = () => {
    const active = allSlides()[cloneCount + current];
    allSlides().forEach((slide) => {
      const isActive = slide === active;
      if (!slide.hasAttribute("data-carousel-clone")) {
        slide.setAttribute("aria-hidden", String(!isActive));
      }
      const video = slide.querySelector("video");
      if (!video) return;
      if (isActive && visible && !reducedMotion.matches) video.play().catch(() => {});
      else video.pause();
      const toggle = slide.querySelector("[data-video-toggle]");
      if (toggle) {
        if (!slide.hasAttribute("data-carousel-clone")) toggle.tabIndex = isActive ? 0 : -1;
        setVideoToggle(toggle, video);
      }
    });
  };
  const normalize = () => {
    if (current >= slides.length) current = 0;
    if (current < 0) current = slides.length - 1;
    render({ animate: false });
    track.getBoundingClientRect();
    track.style.transition = "";
    moving = false;
    updateVideos();
  };
  const move = (amount) => {
    if (moving || pointerId !== null) return;
    moving = true;
    current += amount;
    render();
    updateVideos();
    if (reducedMotion.matches) normalize();
  };

  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  viewport.addEventListener("pointerdown", (event) => {
    if (moving || event.button !== 0 || event.target.closest("button")) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    dragDistance = 0;
    viewport.setPointerCapture(pointerId);
    viewport.classList.add("is-dragging");
    track.style.transition = "none";
  });
  viewport.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;
    const { step } = metrics();
    dragDistance = Math.max(-step, Math.min(step, event.clientX - startX));
    render({ animate: false, drag: dragDistance });
  });
  const finishDrag = (event) => {
    if (event.pointerId !== pointerId) return;
    const distance = dragDistance;
    const threshold = Math.min(100, viewport.clientWidth * 0.12);
    viewport.classList.remove("is-dragging");
    pointerId = null;
    dragDistance = 0;
    if (Math.abs(distance) >= threshold) move(distance < 0 ? 1 : -1);
    else { moving = true; render(); if (reducedMotion.matches) normalize(); }
  };
  viewport.addEventListener("pointerup", finishDrag);
  viewport.addEventListener("pointercancel", finishDrag);
  track.addEventListener("transitionend", (event) => {
    if (event.propertyName === "transform" && moving) normalize();
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    updateVideos();
  }, { threshold: 0.15 }).observe(carousel);
  reducedMotion.addEventListener("change", () => { render({ animate: false }); updateVideos(); });
  window.addEventListener("resize", () => render({ animate: false }));
  render({ animate: false });
  updateVideos();
}
