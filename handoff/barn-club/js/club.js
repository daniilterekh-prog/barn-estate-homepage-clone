"use strict";
const header = document.querySelector(".club-header");
const hero = document.querySelector(".club-hero");
const menu = document.querySelector("#club-menu");
const menuToggle = document.querySelector(".site-header__icon-btn");
const contacts = document.querySelector("#club-contacts");
const contactsToggle = document.querySelector(".mh-contact-toggle");
const breadcrumbs = document.querySelector(".page-breadcrumbs");
const headerLine = document.querySelector(".site-header__top");
let breadcrumbFrame = 0;

function positionBreadcrumbs() {
  breadcrumbFrame = 0;
  const canvas = document.body.getBoundingClientRect();
  const line = headerLine.getBoundingClientRect();
  const hidden = innerWidth <= 1024 || scrollY > 4 || !menu.hidden;
  const top = line.bottom + scrollY - breadcrumbs.offsetHeight - 8;
  breadcrumbs.style.width = `${Math.min(1920, canvas.width)}px`;
  breadcrumbs.style.left = `${canvas.left + Math.max(0, (canvas.width - 1920) / 2)}px`;
  breadcrumbs.style.top = `${top}px`;
  breadcrumbs.style.visibility = hidden ? "hidden" : "visible";
  breadcrumbs.inert = hidden;
  breadcrumbs.setAttribute("aria-hidden", String(hidden));
}
function scheduleBreadcrumbs() {
  if (!breadcrumbFrame)
    breadcrumbFrame = requestAnimationFrame(positionBreadcrumbs);
}
new ResizeObserver(scheduleBreadcrumbs).observe(headerLine);
window.addEventListener("resize", scheduleBreadcrumbs, { passive: true });
window.addEventListener("scroll", scheduleBreadcrumbs, { passive: true });
document.fonts.ready.then(scheduleBreadcrumbs);
scheduleBreadcrumbs();

function closeContacts() {
  contacts.hidden = true;
  contactsToggle.setAttribute("aria-expanded", "false");
}
function setMenu(open) {
  menu.hidden = !open;
  header.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  if (open) closeContacts();
  scheduleBreadcrumbs();
}
menuToggle.addEventListener("click", () => setMenu(menu.hidden));
menu.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
contactsToggle.addEventListener("click", () => {
  const open = contacts.hidden;
  setMenu(false);
  contacts.hidden = !open;
  contactsToggle.setAttribute("aria-expanded", String(open));
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!menu.hidden) {
    setMenu(false);
    menuToggle.focus();
  }
  if (!contacts.hidden) {
    closeContacts();
    contactsToggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!header.contains(event.target)) {
    setMenu(false);
    closeContacts();
  }
});
header.addEventListener("focusout", (event) => {
  if (event.relatedTarget && !header.contains(event.relatedTarget)) {
    setMenu(false);
    closeContacts();
  }
});
new IntersectionObserver(
  ([entry]) => {
    header.classList.toggle("is-sticky", !entry.isIntersecting);
  },
  { threshold: 0 },
).observe(hero);

document.querySelector("#club-inquiry").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = String(data.get("name")).trim();
  if (!name) {
    const field = form.elements.namedItem("name");
    field.setCustomValidity("Укажите своё имя.");
    field.reportValidity();
    field.addEventListener("input", () => field.setCustomValidity(""), {
      once: true,
    });
    return;
  }
  const body = [
    "Здравствуйте! Хочу узнать о предстоящих мероприятиях BARN Estate Club.",
    "",
    `Имя: ${name}`,
    `Email: ${String(data.get("email")).trim()}`,
    `Телефон: ${String(data.get("phone")).trim() || "не указан"}`,
    "",
    "Согласие с политикой конфиденциальности подтверждено.",
  ].join("\n");
  const href = `mailto:moscow@barn-estate.com?subject=${encodeURIComponent("Мероприятия BARN Estate Club")}&body=${encodeURIComponent(body)}`;
  form.querySelector(".email-fallback").href = href;
  form.querySelector(".form-status").textContent =
    "Запрос подготовлен. Отправьте письмо в своём почтовом приложении. Если оно не открылось, воспользуйтесь ссылкой ниже.";
  window.location.href = href;
});
