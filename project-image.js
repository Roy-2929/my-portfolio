const imageFigures = document.querySelectorAll(".project-image");

imageFigures.forEach((figure) => {
  const toggle = figure.querySelector(".project-image-toggle");

  if (!toggle) return;

  let collapsedWidth = figure.getBoundingClientRect().width;

  const getAvailableWidth = () => {
    const pageGutter = window.matchMedia("(max-width: 40rem)").matches
      ? 40
      : 48;
    return window.innerWidth - pageGutter;
  };

  const setExpanded = (isExpanded) => {
    figure.classList.toggle("is-expanded", isExpanded);
    toggle.setAttribute(
      "aria-label",
      isExpanded ? toggle.dataset.reduceLabel : toggle.dataset.enlargeLabel,
    );
    updateToggle();
  };

  const updateToggle = () => {
    const availableWidth = getAvailableWidth();

    if (!figure.classList.contains("is-expanded")) {
      collapsedWidth = figure.getBoundingClientRect().width;
      toggle.disabled = availableWidth - collapsedWidth <= 1;
    } else if (availableWidth - collapsedWidth <= 1) {
      setExpanded(false);
    }
  };

  toggle.addEventListener("click", () => {
    if (toggle.disabled) return;
    setExpanded(!figure.classList.contains("is-expanded"));
  });

  window.addEventListener("resize", updateToggle);
  new ResizeObserver(() => {
    if (!figure.classList.contains("is-expanded")) updateToggle();
  }).observe(figure);
  updateToggle();
});

document.querySelectorAll("[data-how-to-gallery]").forEach((gallery) => {
  const mainFigure = gallery.querySelector("[data-how-to-main]");
  const mainImage = mainFigure.querySelector("img");
  const mainToggle = mainFigure.querySelector(".project-image-toggle");
  const thumbnails = [...gallery.querySelectorAll("[data-how-to-thumbnail]")];
  let current = 0;
  let touchStartX = null;

  const selectImage = (index, focusThumbnail = false) => {
    current = (index + thumbnails.length) % thumbnails.length;
    const selected = thumbnails[current];

    mainImage.src = selected.dataset.src;
    mainImage.width = Number(selected.dataset.width);
    mainImage.height = Number(selected.dataset.height);
    mainImage.alt = selected.dataset.alt;
    thumbnails.forEach((thumbnail, thumbnailIndex) => {
      thumbnail.setAttribute("aria-pressed", String(thumbnailIndex === current));
    });

    if (focusThumbnail) selected.focus({ preventScroll: true });
  };

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => selectImage(index));
    thumbnail.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      selectImage(current + (event.key === "ArrowLeft" ? 1 : -1), true);
    });
  });

  mainToggle.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });
  mainToggle.addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 45) {
      event.preventDefault();
      selectImage(current + (distance < 0 ? 1 : -1));
    }
    touchStartX = null;
  });
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

document.querySelectorAll("[data-video-toggle]").forEach((toggle) => {
  const video = toggle.parentElement.querySelector("video");

  const updateToggle = () => {
    const isPaused = video.paused;
    toggle.toggleAttribute("data-paused", isPaused);
    toggle.setAttribute("aria-label", isPaused ? "Play video" : "Pause video");
  };

  toggle.addEventListener("click", () => {
    if (video.paused) {
      video.play().catch(updateToggle);
    } else {
      video.pause();
    }
  });

  video.addEventListener("play", updateToggle);
  video.addEventListener("pause", updateToggle);
  updateToggle();

  if (video.paused) video.play().catch(updateToggle);
});
