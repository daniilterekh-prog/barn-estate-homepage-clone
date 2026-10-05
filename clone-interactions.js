(() => {
  const expertImage = "https://barn-estate.ru/pictures/consultation/cta-ruslan-pruss.webp";

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
