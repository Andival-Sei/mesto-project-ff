// 1. Импорты модулей и стилей
import "./pages/index.css"; // Импорт основного CSS-файла
import {
  createCard,
  deleteCard,
  handleLikeButtonClick,
} from "./components/card.js"; // Импорт функций и данных для карточек
import { openModal, closeModal } from "./components/modal.js"; // Импорт функций для работы с попапами
import { enableValidation, clearValidation } from "./components/validate.js"; // Импорт функций для валидации
import { getUserInfo, getInitialCards, updateUserProfile, addCard, updateUserAvatar, removeCard } from "./components/api.js"; // Импорт функций для получения данных профиля

// 2. Глобальные переменные (DOM-элементы)
// Шаблон карточки
const cardTemplate = document.querySelector("#card-template").content;
// Контейнер для карточек
const placesList = document.querySelector(".places__list");

// Элементы для обновления аватара
const avatarEditButton = document.querySelector('.profile__image-edit-button');
const avatarPopup = document.querySelector('.popup_type_avatar');
const avatarForm = document.querySelector('form[name="avatar-update"]');
const avatarLinkInput = avatarForm.querySelector('input[name="avatar-link"]');
const profileImage = document.querySelector('.profile__image');

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
const imagePopupCaption = imagePopup.querySelector(".popup__caption")

// Элементы попапа для удаления карточки
const deleteCardPopup = document.querySelector('.popup_type_delete-card');
const deleteCardButton = deleteCardPopup.querySelector('.popup__button_delete');
let cardToDelete = null; // Переменная для хранения ссылки на удаляемую карточку

// Все попапы на странице
const popups = document.querySelectorAll(".popup");

// Конфиг валидации форм
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// 3. Функции-обработчики

// Обработчик отправки формы обновления аватара
function handleAvatarFormSubmit(evt) {
    evt.preventDefault();

    // Получаем значение из инпута
    const avatarLink = avatarLinkInput.value;

    // Получаем кнопку отправки формы
    const submitButton = avatarForm.querySelector('.popup__button');
    // Сохраняем оригинальный текст кнопки
    const originalButtonText = submitButton.textContent;
    // Меняем текст кнопки на "Сохранение..."
    submitButton.textContent = 'Сохранение...';

    // Отправляем запрос на сервер для обновления аватара
    updateUserAvatar(avatarLink)
        .then((userData) => {
            // Обновляем аватар на странице
            profileImage.style.backgroundImage = `url(${userData.avatar})`;
            // Закрываем попап
            closeModal(avatarPopup);
            // Сбрасываем форму
            avatarForm.reset();
        })
        .catch((err) => {
            console.error(`Ошибка при обновлении аватара: ${err}`);
        })
        .finally(() => {
            // Возвращаем исходный текст кнопки
            submitButton.textContent = originalButtonText;
        });
}

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

    // Получаем значения из инпутов
    const name = nameInput.value;
    const about = jobInput.value;

    // Получаем кнопку отправки формы
    const submitButton = formElement.querySelector('.popup__button');
    // Сохраняем оригинальный текст кнопки
    const originalButtonText = submitButton.textContent;
    // Меняем текст кнопки на "Сохранение..."
    submitButton.textContent = 'Сохранение...';

    // Отправляем запрос на сервер для обновления профиля
    updateUserProfile(name, about)
        .then((userData) => {
            // Обновляем данные профиля на странице
            profileTitle.textContent = userData.name;
            profileDescription.textContent = userData.about;
            // Закрываем попап
            closeModal(editProfilePopup);
        })
        .catch((err) => {
            console.error(`Ошибка при обновлении профиля: ${err}`);
        })
        .finally(() => {
            // Возвращаем исходный текст кнопки
            submitButton.textContent = originalButtonText;
        });
}

// Обработчик отправки формы добавления новой карточки
function handleAddCardSubmit(evt) {
    evt.preventDefault(); // Отменяем стандартную отправку формы

    // Получаем значения из инпутов
    const name = placeNameInput.value;
    const link = placeLinkInput.value;

    // Получаем кнопку отправки формы
    const submitButton = addCardForm.querySelector('.popup__button');
    // Сохраняем оригинальный текст кнопки
    const originalButtonText = submitButton.textContent;
    // Меняем текст кнопки на "Сохранение..."
    submitButton.textContent = 'Сохранение...';

    // Отправляем запрос на сервер для добавления карточки
    addCard(name, link)
        .then((cardData) => {
            // Создаём новую карточку с данными, полученными с сервера
            const newCard = createCard(
                cardData,
                cardTemplate,
                deleteCard,
                handleLikeButtonClick,
                handleCardImageClick,
                handleDeleteButtonClick
            );

            // Добавляем карточку в начало списка
            placesList.prepend(newCard);

            // Закрываем попап и очищаем форму
            closeModal(addCardPopup);
            addCardForm.reset();
        })
        .catch((err) => {
            console.error(`Ошибка при добавлении карточки: ${err}`);
        })
        .finally(() => {
            // Возвращаем исходный текст кнопки
            submitButton.textContent = originalButtonText;
        });
}

