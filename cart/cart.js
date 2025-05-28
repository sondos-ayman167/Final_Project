class Cart {
  constructor() {
    this.cartItemsDiv = document.getElementById("cartItems");
    this.cartSummaryDiv = document.getElementById("cartSummary");
    this.checkoutBtn = document.getElementById("checkoutBtn");

    this.checkoutBtn.addEventListener("click", () => this.handleCheckout());

    this.renderCart();
  }

  getCart() {
    const cart = localStorage.getItem("myshop_cart");
    return cart ? JSON.parse(cart) : [];
  }

  saveCart(cart) {
    localStorage.setItem("myshop_cart", JSON.stringify(cart));
  }

  renderCart() {
    let cart = this.getCart();

    if (cart.length === 0) {
      this.cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
      this.cartSummaryDiv.textContent = "";
      this.checkoutBtn.disabled = true;
      return;
    }

    this.checkoutBtn.disabled = false;
    this.cartItemsDiv.innerHTML = "";

    cart.forEach((item, idx) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";

      itemDiv.innerHTML = `
        <div class="title">${item.title}</div>
        <div class="quantity-controls">
          <button class="dec" data-idx="${idx}">-</button>
          <span>${item.quantity}</span>
          <button class="inc" data-idx="${idx}">+</button>
        </div>
        <div class="price">$${(item.price * item.quantity).toFixed(2)}</div>
        <button class="remove" data-idx="${idx}">×</button>
      `;

      this.cartItemsDiv.appendChild(itemDiv);
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.cartSummaryDiv.textContent = `Total: $${total.toFixed(2)}`;

    this.addEventListeners();
  }

  addEventListeners() {
    const cart = this.getCart();

    this.cartItemsDiv.querySelectorAll(".inc").forEach((btn) => {
      btn.addEventListener("click", () => {
        let idx = btn.dataset.idx;
        cart[idx].quantity++;
        this.saveCart(cart);
        this.renderCart();
      });
    });

    this.cartItemsDiv.querySelectorAll(".dec").forEach((btn) => {
      btn.addEventListener("click", () => {
        let idx = btn.dataset.idx;
        if (cart[idx].quantity > 1) {
          cart[idx].quantity--;
        } else {
          cart.splice(idx, 1);
        }
        this.saveCart(cart);
        this.renderCart();
      });
    });

    this.cartItemsDiv.querySelectorAll(".remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        let idx = btn.dataset.idx;
        cart.splice(idx, 1);
        this.saveCart(cart);
        this.renderCart();
      });
    });
  }

  handleCheckout() {
    const loggedInUser = localStorage.getItem("myshop_loggedInUser");
    if (!loggedInUser) {
      alert("Please login to place your order.");
      window.location.href = "../auth/auth.html";
      return;
    }

    const cart = this.getCart();
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    window.location.href = "../checkout/checkout.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Cart();
});
