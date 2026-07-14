const body = document.body;
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const themeToggle = document.getElementById("themeToggle");
const navLinks = document.querySelectorAll(".nav-link");
const topLinks = document.querySelectorAll('a[href="#inicio"]');
const sections = document.querySelectorAll("main section[id], header[id]");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const whatsappNumber = "5544991181059";

const setActiveNav = (targetId) => {
  navLinks.forEach((link) => link.classList.remove("active"));
  const activeLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
  if (activeLink) activeLink.classList.add("active");
};

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

topLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    setActiveNav("inicio");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") {
  body.classList.add("light");
  themeToggle.textContent = "☀";
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light");
  const isLight = body.classList.contains("light");
  themeToggle.textContent = isLight ? "☀" : "☾";
  localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document
  .querySelectorAll(".reveal")
  .forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (window.scrollY <= 90) {
        setActiveNav("inicio");
        return;
      }
      setActiveNav(entry.target.id);
    });
  },
  { rootMargin: "-35% 0px -55% 0px" },
);

sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY <= 90) setActiveNav("inicio");
  },
  { passive: true },
);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;

    projectCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const fields = ["name", "email", "subject", "message"];
  const hasEmptyField = fields.some((field) => !String(data.get(field)).trim());

  if (hasEmptyField) {
    formStatus.style.color = "var(--warning)";
    formStatus.textContent = "Preencha todos os campos antes de enviar.";
    return;
  }

  const email = String(data.get("email"));
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailIsValid) {
    formStatus.style.color = "var(--warning)";
    formStatus.textContent = "Informe um endereço de e-mail válido.";
    return;
  }

  const name = String(data.get("name")).trim();
  const subject = String(data.get("subject")).trim();
  const message = String(data.get("message")).trim();
  const whatsappMessage = [
    "Olá, Antonio! Vim pelo seu portfólio e gostaria de falar com você.",
    "",
    `Nome: ${name}`,
    `E-mail: ${email}`,
    `Assunto: ${subject}`,
    "",
    "Mensagem:",
    message,
  ].join("\n");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  formStatus.style.color = "var(--success)";
  formStatus.textContent = "Abrindo WhatsApp com sua mensagem...";
  window.location.href = whatsappUrl;
});

document.getElementById("currentYear").textContent = new Date().getFullYear();
