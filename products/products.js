const images = document.querySelectorAll('.animated-gallery img');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeBtn = document.querySelector('.close-btn');

images.forEach(img => {
  img.addEventListener('click', () => {
    modal.style.display = 'flex';
    modalImg.src = img.src;
  });
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});



class Product {
  constructor(id, title, price, image) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.image = image;
  }
}

class Cart {
  constructor() {
    this.items = this.load() || [];
  }

  load() {
    const cartData = localStorage.getItem("myshop_cart");
    return cartData ? JSON.parse(cartData) : [];
  }

  save() {
    localStorage.setItem("myshop_cart", JSON.stringify(this.items));
  }

  add(product) {
    const foundIndex = this.items.findIndex(item => item.id === product.id);
    if (foundIndex !== -1) {
      this.items[foundIndex].quantity++;
    } else {
      this.items.push({ id: product.id, title: product.title, price: product.price, quantity: 1 });
    }
    this.save();
  }
}

const productsList = document.getElementById("productsList");
const searchInput = document.getElementById("searchInput");

let allProducts = [];
const cart = new Cart();

async function fetchProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();
    
    allProducts = data.map(p => new Product(p.id, p.title, p.price, p.image));
    displayProducts(allProducts);
  } catch (err) {
    productsList.innerHTML = "<p>Failed to load products.</p>";
  }
}

function displayProducts(products) {
  productsList.innerHTML = "";
  if (products.length === 0) {
    productsList.innerHTML = "<p>No products found.</p>";
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="product-image" />
      <div class="product-title">${product.title}</div>
      <div class="product-price">$${product.price.toFixed(2)}</div>
      <button class="add-btn" data-id="${product.id}">Add to Cart</button>
    `;

    card.querySelector(".product-image").addEventListener("click", () => {
      window.location.href = `product-detail.html?id=${product.id}`;
    });

    card.querySelector(".product-title").addEventListener("click", () => {
      window.location.href = `product-detail.html?id=${product.id}`;
    });

    productsList.appendChild(card);
  });

  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const productId = Number(btn.dataset.id);
      const product = allProducts.find(p => p.id === productId);
      if (product) {
        cart.add(product);
        alert("Added to cart!");
      }
    });
  });
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = allProducts.filter((p) => p.title.toLowerCase().includes(query));
  displayProducts(filtered);
});

fetchProducts();
