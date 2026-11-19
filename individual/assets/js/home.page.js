// ============================================================
// home.page.js — логика ГЛАВНОЙ страницы (index.html)
// Алгоритм:
//   1. Чип выбирает категорию (или «Все»).
//   2. Загрузить товары этой категории из базы (search.js).
//   3. Дополнительно отфильтровать поиском и нарисовать карточки.
//   4. Кнопка «В корзину» кладёт товар (main.js) и обновляет шапку.
// ============================================================

const grid = document.querySelector('[data-products]');
const searchInput = document.querySelector('[data-search]');
const chips = document.querySelectorAll('[data-filter]');

// Текущий фильтр: 'all' — все товары, иначе id категории.
let activeCategory = 'all';

// ШАГ 1. Одна карточка товара (возвращает HTML-строку).
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

// ШАГ 2. Нарисовать список товаров в сетке.
const renderProducts = (products) => {
  if (products.length === 0) {
    grid.innerHTML = '<p class="empty-state" role="status">Ничего не найдено.</p>';
    return;
  }
  grid.innerHTML = products.map(createCard).join('');
};

// ШАГ 3. Подсветить выбранный чип.
const paintChips = () => {
  chips.forEach((chip) => {
    const selected = chip.dataset.filter === activeCategory;
    chip.classList.toggle('is-active', selected);
    chip.setAttribute('aria-pressed', selected);
  });
};

// ШАГ 4. Загрузить товары (категория + поиск) и показать.
const refresh = async () => {
  const text = searchInput.value.trim().toLowerCase();
  const base = (activeCategory === 'all')
    ? await getAllProducts()
    : await getProductsByCategory(activeCategory);
  const visible = base.filter((item) =>
    !text ||
    item.name.toLowerCase().includes(text) ||
    item.description.toLowerCase().includes(text)
  );
  renderProducts(visible);
};

// ШАГ 5. Клик по чипу: запомнить категорию, подсветить, обновить товары.
chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    activeCategory = chip.dataset.filter;
    paintChips();
    refresh();
  });
});

// ШАГ 6. Клик по кнопке «Добавить в корзину» (делегирование).
grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  addToCart(button.dataset.add);
  button.textContent = 'Добавлено ✓';
  setTimeout(() => { button.textContent = 'Добавить в корзину'; }, 800);
});

// ШАГ 7. Живой поиск при вводе.
searchInput.addEventListener('input', refresh);

// ШАГ 8. Старт: подсветить чип «Все» и показать все товары.
document.addEventListener('DOMContentLoaded', () => {
  paintChips();
  refresh();
});
