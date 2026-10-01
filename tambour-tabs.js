const audienceTabs = [...document.querySelectorAll("[data-audience-tab]")];

if (audienceTabs.length) {
  const panel = document.querySelector(".tambour-audience-panel");
  const description = document.querySelector("[data-audience-description]");
  const frame = document.querySelector("[data-audience-frame]");
  const image = document.querySelector("[data-audience-image]");

  const selectAudience = (tab, moveFocus = false) => {
    audienceTabs.forEach((candidate) => {
      const isSelected = candidate === tab;
      candidate.setAttribute("aria-selected", String(isSelected));
      candidate.tabIndex = isSelected ? 0 : -1;
    });

    panel.setAttribute("aria-labelledby", tab.id);
    description.textContent = tab.dataset.description;
    image.src = tab.dataset.image;
    image.width = Number(tab.dataset.width);
    image.height = Number(tab.dataset.height);
    image.alt = tab.dataset.alt;
    frame.scrollTop = 0;

    if (moveFocus) tab.focus({ preventScroll: true });
  };

  audienceTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectAudience(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (index + 1) % audienceTabs.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (index - 1 + audienceTabs.length) % audienceTabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = audienceTabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      selectAudience(audienceTabs[nextIndex], true);
    });
  });
}
