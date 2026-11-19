// ============================================================
// category.page.js — ОДИН скрипт для ВСЕХ страниц категорий.
// Какая именно категория нужна — читаем из data-category
// на элементе <main> (пример: <main data-category="electronics">).
// Алгоритм:
//   1. Узнать свою категорию из data-атрибута.
//   2. Загрузить товары только этой категории.
//   3. Поиск фильтрует ВНУТРИ категории.
//   4. Кнопка кладёт товар в корзину (main.js).
// ============================================================

const grid = document.querySelector('[data-products]');
const searchInput = document.querySelector('[data-search]');
const categoryId = document.querySelector('main[data-category]').dataset.category;

// ШАГ 1. Карточка товара (такая же, как на главной).
const createCard = (product) => `
  <article class="panel product-card">
    <div class="product-visual" aria-hidden="true">${product.emoji}</div>
    <h3>${product.name}</h3>
    <p class="product-description">${product.description}</p>
    <p class="price">${product.price.toLocaleString('ru-RU')}</p>
    <button
      data-add="${product.id}"
      type="button"
    >Добавить в корзину</button>
  </article>
`;

// ШАГ 2. Нарисовать товары.
const renderProducts = (products) => {
  if (products.length === 0) {
    grid.innerHTML = '<p class="empty-state" role="status">В этой категории ничего не найдено.</p>';
    return;
  }
  grid.innerHTML = products.map(createCard).join('');
};

// ШАГ 3. Взять товары категории + применить поиск.
const refresh = async () => {
  const text = searchInput.value.trim().toLowerCase();
  const ofCategory = await getProductsByCategory(categoryId);
  const visible = ofCategory.filter((item) =>
    !text ||
    item.name.toLowerCase().includes(text) ||
    item.description.toLowerCase().includes(text)
  );
  renderProducts(visible);
};

// ШАГ 4. Добавление в корзину (делегирование кликов).
grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  addToCart(button.dataset.add);
  button.textContent = 'Добавлено ✓';
  setTimeout(() => { button.textContent = 'Добавить в корзину'; }, 800);
});

// ШАГ 5. Живой поиск + стартовая отрисовка.
searchInput.addEventListener('input', refresh);
document.addEventListener('DOMContentLoaded', refresh);
