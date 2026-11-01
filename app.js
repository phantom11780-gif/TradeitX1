const products = [
{
id: 1,
name: "ماوس گیمینگ حرفه‌ای",
price: 1850000,
category: "ماوس",
image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=700"
},
{
id: 2,
name: "کیبورد مکانیکال RGB",
price: 3200000,
category: "کیبورد",
image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=700"
},
{
id: 3,
name: "هدست گیمینگ",
price: 2450000,
category: "هدست",
image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700"
},
{
id: 4,
name: "دسته بازی",
price: 1900000,
category: "کنترلر",
image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=700"
},
{
id: 5,
name: "مانیتور گیمینگ",
price: 12500000,
category: "مانیتور",
image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=700"
},
{
id: 6,
name: "میکروفون گیمینگ",
price: 1750000,
category: "میکروفون",
image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=700"
}
];

let cart = [];

try {
const savedCart = JSON.parse(localStorage.getItem("nova-gaming-cart"));
if (Array.isArray(savedCart)) {
cart = savedCart.filter(item =>
products.some(product => product.id === item.id) &&
Number.isInteger(item.quantity) &&
item.quantity > 0
);
}
} catch (error) {
cart = [];
}

let selectedCategory = "همه";

function formatPrice(price) {
return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

function saveCart() {
localStorage.setItem("nova-gaming-cart", JSON.stringify(cart));
}

function renderProducts() {
const container = document.getElementById("product-list");
if (!container) return;

const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");

const searchTerm = searchInput
? searchInput.value.trim().toLowerCase()
: "";

const filterCategory = categoryFilter
? categoryFilter.value
: "همه";

const activeCategory =
selectedCategory !== "همه"
? selectedCategory
: filterCategory;

const filteredProducts = products.filter(product => {
const matchesSearch = product.name
.toLowerCase()
.includes(searchTerm);

const matchesCategory =
  activeCategory === "همه" ||
  product.category === activeCategory;

return matchesSearch && matchesCategory;

});

if (filteredProducts.length === 0) {
container.innerHTML =
'<p class="empty-message">محصولی با این مشخصات پیدا نشد.</p>';
return;
}

container.innerHTML = filteredProducts.map(product => `
<article class="product-card">
<div class="product-image">
<img
src="${product.image}"
alt="${product.name}"
loading="lazy"
onerror="this.style.display='none'"
>
</div>

  <div class="product-info">
    <span class="product-category">${product.category}</span>
    <h3>${product.name}</h3>
    <p class="product-price">${formatPrice(product.price)}</p>

    <button
      class="btn btn-primary"
      type="button"
      onclick="addToCart(${product.id})"
    >
      افزودن به سبد خرید
    </button>
  </div>
</article>

`).join("");
}

function filterProducts() {
selectedCategory = "همه";
renderProducts();
}

function selectCategory(category) {
selectedCategory = category;

const filter = document.getElementById("category-filter");
if (filter) filter.value = category;

renderProducts();

const section = document.getElementById("products");
if (section) section.scrollIntoView({ behavior: "smooth" });
}

function addToCart(productId) {
const product = products.find(item => item.id === productId);
if (!product) return;

const existingItem = cart.find(item => item.id === productId);

if (existingItem) {
existingItem.quantity += 1;
} else {
cart.push({ id: productId, quantity: 1 });
}

saveCart();
renderCart();
showCart();
}

function changeQuantity(productId, amount) {
const item = cart.find(product => product.id === productId);
if (!item) return;

item.quantity += amount;

if (item.quantity <= 0) {
cart = cart.filter(product => product.id !== productId);
}

saveCart();
renderCart();
}

function removeFromCart(productId) {
cart = cart.filter(item => item.id !== productId);
saveCart();
renderCart();
}

function renderCart() {
const itemsContainer = document.getElementById("cart-items");
const totalElement = document.getElementById("cart-total");
const countElement = document.getElementById("cart-count");

let total = 0;
let count = 0;

const cartDetails = cart.map(item => {
const product = products.find(p => p.id === item.id);
if (!product) return null;

total += product.price * item.quantity;
count += item.quantity;

return { ...product, quantity: item.quantity };

}).filter(Boolean);

if (countElement) {
countElement.textContent = new Intl.NumberFormat("fa-IR").format(count);
}

if (totalElement) {
totalElement.textContent = formatPrice(total);
}

if (itemsContainer) {
if (cartDetails.length === 0) {
itemsContainer.innerHTML =
'<p class="empty-message">سبد خرید شما خالی است.</p>';
} else {
itemsContainer.innerHTML = cartDetails.map(item => `
<div class="cart-item">
<div class="cart-item-info">
<h4>${item.name}</h4>
<p>${formatPrice(item.price)}</p>
</div>

      <div class="quantity-controls">
        <button
          type="button"
          aria-label="افزایش تعداد"
          onclick="changeQuantity(${item.id}, 1)"
        >+</button>

        <span>${new Intl.NumberFormat("fa-IR").format(item.quantity)}</span>

        <button
          type="button"
          aria-label="کاهش تعداد"
          onclick="changeQuantity(${item.id}, -1)"
        >−</button>

        <button
          type="button"
          class="remove-btn"
          onclick="removeFromCart(${item.id})"
        >حذف</button>
      </div>
    </div>
  `).join("");
}

}
}

function showCart() {
const overlay = document.getElementById("cart-overlay");
const panel = document.getElementById("cart-panel");

if (overlay) overlay.classList.add("active");
if (panel) {
panel.classList.add("open");
panel.setAttribute("aria-hidden", "false");
}

document.body.style.overflow = "hidden";
}

function closeCart() {
const overlay = document.getElementById("cart-overlay");
const panel = document.getElementById("cart-panel");

if (overlay) overlay.classList.remove("active");
if (panel) {
panel.classList.remove("open");
panel.setAttribute("aria-hidden", "true");
}

document.body.style.overflow = "";
}

function startCheckout() {
if (cart.length === 0) {
alert("سبد خرید شما خالی است.");
return;
}

alert(
"برای تکمیل سفارش، ابتدا باید پنل مدیریت و سامانه ثبت سفارش NOVA GAMING راه‌اندازی شوند. پرداخت آنلاین در این فروشگاه فعال نخواهد بود."
);
}

document.addEventListener("keydown", event => {
if (event.key === "Escape") closeCart();
});

renderProducts();
renderCart();
