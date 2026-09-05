import { pages } from "./pages/index.js";
import { renderPage } from "./components/render.js";

const app = document.querySelector("#app");
const reviewRequested = new URLSearchParams(window.location.search).get("notes") === "1";
const requestedPage = new URLSearchParams(window.location.search).get("page");
const cleanPath = window.location.pathname.replace(/\/+$/, "") || "/";
const pathPage = cleanPath === "/design" ? "blank" : null;
const pageKey = requestedPage || pathPage || app.dataset.page || "homepage";
const page = pages[pageKey] || pages.homepage;
const notesEnabled = reviewRequested && page.key !== "blank";

document.body.dataset.notes = String(notesEnabled);
document.body.dataset.page = page.key;
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

const campaignHero = document.querySelector(".section--campaign-hero");
if (campaignHero) {
  const slides = [...campaignHero.querySelectorAll(".campaign-slide")];
  const dots = [...campaignHero.querySelectorAll("[data-campaign-index]")];
  const announcer = campaignHero.querySelector(".campaign-hero__announcer");
  const interval = Number(campaignHero.querySelector(".campaign-hero__stage")?.dataset.interval) || 7000;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = 0;
  let timer = null;
  let paused = reducedMotion;

  const stopAutoplay = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (!paused) timer = window.setInterval(() => showSlide(activeIndex + 1), interval);
  };

  const showSlide = (requestedIndex) => {
    activeIndex = (requestedIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.inert = !isActive;
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
    const activeTitle = slides[activeIndex].getAttribute("aria-label") || "";
    if (announcer) announcer.textContent = activeTitle;
    startAutoplay();
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => showSlide(Number(dot.dataset.campaignIndex)));
  });

  campaignHero.addEventListener("mouseenter", stopAutoplay);
  campaignHero.addEventListener("mouseleave", startAutoplay);
  campaignHero.addEventListener("focusin", stopAutoplay);
  campaignHero.addEventListener("focusout", (event) => {
    if (!campaignHero.contains(event.relatedTarget)) startAutoplay();
  });

  startAutoplay();
}

if (requestedPage && !pages[requestedPage]) {
  console.warn(`Unknown playground page: ${requestedPage}. Showing homepage.`);
}
