import { likeCard, unlikeCard } from "./api.js";

// Функция удаления карточки (теперь просто вызывает обработчик)
function deleteCard(cardElement, handleDeleteButtonClick) {
  // Теперь используем handleDeleteButtonClick как параметр
  if (typeof handleDeleteButtonClick === "function") {
    handleDeleteButtonClick(cardElement);
  }
}

// Функция-обработчик лайка карточки
function handleLikeButtonClick(evt, cardId, likeCount) {
  const likeButton = evt.target;
  const isLiked = likeButton.classList.contains("card__like-button_is-active");

  // Выбираем подходящий метод в зависимости от текущего состояния
  const likeMethod = isLiked ? unlikeCard : likeCard;

  likeMethod(cardId)
    .then((updatedCard) => {
      // Обновляем состояние кнопки
      likeButton.classList.toggle("card__like-button_is-active");

      // Обновляем счетчик лайков из ответа сервера
      likeCount.textContent = updatedCard.likes.length;
    })
    .catch((err) => {
      console.error(`Ошибка при обновлении лайка: ${err}`);
    });
}

// Функция создания карточки
function createCard(
  cardData,
  cardTemplate,
  onDeleteCard,
  handleLikeButtonClick,
  handleCardImageClick,
  handleDeleteButtonClick,
) {
  // Клонируем шаблон карточки
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  // Сохраняем ID карточки в data-атрибуте
  cardElement.dataset.cardId = cardData._id;

  // Находим элементы внутри карточки
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");

  // Устанавливаем значения из данных карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Устанавливаем количество лайков
  likeCount.textContent = cardData.likes.length;

  // Получаем ID текущего пользователя
  const userId = document.querySelector(".profile__title").dataset.userId;

  // Проверяем, является ли текущий пользователь владельцем карточки
  if (cardData.owner && cardData.owner._id !== userId) {
    // Если не владелец - скрываем кнопку удаления
    deleteButton.style.display = "none";
  }

  // Проверяем, лайкнул ли текущий пользователь карточку
  const isLiked = cardData.likes.some((user) => user._id === userId);
  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  // Навешиваем обработчик удаления карточки
  deleteButton.addEventListener("click", () => {
    // Передаем функцию handleDeleteButtonClick в deleteCard
    onDeleteCard(cardElement, handleDeleteButtonClick);
  });

  // Навешиваем обработчик лайка
  likeButton.addEventListener("click", (evt) => {
    handleLikeButtonClick(evt, cardData._id, likeCount);
  });

  // Навешиваем обработчик открытия попапа с картинкой
  cardImage.addEventListener("click", () => handleCardImageClick(cardData));

  // Возвращаем готовый DOM-элемент карточки
  return cardElement;
}

// Экспортируем функции для использования в других модулях
export { deleteCard, handleLikeButtonClick, createCard };
