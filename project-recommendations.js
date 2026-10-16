const navigationProjects = [
  {
    "name": {
      "en": "Riseup",
      "he": "רייזאפ"
    },
    "pages": {
      "en": "project-one.html",
      "he": "project-one-he.html"
    }
  },
  {
    "name": {
      "en": "freesbe",
      "he": "freesbe"
    },
    "pages": {
      "en": "project-freesbe.html",
      "he": "project-freesbe-he.html"
    }
  },
  {
    "name": {
      "en": "Vanilla Vida",
      "he": "Vanilla Vida"
    },
    "pages": {
      "en": "project-vanilla-vida.html",
      "he": "project-vanilla-vida-he.html"
    }
  },
  {
    "name": {
      "en": "Coeo",
      "he": "Coeo"
    },
    "pages": {
      "en": "project-coeo.html",
      "he": "project-coeo-he.html"
    }
  },
  {
    "name": {
      "en": "Elite Coffee",
      "he": "קפה עלית"
    },
    "pages": {
      "en": "project-elite-coffee.html",
      "he": "project-elite-coffee-he.html"
    }
  },
  {
    "name": {
      "en": "Cellcom",
      "he": "סלקום"
    },
    "pages": {
      "en": "project-cellcom.html",
      "he": "project-cellcom-he.html"
    }
  }
];

function renderNextProject() {
  const pageName = window.location.pathname.split('/').pop();
  const language = document.documentElement.lang === 'he' ? 'he' : 'en';
  const current = navigationProjects.findIndex(project => project.pages[language] === pageName);
  const main = document.querySelector('.project-page');
  if (current < 0 || !main) return;
  const next = navigationProjects[(current + 1) % navigationProjects.length];
  const section = main.querySelector('.next-project, .more-work') || document.createElement('section');
  section.replaceChildren();
  section.className = 'next-project';
  section.setAttribute('aria-labelledby', 'next-project-label');

  const label = document.createElement('p');
  label.id = 'next-project-label';
  label.className = 'next-project-label';
  label.textContent = language === 'he' ? 'לפרויקט הבא' : 'Next Project';
  const heading = document.createElement('h2');
  const link = document.createElement('a');
  link.className = 'next-project-link';
  link.href = next.pages[language];
  const name = document.createElement('bdi');
  name.dir = 'auto';
  name.textContent = next.name[language];
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  arrow.setAttribute('viewBox', '0 0 32 32');
  arrow.setAttribute('aria-hidden', 'true');
  arrow.setAttribute('focusable', 'false');
  arrow.classList.add('next-project-arrow');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M4 16h24M18 6l10 10-10 10');
  arrow.append(path);
  link.append(name, arrow);
  heading.append(link);
  section.append(label, heading);
  main.append(section);
}

renderNextProject();
