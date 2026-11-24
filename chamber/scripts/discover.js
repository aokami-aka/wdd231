import { attractions } from "../data/attractions.mjs";

const grid = document.querySelector("#attractionsGrid");
const visitMessage = document.querySelector("#visitMessage");
const attractionCount = document.querySelector("#attractionCount");
const LAST_VISIT_KEY = "jpcoc-discover-last-visit";
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function displayVisitMessage() {
  const now = Date.now();
  const previousVisit = Number(localStorage.getItem(LAST_VISIT_KEY));
  let message = "Welcome! Let us know if you have any questions.";

  if (Number.isFinite(previousVisit) && previousVisit > 0) {
    const elapsed = now - previousVisit;
    if (elapsed < DAY_IN_MS) {
      message = "Back so soon! Awesome!";
    } else {
      const days = Math.floor(elapsed / DAY_IN_MS);
      message = `You last visited ${days} ${days === 1 ? "day" : "days"} ago.`;
    }
  }

  visitMessage.querySelector("p").textContent = message;
  localStorage.setItem(LAST_VISIT_KEY, String(now));
}

function createAttractionCard(attraction) {
  const card = document.createElement("article");
  card.className = "attraction-card";
  card.dataset.area = attraction.id;

  const heading = document.createElement("h2");
  heading.textContent = attraction.name;

  const figure = document.createElement("figure");
  figure.className = "attraction-figure";
  const image = document.createElement("img");
  image.src = attraction.image;
  image.alt = attraction.alt;
  image.width = 600;
  image.height = 400;
  image.loading = "lazy";
  image.decoding = "async";
  figure.append(image);

  const address = document.createElement("address");
  address.textContent = attraction.address;

  const description = document.createElement("p");
  description.className = "attraction-description";
  description.textContent = attraction.description;

  const more = document.createElement("p");
  more.className = "attraction-details";
  more.textContent = attraction.details;
  more.hidden = true;

  const button = document.createElement("button");
  button.className = "learn-more-button";
  button.type = "button";
  button.textContent = "Learn More";
  button.setAttribute("aria-expanded", "false");
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    more.hidden = expanded;
    button.textContent = expanded ? "Learn More" : "Show Less";
  });

  card.append(heading, figure, address, description, more, button);
  return card;
}

function renderAttractions() {
  if (!grid) return;
  const fragment = document.createDocumentFragment();
  attractions.forEach((attraction) => fragment.append(createAttractionCard(attraction)));
  grid.replaceChildren(fragment);
  attractionCount.textContent = `${attractions.length} places`;
}

displayVisitMessage();
renderAttractions();
