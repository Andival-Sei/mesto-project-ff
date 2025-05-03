import "./pages/index.css"; // добавьте импорт главного файла стилей
import {
  initialCards,
  createCard,
  deleteCard,
  handleLikeButtonClick,
  handleCardImageClick,
} from "./components/cards.js";
import { openModal, closeModal } from "./components/modal.js";

// Получаем шаблон карточки из HTML
const cardTemplate = document.querySelector("#card-template").content;

// Получаем контейнер для карточек
const placesList = document.querySelector(".places__list");

// Попап для редактирования профиля
const editProfilePopup = document.querySelector(".popup_type_edit");
const editButton = document.querySelector(".profile__edit-button");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const formElement = document.querySelector('form[name="edit-profile"]');
const nameInput = formElement.querySelector('input[name="name"]');
const jobInput = formElement.querySelector('input[name="description"]');

// Попап для добавления карточки
const addButton = document.querySelector(".profile__add-button");
const addCardPopup = document.querySelector(".popup_type_new-card");
const addCardForm = document.forms["new-place"];
const placeNameInput = addCardForm.elements["place-name"];
const placeLinkInput = addCardForm.elements["link"];

// Кнопка и попап для просмотра картинки (например, открывается по клику на картинку карточки)
const imagePopup = document.querySelector(".popup_type_image");
const imagePopupImage = imagePopup.querySelector(".popup__image");
const imagePopupCaption = imagePopup.querySelector(".popup__caption");

// Получаем кнопку закрытия модального окна
// const closeButton = editProfilePopup.querySelector(".popup__close");
// Получаем все модальные окна
const popups = document.querySelectorAll(".popup");

// Функция создания карточки

// Функция отображения карточек на странице
function renderCards() {
  // Перебираем массив карточек и добавляем каждую на страницу
  initialCards.forEach((cardData) => {
    const cardElement = createCard(
      cardData,
      deleteCard,
      handleLikeButtonClick,
      handleCardImageClick
    );
    placesList.append(cardElement);
  });
}

// Вызываем функцию отображения карточек при загрузке страницы
renderCards();

popups.forEach((popup) => {
  const closeButton = popup.querySelector(".popup__close");
  closeButton.addEventListener("click", () => closeModal(popup));
});

popups.forEach((popup) => {
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target === evt.currentTarget) {
      closeModal(popup);
    }
  });
});

function handleFormSubmit(evt) {
  evt.preventDefault(); // Отменяем стандартную отправку формы

  // Получаем значения из инпутов
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;

  // Вставляем новые значения на страницу
  profileTitle.textContent = nameValue;
  profileDescription.textContent = jobValue;

  // Закрываем попап
  closeModal(editProfilePopup);
}

formElement.addEventListener("submit", handleFormSubmit);

editButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(editProfilePopup);
});
addButton.addEventListener("click", () => openModal(addCardPopup));

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  // Получаем значения из инпутов
  const name = placeNameInput.value;
  const link = placeLinkInput.value;

  // Создаём новую карточку
  const newCard = createCard(
    { name, link },
    deleteCard,
    handleLikeButtonClick,
    handleCardImageClick
  );

  // Добавляем карточку в начало списка
  placesList.prepend(newCard);

  // Закрываем попап
  closeModal(addCardPopup);

  // Очищаем форму
  addCardForm.reset();
}

// Навешиваем обработчик на форму
addCardForm.addEventListener("submit", handleAddCardSubmit);
