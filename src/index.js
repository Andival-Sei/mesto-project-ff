// 1. Импорты модулей и стилей
import "./pages/index.css"; // Импорт основного CSS-файла
import {
  createCard,
  deleteCard,
  handleLikeButtonClick,
} from "./components/card.js"; // Импорт функций и данных для карточек
import { initialCards } from "./components/cards.js"; // Импорт функций для работы с попапами
import { openModal, closeModal } from "./components/modal.js"; // Импорт функций для работы с попапами

// 2. Глобальные переменные (DOM-элементы)
// Шаблон карточки
const cardTemplate = document.querySelector("#card-template").content;
// Контейнер для карточек
const placesList = document.querySelector(".places__list");

// Элементы профиля
const editProfilePopup = document.querySelector(".popup_type_edit");
const editButton = document.querySelector(".profile__edit-button");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const formElement = document.querySelector('form[name="edit-profile"]');
const nameInput = formElement.querySelector('input[name="name"]');
const jobInput = formElement.querySelector('input[name="description"]');

// Элементы для добавления карточки
const addButton = document.querySelector(".profile__add-button");
const addCardPopup = document.querySelector(".popup_type_new-card");
const addCardForm = document.querySelector('form[name="new-place"]');
const placeNameInput = addCardForm.querySelector('input[name="place-name"]');
const placeLinkInput = addCardForm.querySelector('input[name="link"]');

// Элементы попапа с картинкой
const imagePopup = document.querySelector(".popup_type_image");
const imagePopupImage = imagePopup.querySelector(".popup__image");
const imagePopupCaption = imagePopup.querySelector(".popup__caption");

// Все попапы на странице
const popups = document.querySelectorAll(".popup");

// 3. Функции-обработчики

// Обработчик клика по изображению карточки
function handleCardImageClick({ link, name }) {
  imagePopupImage.src = link;
  imagePopupImage.alt = name;
  imagePopupCaption.textContent = name;
  openModal(imagePopup);
}

// Обработчик отправки формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault(); // Отменяем стандартную отправку формы
  // Обновляем данные профиля на странице
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  // Закрываем попап
  closeModal(editProfilePopup);
}

// Обработчик отправки формы добавления новой карточки
function handleAddCardSubmit(evt) {
  evt.preventDefault(); // Отменяем стандартную отправку формы
  // Получаем значения из инпутов
  const name = placeNameInput.value;
  const link = placeLinkInput.value;
  // Создаём новую карточку с универсальными обработчиками
  const newCard = createCard(
    { name, link },
    cardTemplate,
    deleteCard,
    handleLikeButtonClick,
    handleCardImageClick
  );
  // Добавляем карточку в начало списка
  placesList.prepend(newCard);
  // Закрываем попап и очищаем форму
  closeModal(addCardPopup);
  addCardForm.reset();
}

// 4. Навешивание обработчиков событий

// Отправка формы редактирования профиля
formElement.addEventListener("submit", handleProfileFormSubmit);
// Отправка формы добавления карточки
addCardForm.addEventListener("submit", handleAddCardSubmit);

// Открытие попапа редактирования профиля
editButton.addEventListener("click", () => {
  // Подставляем актуальные значения в инпуты
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(editProfilePopup);
});

// Открытие попапа добавления карточки
addButton.addEventListener("click", () => openModal(addCardPopup));

// Универсальные обработчики закрытия попапов по крестику и оверлею
popups.forEach((popup) => {
  const closeButton = popup.querySelector(".popup__close");
  // Закрытие по крестику
  closeButton.addEventListener("click", () => closeModal(popup));
  // Закрытие по клику на оверлей
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target === evt.currentTarget) {
      closeModal(popup);
    }
  });
});

// 5. Инициализация (отрисовка карточек при загрузке страницы)
function renderCards() {
  // Перебираем массив карточек и добавляем каждую на страницу
  initialCards.forEach((cardData) => {
    const cardElement = createCard(
      cardData,
      cardTemplate,
      deleteCard,
      handleLikeButtonClick,
      handleCardImageClick
    );
    placesList.append(cardElement);
  });
}
renderCards(); // Отрисовываем стартовые карточки