// Функция загрузки информации о пользователе
function loadUserInfo() {
  getUserInfo()
      .then((userData) => {
        // Обновляем данные профиля на странице
        profileTitle.textContent = userData.name;
        profileDescription.textContent = userData.about;

        // Если у пользователя есть аватар, обновляем его
        const profileImage = document.querySelector('.profile__image');
        if (userData.avatar) {
          profileImage.style.backgroundImage = `url(${userData.avatar})`;
        }

        // Сохраняем ID пользователя (может пригодиться позже)
        // Можно добавить как data-атрибут или в переменную
        profileTitle.dataset.userId = userData._id;
      })
      .catch((err) => {
        console.error(`Ошибка при загрузке информации о пользователе: ${err}`);
      });
}

// Функция для открытия попапа удаления карточки
function handleDeleteButtonClick(cardElement) {
    cardToDelete = cardElement; // Сохраняем ссылку на карточку, которую нужно удалить
    openModal(deleteCardPopup);
}

// 4. Навешивание обработчиков событий

// Отправка формы обновления аватара
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

// Открытие попапа обновления аватара
avatarEditButton.addEventListener("click", () => {
    avatarForm.reset();
    clearValidation(avatarForm, validationConfig);
    openModal(avatarPopup);
});

// Отправка формы редактирования профиля
formElement.addEventListener("submit", handleProfileFormSubmit);
// Отправка формы добавления карточки
addCardForm.addEventListener("submit", handleAddCardSubmit);

// Открытие попапа редактирования профиля
editButton.addEventListener("click", () => {
  // Подставляем актуальные значения в инпуты
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;

  clearValidation(formElement, validationConfig);

  openModal(editProfilePopup);
});

// Открытие попапа добавления карточки
addButton.addEventListener("click", () => {
  addCardForm.reset();
  clearValidation(addCardForm, validationConfig);
  openModal(addCardPopup);
});

// Обработчик клика по кнопке "Да" в попапе удаления карточки
deleteCardButton.addEventListener('click', () => {
    if (cardToDelete) {
        // Получаем ID карточки из data-атрибута
        const cardId = cardToDelete.dataset.cardId;

        // Меняем текст кнопки на "Удаление..."
        const originalButtonText = deleteCardButton.textContent;
        deleteCardButton.textContent = 'Удаление...';

        // Отправляем запрос на удаление карточки
        removeCard(cardId)
            .then(() => {
                // Если запрос успешен, удаляем карточку из DOM
                cardToDelete.remove();
                // Закрываем попап
                closeModal(deleteCardPopup);
            })
            .catch((err) => {
                console.error(`Ошибка при удалении карточки: ${err}`);
            })
            .finally(() => {
                // Возвращаем исходный текст кнопки
                deleteCardButton.textContent = originalButtonText;
                // Очищаем ссылку на удаляемую карточку
                cardToDelete = null;
            });
    }
});

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
function renderCards(cards) {
  // Перебираем массив карточек и добавляем каждую на страницу
  cards.forEach((cardData) => {
    const cardElement = createCard(
      cardData,
      cardTemplate,
      deleteCard,
      handleLikeButtonClick,
      handleCardImageClick,
      handleDeleteButtonClick
    );
    placesList.append(cardElement);
  });
}

// Загрузка данных пользователя и карточек при инициализации страницы
Promise.all([getUserInfo(), getInitialCards()])
    .then(([userData, cards]) => {
      // Обновляем данные профиля
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;

      // Если у пользователя есть аватар, обновляем его
      const profileImage = document.querySelector('.profile__image');
      if (userData.avatar) {
        profileImage.style.backgroundImage = `url(${userData.avatar})`;
      }

      // Сохраняем ID пользователя
      profileTitle.dataset.userId = userData._id;

      // Отрисовываем карточки
      renderCards(cards);
    })
    .catch((err) => {
      console.error(`Ошибка при загрузке данных: ${err}`);
    });

enableValidation(validationConfig); // Инициализация валидации
