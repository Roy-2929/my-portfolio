const portfolioProjects = [
  {
    "id": "riseup",
    "cardClass": "riseup-card",
    "logo": "riseup_logo.png",
    "name": {
      "en": "Riseup",
      "he": "רייזאפ"
    },
    "text": {
      "en": "How do you talk to people about their money with both empathy and resolve?",
      "he": "איך מדברים עם אנשים על הכסף שלהם ברגישות ונחישות?"
    },
    "pages": {
      "en": "project-one.html",
      "he": "project-one-he.html"
    }
  },
  {
    "id": "freesbe",
    "cardClass": "freesbe-card",
    "logo": "freesbe_logo.png",
    "name": {
      "en": "freesbe",
      "he": "freesbe"
    },
    "text": {
      "en": "When brand strategy evolves, the language has to evolve with it",
      "he": "כשאסטרטגיית המותג מתעדכנת, גם השפה חייבת לעבור שינוי"
    },
    "pages": {
      "en": "project-freesbe.html",
      "he": "project-freesbe-he.html"
    }
  },
  {
    "id": "vanilla-vida",
    "cardClass": "vanilla-vida-card",
    "logo": "vanilla_vida_logo_dark.png",
    "name": {
      "en": "Vanilla Vida",
      "he": "Vanilla Vida"
    },
    "text": {
      "en": "Scientific innovation and advanced technology, or romance and an appetizing story? Why not both?",
      "he": "חדשנות מדעית וטכנולוגיה מתקדמת או רומנטיקה וסיפור מעורר תיאבון? למה לא שניהם?"
    },
    "pages": {
      "en": "project-vanilla-vida.html",
      "he": "project-vanilla-vida-he.html"
    }
  },
  {
    "id": "coeo",
    "cardClass": "coeo-card",
    "logo": "coeo_hospitality_logonoBG.png",
    "name": {
      "en": "Coeo",
      "he": "Coeo"
    },
    "text": {
      "en": "Creating a sense of belonging before check-in",
      "he": "ליצור תחושת שייכות, עוד לפני הצ׳ק־אין"
    },
    "pages": {
      "en": "project-coeo.html",
      "he": "project-coeo-he.html"
    }
  },
  {
    "id": "caffe-elit",
    "cardClass": "caffe-elit-card",
    "logo": "caffe_elit_logo.png",
    "name": {
      "en": "Elite Coffee",
      "he": "קפה עלית"
    },
    "text": {
      "en": "When a love of coffee meets the online shopping experience",
      "he": "כשאהבה לקפה משתלבת בחוויית הקנייה אונליין"
    },
    "pages": {
      "en": "project-elite-coffee.html",
      "he": "project-elite-coffee-he.html"
    }
  },
  {
    "id": "cellcom",
    "cardClass": "cellcom-card",
    "logo": "cellcom_logo.png",
    "name": {
      "en": "Cellcom",
      "he": "סלקום"
    },
    "text": {
      "en": "How do you bring “Everything is possible” into everyday interactions without losing its ambition?",
      "he": "איך מורידים את \"הכל אפשרי\" ליומיום, בלי לוותר על התנופה?"
    },
    "pages": {
      "en": "project-cellcom.html",
      "he": "project-cellcom-he.html"
    }
  }
];

const currentProjectPages = {
  "project-one.html": "riseup",
  "project-one-he.html": "riseup",
  "project-freesbe.html": "freesbe",
  "project-freesbe-he.html": "freesbe",
  "project-vanilla-vida.html": "vanilla-vida",
  "project-vanilla-vida-he.html": "vanilla-vida",
  "project-coeo.html": "coeo",
  "project-coeo-he.html": "coeo",
  "project-elite-coffee.html": "caffe-elit",
  "project-elite-coffee-he.html": "caffe-elit",
  "project-cellcom.html": "cellcom",
  "project-cellcom-he.html": "cellcom"
};

function shuffled(projects) {
  const result = [...projects];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

function renderProjectRecommendations() {
  const pageName = window.location.pathname.split("/").pop();
  const currentProject = currentProjectPages[pageName];
  const language = document.documentElement.lang === "he" ? "he" : "en";
  const projects = shuffled(
    portfolioProjects.filter(
      (project) => project.id !== currentProject && project.pages[language],
    ),
  ).slice(0, 2);

  if (!currentProject || projects.length === 0) return;

  const section = document.querySelector(".more-work") || document.createElement("section");
  section.replaceChildren();
  section.className = "more-work";
  section.setAttribute("aria-labelledby", "more-work-title");

  const heading = document.createElement("h2");
  heading.id = "more-work-title";
  heading.textContent = language === "he" ? "עוד דוגמאות" : "More work";
  section.append(heading);

  const grid = document.createElement("div");
  grid.className = "more-work-grid";
  if (projects.length === 1) grid.classList.add("more-work-grid-single");

  projects.forEach((project) => {
    const link = document.createElement("a");
    link.className = `project-card project-card-link project-card-preview ${project.cardClass}`;
    link.href = project.pages[language];
    link.setAttribute(
      "aria-label",
      language === "he"
        ? `לצפייה בפרויקט ${project.name[language]}`
        : `View the ${project.name[language]} project`,
    );

    const logo = document.createElement("img");
    logo.className = "project-card-preview-logo";
    logo.src = project.logo;
    logo.alt = project.name[language];

    const text = document.createElement("span");
    text.className = "project-card-preview-text";
    text.textContent = project.text[language];
    link.append(logo, text);
    grid.append(link);
  });

  section.append(grid);
  document.querySelector(".project-page")?.append(section);
}

renderProjectRecommendations();
