import { pages } from "./pages/index.js";
import { renderPage } from "./components/render.js";

const notesEnabled = new URLSearchParams(window.location.search).get("notes") === "1";
document.body.dataset.notes = String(notesEnabled);

const app = document.querySelector("#app");
const requestedPage = new URLSearchParams(window.location.search).get("page");
const pageKey = requestedPage || app.dataset.page || "homepage";
const page = pages[pageKey] || pages.homepage;

document.title = page.title;
app.replaceChildren(renderPage(page, { notesEnabled }));

const menuToggle = document.querySelector(".nav-menu-toggle");
const navLinks = document.querySelector(".nav-links");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("nav-links--open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "Close" : "Menu";
  });
}

if (requestedPage && !pages[requestedPage]) {
  console.warn(`Unknown playground page: ${requestedPage}. Showing homepage.`);
}
