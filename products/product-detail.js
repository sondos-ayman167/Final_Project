class Product {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.price = data.price;
    this.description = data.description;
    this.image = data.image;
  }

  renderDetail(colors) {
    return `
      <img src="${this.image}" alt="${this.title}" />
      <h2>${this.title}</h2>
      <p class="price">$${this.price.toFixed(2)}</p>
      <p class="description">${this.description}</p>

      <label for="colorSelect">Choose color:</label>
      <select id="colorSelect">
        ${colors.map(c => `<option value="${c}">${c}</option>`).join("")}
      </select>

      <label for="quantityInput">Quantity:</label>
      <input type="number" id="quantityInput" min="1" value="1" />

      <button id="addToCartBtn">Add to Cart</button>
    `;
  }

  addToCart(quantity, color) {
    const cart = JSON.parse(localStorage.getItem("myshop_cart")) || [];
    const foundIndex = cart.findIndex(item => item.id === this.id && item.color === color);

    if (foundIndex !== -1) {
      cart[foundIndex].quantity += quantity;
    } else {
      cart.push({
        id: this.id,
        title: this.title,
        price: this.price,
        quantity,
        color
      });
    }

    localStorage.setItem("myshop_cart", JSON.stringify(cart));
  }
}

const productDetail = document.getElementById("productDetail");
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (!productId) {
  productDetail.innerHTML = "<p>Invalid product ID.</p>";
} else {
  fetchProductDetail(productId);
}

async function fetchProductDetail(id) {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!res.ok) throw new Error("Failed to fetch product details");
    const data = await res.json();

    const product = new Product(data);
    const colors = ["Red", "Green", "Blue", "Black", "White"];

    productDetail.innerHTML = product.renderDetail(colors);

    document.getElementById("addToCartBtn").addEventListener("click", () => {
      const selectedColor = document.getElementById("colorSelect").value;
      const quantity = parseInt(document.getElementById("quantityInput").value);

      if (quantity < 1) {
        alert("Quantity must be at least 1.");
        return;
      }

      product.addToCart(quantity, selectedColor);
      alert(`Added ${quantity} × "${product.title}" (Color: ${selectedColor}) to cart.`);
    });

  } catch (error) {
    productDetail.innerHTML = "<p>Failed to load product details.</p>";
    console.error(error);
  }
}
