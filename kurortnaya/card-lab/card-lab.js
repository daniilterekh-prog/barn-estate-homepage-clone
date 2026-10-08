const modeButtons = document.querySelectorAll("[data-card-mode]");
const cardPanels = document.querySelectorAll("[data-card-panel]");
const favoriteButtons = document.querySelectorAll(".apartment-card__favorite");

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedMode = button.dataset.cardMode;

    modeButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    cardPanels.forEach((panel) => {
      panel.hidden = panel.dataset.cardPanel !== selectedMode;
    });
  });
});

favoriteButtons.forEach((favoriteButton) => {
  favoriteButton.addEventListener("click", () => {
    const isFavorite = favoriteButton.getAttribute("aria-pressed") === "true";
    favoriteButton.setAttribute("aria-pressed", String(!isFavorite));
    favoriteButton.setAttribute(
      "aria-label",
      isFavorite ? "Добавить в избранное" : "Удалить из избранного",
    );
  });
});
