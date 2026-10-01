const audienceTabs = [...document.querySelectorAll("[data-audience-tab]")];

if (audienceTabs.length) {
  const panel = document.querySelector(".tambour-audience-panel");
  const description = document.querySelector("[data-audience-description]");
  const frame = document.querySelector("[data-audience-frame]");
  const image = document.querySelector("[data-audience-image]");
  const liveTitle = document.querySelector("[data-audience-title]");
  const fullPageToggle = document.querySelector("[data-full-page-toggle]");
  const fullPage = document.querySelector(".tambour-full-page");
  const fullPageImage = document.querySelector("[data-full-page-image]");

  const closeFullPage = () => {
    fullPage.hidden = true;
    fullPageToggle.setAttribute("aria-expanded", "false");
    fullPageToggle.textContent = "View full page";
  };

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
    frame.style.setProperty("--tambour-crop-height", tab.dataset.cropHeight);
    liveTitle.textContent = tab.dataset.title;
    fullPageImage.src = tab.dataset.image;
    fullPageImage.width = Number(tab.dataset.width);
    fullPageImage.height = Number(tab.dataset.height);
    fullPageImage.alt = `Full ${tab.dataset.alt.toLowerCase()}`;
    closeFullPage();

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

  fullPageToggle.addEventListener("click", () => {
    const willOpen = fullPage.hidden;
    fullPage.hidden = !willOpen;
    fullPageToggle.setAttribute("aria-expanded", String(willOpen));
    fullPageToggle.textContent = willOpen ? "Hide full page" : "View full page";
  });
}
