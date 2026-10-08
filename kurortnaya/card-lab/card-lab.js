const favoriteButton = document.querySelector(".apartment-card__favorite");

favoriteButton?.addEventListener("click", () => {
  const isFavorite = favoriteButton.getAttribute("aria-pressed") === "true";
  favoriteButton.setAttribute("aria-pressed", String(!isFavorite));
  favoriteButton.setAttribute(
    "aria-label",
    isFavorite ? "Добавить в избранное" : "Удалить из избранного",
  );
});
