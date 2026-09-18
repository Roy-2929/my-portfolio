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
