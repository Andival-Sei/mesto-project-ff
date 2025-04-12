// @todo: Темплейт карточки

// @todo: DOM узлы

// Получаем шаблон карточки из HTML
const cardTemplate = document.querySelector('#card-template').content;

// Получаем контейнер для карточек
const placesList = document.querySelector('.places__list');

// Функция создания карточки
function createCard(cardData, deleteCard) {
  // Клонируем шаблон карточки
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  
  // Находим элементы внутри карточки
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  
  // Устанавливаем значения из данных карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  
  // Добавляем обработчик удаления карточки
  deleteButton.addEventListener('click', () => {
    deleteCard(cardElement);
  });
  
  return cardElement;
}

// Функция удаления карточки
function deleteCard(cardElement) {
  cardElement.remove();
}

// Функция отображения карточек на странице
function renderCards() {
  // Перебираем массив карточек и добавляем каждую на страницу
  initialCards.forEach(cardData => {
    const cardElement = createCard(cardData, deleteCard);
    placesList.append(cardElement);
  });
}

// Вызываем функцию отображения карточек при загрузке страницы
renderCards();
