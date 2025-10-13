// Импортируем Cypress
import Cypress from 'cypress';
// Задаем базовый URL API
const BASE_URL = 'https://norma.nomoreparties.space/api';
// Функция для добавления ингредиента в конструктор
const addIngredientToConstructor = (name: string) => {
  // Находим карточку ингредиента по тексту и data-атрибуту
  cy.contains('[data-cy=ingredient-card]', name)
    .should('exist') // Проверяем, что элемент существует
    .within(() => {
      // Внутри найденного элемента
      // Находим и кликаем кнопку "Добавить"
      cy.contains('button', 'Добавить').click();
    });
};
// Начинаем описание набора тестов
describe('Страница конструктора бургера', () => {
  // Действия, выполняемые перед каждым тестом
  beforeEach(() => {
    // Перехватываем GET-запрос на получение ингредиентов
    cy.intercept('GET', `${BASE_URL}/ingredients`, {
      fixture: 'ingredients.json' // Используем фикстуру
    }).as('getIngredients');

    // Перехватываем GET-запрос на получение информации о пользователе
    cy.intercept('GET', `${BASE_URL}/auth/user`, {
      fixture: 'user.json'
    }).as('getUser');

    // Перехватываем POST-запрос на создание заказа
    cy.intercept('POST', `${BASE_URL}/orders`, (req) => {
      // Проверяем наличие ingredients в теле запроса
      expect(req.body).to.have.property('ingredients');
      req.reply({ fixture: 'order.json' }); // Отвечаем фикстурой
    }).as('createOrder');

    // Перехватываем POST-запрос на получение токена
    cy.intercept('POST', `${BASE_URL}/auth/token`, {
      statusCode: 200,
      body: {
        success: true,
        accessToken: 'Bearer mocked-access-token',
        refreshToken: 'mocked-refresh-token'
      }
    }).as('refreshToken');

    // Посещаем главную страницу
    cy.visit('/', {
      onBeforeLoad(win) {
        // Перед загрузкой страницы
        // Приводим тип окна и устанавливаем токены
        const window = win as Window & { localStorage: Storage };
        window.localStorage.setItem('refreshToken', 'test-refresh-token');
        window.document.cookie = 'accessToken=Bearer test-access-token';
      }
    });

    // Ждем завершения запросов
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  // Действия после каждого теста
  afterEach(() => {
    // Очищаем куки
    cy.clearCookies();
    // Очищаем localStorage
    cy.window().then((win) => {
      const window = win as Window & { localStorage: Storage };
      window.localStorage.clear();
    });
  });

  // Тест на добавление ингредиентов
  it('добавляет булку и начинку в конструктор', () => {
    // Добавляем ингредиенты
    addIngredientToConstructor('Краторная булка');
    addIngredientToConstructor('Филе Люминесцентного тетраодонтимформа');

    // Проверяем содержимое конструктора
    cy.get('[data-cy=burger-constructor]').should(
      'contain.text',
      'Краторная булка (верх)'
    );
    cy.get('[data-cy=constructor-item]')
      .should('have.length', 1)
      .first()
      .should('contain.text', 'Филе Люминесцентного тетраодонтимформа');
    cy.get('[data-cy=burger-constructor]').should(
      'contain.text',
      'Краторная булка (низ)'
    );
  });

  // Тест на работу модального окна
  it('открывает и закрывает модальное окно ингредиента', () => {
    // Открываем модальное окно
    cy.contains('[data-cy=ingredient-card]', 'Краторная булка')
      .find('[data-cy=ingredient-link]')
      .click();

    // Проверяем видимость модалки
    cy.get('[data-cy=modal]')
      .should('be.visible')
      .and('contain.text', 'Краторная булка');

    // Закрываем модалку
    cy.get('[data-cy=modal-close]').click(); // Кликаем по кнопке закрытия
    cy.get('[data-cy=modal]').should('not.exist'); // Проверяем исчезновение модалки

    // Переходим на главную и ждем загрузки данных
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.get('[data-cy=ingredient-card]').should('have.length.at.least', 1);

    // Открываем модальное окно другого ингредиента
    cy.contains(
      '[data-cy=ingredient-card]',
      'Филе Люминесцентного тетраодонтимформа'
    )
      .find('[data-cy=ingredient-link]')
      .click();

    // Проверяем отображение модалки
    cy.get('[data-cy=modal]')
      .should('be.visible')
      .and('contain.text', 'Филе Люминесцентного тетраодонтимформа');

    // Закрываем модалку через оверлей
    cy.get('[data-cy=modal-overlay]').click({ force: true });
    cy.get('[data-cy=modal]').should('not.exist');
  });

  // Тест на закрытие модалки по Escape
  it('закрывает модальное окно ингредиента по клавише Escape', () => {
    // Открываем модальное окно
    cy.contains('[data-cy=ingredient-card]', 'Краторная булка')
      .find('[data-cy=ingredient-link]')
      .click();

    // Проверяем видимость модалки
    cy.get('[data-cy=modal]').should('be.visible');

    // Нажимаем Escape
    cy.get('body').type('{esc}');
    cy.get('[data-cy=modal]').should('not.exist');
  });

  // Тест на создание заказа
  it('создает заказ и очищает конструктор после закрытия модалки', () => {
    // Добавляем ингредиенты в конструктор
    addIngredientToConstructor('Краторная булка');
    addIngredientToConstructor('Филе Люминесцентного тетраодонтимформа');
    addIngredientToConstructor('Соус традиционный галактический');

    // Оформляем заказ
    cy.contains('button', 'Оформить заказ').click();

    // Ждем завершения создания заказа
    cy.wait('@createOrder').then(
      ({ request, response }: { request: any; response: any }) => {
        // Проверяем тело запроса
        const body = request.body as { ingredients: string[] };
        expect(body.ingredients).to.have.length(4);
        
    /*cy.wait('@createOrder').then((interception: Cypress.Interception) => {
      const { request, response } = interception;
      // Проверяем тело запроса
      const body = request.body as { ingredients: string[] };
      expect(body.ingredients).to.have.length(4);*/

        // Проверяем ответ сервера
        expect(response?.statusCode).to.eq(200);
        const orderBody = response?.body as
          | { order: { number: number } }
          | undefined;
        expect(orderBody?.order.number).to.eq(91202);
      }
    );

    // Проверяем отображение номера заказа
    cy.get('[data-cy=modal]').should('be.visible');
    cy.get('[data-cy=order-number]').should('have.text', '91202');

    // Закрываем модалку с номером заказа
    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=modal]').should('not.exist');

    // Проверяем очистку конструктора
    cy.get('[data-cy=constructor-item]').should('have.length', 0);
    cy.get('[data-cy=burger-constructor]').should(
      'contain.text',
      'Выберите булки'
    );
    cy.get('[data-cy=burger-constructor]').should(
      'contain.text',
      'Выберите начинку'
    );
  });
}); // Закрываем блок describe
