// Функция удаления карточки
function deleteCard(cardElement) {
  // Удаляет DOM-элемент карточки из разметки
  cardElement.remove();
}

// Функция-обработчик лайка карточки
function handleLikeButtonClick(evt) {
  // Переключает состояние кнопки лайка (активный/неактивный)
  evt.target.classList.toggle("card__like-button_is-active");
}

// Функция создания карточки
function createCard(
  cardData,
  cardTemplate,
  deleteCard,
  handleLikeButtonClick,
  handleCardImageClick
) {
  // Клонируем шаблон карточки
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  // Находим элементы внутри карточки
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  // Устанавливаем значения из данных карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Навешиваем обработчик удаления карточки
  deleteButton.addEventListener("click", () => {
    deleteCard(cardElement);
  });

  // Навешиваем обработчик лайка
  likeButton.addEventListener("click", handleLikeButtonClick);

  // Навешиваем обработчик открытия попапа с картинкой
  cardImage.addEventListener("click", () => handleCardImageClick(cardData));

  // Возвращаем готовый DOM-элемент карточки
  return cardElement;
}

// Экспортируем функцию createCard для использования в других модулях
export { deleteCard, handleLikeButtonClick, createCard };
