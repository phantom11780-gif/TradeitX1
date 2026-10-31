
const products = [
  {
    id: 1,
    name: "ماوس گیمینگ حرفه‌ای",
    price: 1850000,
    icon: "🖱️"
  },
  {
    id: 2,
    name: "کیبورد مکانیکال RGB",
    price: 3200000,
    icon: "⌨️"
  },
  {
    id: 3,
    name: "هدست گیمینگ",
    price: 2450000,
    icon: "🎧"
  },
  {
    id: 4,
    name: "دسته بازی",
    price: 1900000,
    icon: "🎮"
  },
  {
    id: 5,
    name: "مانیتور گیمینگ",
    price: 12500000,
    icon: "🖥️"
  },
  {
    id: 6,
    name: "میکروفون گیمینگ",
    price: 1750000,
    icon: "🎙️"
  }
];

let cart = [];

function formatPrice(price) {
  return price.toLocaleString("fa-IR") + " تومان";
}

function displayProducts() {
  const container = document.getElementById("product-list");

  container.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-image">${product.icon}</div>
      <h3>${product.name}</h3>
      <div class="price">${formatPrice(product.price)}</div>
      <button class="add-btn" onclick="addToCart(${product.id})">
        افزودن به سبد خرید
      </button>
    </div>
  `).join("");
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
  alert("محصول به سبد خرید اضافه شد!");
}

function updateCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
}

function showCart() {
  if (cart.length === 0) {
    alert("سبد خرید شما خالی است.");
    return;
  }

  let message = "🛒 سبد خرید شما:\n\n";
  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    message += `${item.name}\n`;
    message += `تعداد: ${item.quantity}\n`;
    message += `قیمت: ${formatPrice(subtotal)}\n\n`;
  });

  message += `مبلغ کل: ${formatPrice(total)}`;

  alert(message);
}

displayProducts();
