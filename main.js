const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navbar = document.querySelector(".navbar");
const navAnchors = document.querySelectorAll(".nav-links a");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    menuToggle.classList.toggle("active");
  });
}

function closeMobileMenu() {
  if (navLinks && navLinks.classList.contains("open")) {
    navLinks.classList.remove("open");
  }

  if (menuToggle && menuToggle.classList.contains("active")) {
    menuToggle.classList.remove("active");
  }
}

function setActiveNavItem(activeId) {
  navAnchors.forEach((link) => {
    const targetId = link.getAttribute("href")?.replace("#", "");
    link.classList.toggle("active", targetId === activeId);
  });
}

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);

  if (!target) return;

  const navbarHeight = navbar ? navbar.offsetHeight || 0 : 0;
  const offsetTop =
    target.getBoundingClientRect().top + window.scrollY - navbarHeight;

  window.scrollTo({
    top: offsetTop,
    behavior: "smooth",
  });
}

navAnchors.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (targetId && targetId.startsWith("#")) {
      event.preventDefault();
      const sectionId = targetId.replace("#", "");
      setActiveNavItem(sectionId);
      scrollToSection(sectionId);
    }

    closeMobileMenu();
  });
});

function updateNavbarState() {
  if (navbar) {
    const navbarHeight = navbar.offsetHeight || 0;
    document.documentElement.style.setProperty(
      "--navbar-height",
      `${navbarHeight}px`,
    );
    navbar.classList.toggle("scrolled", window.scrollY > 0);
  }
}

window.addEventListener("scroll", updateNavbarState, { passive: true });
window.addEventListener("resize", updateNavbarState);
updateNavbarState();

const lottieAnimation = lottie.loadAnimation({
  container: document.getElementById("lottie-cursor"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "assets/animations/animations/mouse-click.json",
});

const photoCarousel = document.querySelector(".about-photos");
const previousPhotoButton = document.querySelector(".carousel-arrow-previous");
const nextPhotoButton = document.querySelector(".carousel-arrow-next");
const aboutPhotos = document.querySelectorAll(".about-photo");
const aboutSection = document.querySelector("#about");
const sections = [
  document.querySelector("#home"),
  document.querySelector("#about"),
  document.querySelector("#projects"),
  document.querySelector("#contact"),
].filter(Boolean);
let currentPhotoIndex = 0;

function showPhoto(index) {
  aboutPhotos.forEach((photo, photoIndex) => {
    photo.classList.toggle("active", photoIndex === index);
  });
}

function movePhoto(direction) {
  currentPhotoIndex =
    (currentPhotoIndex + direction + aboutPhotos.length) % aboutPhotos.length;
  showPhoto(currentPhotoIndex);
}

if (photoCarousel && previousPhotoButton && nextPhotoButton) {
  previousPhotoButton.addEventListener("click", () => {
    movePhoto(-1);
  });

  nextPhotoButton.addEventListener("click", () => {
    movePhoto(1);
  });
}

if (sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleEntries.length) {
        setActiveNavItem(visibleEntries[0].target.id);
        return;
      }

      const currentScrollPosition = window.scrollY + window.innerHeight * 0.35;
      let activeSectionId = "home";

      sections.forEach((section) => {
        if (section.offsetTop <= currentScrollPosition) {
          activeSectionId = section.id;
        }
      });

      setActiveNavItem(activeSectionId);
    },
    { threshold: [0.25, 0.45, 0.7] },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}
