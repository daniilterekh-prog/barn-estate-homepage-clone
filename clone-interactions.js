(() => {
  const expertImage = "https://barn-estate.ru/pictures/consultation/cta-ruslan-pruss.webp";

  const mountHomepageReferenceLabels = () => {
    const insertEyebrow = (headingSelector, className, text) => {
      document.querySelectorAll(headingSelector).forEach((heading) => {
        const previous = heading.previousElementSibling;
        if (previous?.classList.contains(className)) {
          previous.textContent = text;
          return;
        }

        const eyebrow = document.createElement("p");
        eyebrow.className = className;
        eyebrow.textContent = text;
        heading.parentElement.insertBefore(eyebrow, heading);
      });
    };

    // The services section already ships with its eyebrow in the source markup.
    // Keep it there instead of creating a second label above the same H2.
    insertEyebrow(
      ".barnes-choice__title",
      "barnes-choice__eyebrow",
      "Недвижимость по направлениям",
    );
    insertEyebrow(
      ".departments-section__title",
      "departments-section__eyebrow",
      "Выбрать направление",
    );
    insertEyebrow(
      ".about-company__title",
      "about-company__eyebrow",
      "О компании",
    );
    insertEyebrow(
      ".project-hero__title",
      "project-hero__eyebrow",
      "Избранные проекты",
    );
    insertEyebrow(
      ".reviews-section__title",
      "reviews-section__eyebrow",
      "Репутация BARNES",
    );
    insertEyebrow(
      ".team-section__title",
      "team-section__eyebrow",
      "Эксперты по недвижимости",
    );
    insertEyebrow(
      ".partners-section__title",
      "partners-section__eyebrow",
      "Международная сеть",
    );
    insertEyebrow(
      ".office-contact h2",
      "office-contact__eyebrow",
      "Связь с BARNES",
    );
    insertEyebrow(
      ".news-section__title",
      "news-section__eyebrow",
      "Медиа BARNES",
    );
    insertEyebrow(
      ".newsletter-cta__copy h2",
      "newsletter-cta__eyebrow",
      "Рассылка BARNES",
    );

    const officeAddress = document.querySelector(".office-contact__address");
    if (officeAddress && !document.querySelector(".office-contact__actions")) {
      const emailHref = officeAddress.querySelector('a[href^="mailto:"]')?.href || "mailto:moscow@barn-estate.com";
      const routeHref = "https://yandex.ru/maps/?rtext=~Москва%2C%20ул.%20Петровка%2C%20дом%2019%2C%20стр.%201&rtt=auto";
      const actions = document.createElement("div");
      actions.className = "office-contact__actions";
      actions.innerHTML = `
        <a class="office-contact__action office-contact__action--email" href="${emailHref}">
          <span>Написать на email</span>
          <span class="office-contact__action-arrow" aria-hidden="true">↗</span>
        </a>
        <a class="office-contact__action office-contact__action--route" href="${routeHref}" target="_blank" rel="noreferrer" aria-label="Проложить маршрут до офиса BARNES на улице Петровка">
          <span>Проложить маршрут</span>
          <span class="office-contact__action-arrow" aria-hidden="true">↗</span>
        </a>
      `;
      officeAddress.replaceWith(actions);
    }
  };

  setTimeout(mountHomepageReferenceLabels, 900);

  const mountExpertCard = () => {
    if (document.querySelector(".floating-expert")) return;

    const expert = document.createElement("aside");
    expert.className = "floating-expert floating-expert--ruslan";
    expert.setAttribute("aria-label", "Руслан Прус");
    expert.setAttribute("data-v-553bd346", "");
    expert.innerHTML = `
      <button type="button" class="floating-expert__card" aria-haspopup="dialog" data-v-553bd346>
        <span class="floating-expert__avatar" data-v-553bd346>
          <img src="${expertImage}" alt="Руслан Прус" width="72" height="72" loading="lazy" decoding="async" data-v-553bd346>
        </span>
        <span class="floating-expert__content" data-v-553bd346>
          <span class="floating-expert__label" data-v-553bd346>Руководитель департамента городской недвижимости</span>
          <span class="floating-expert__title" data-v-553bd346>Задать вопрос эксперту</span>
          <span class="floating-expert__name" data-v-553bd346>Руслан Прус</span>
        </span>
      </button>
      <button type="button" class="floating-expert__close" aria-label="Скрыть карточку Руслан Прус" data-v-553bd346></button>
    `;

    expert.querySelector(".floating-expert__close").addEventListener("click", (event) => {
      event.stopPropagation();
      expert.remove();
    });

    document.body.appendChild(expert);
  };

  setTimeout(mountExpertCard, 900);
})();
