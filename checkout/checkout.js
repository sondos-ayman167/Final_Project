class Promo {
  constructor(code, discountPercent = 0, freeShipping = false, minPurchase = 0, description = "") {
    this.code = code;
    this.discountPercent = discountPercent;
    this.freeShipping = freeShipping;
    this.minPurchase = minPurchase;
    this.description = description;
  }

  isValid(cartTotal) {
    if (this.minPurchase && cartTotal < this.minPurchase) {
      return false;
    }
    return true;
  }
}

class OrderManager {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("myshop_cart")) || [];
    this.orders = JSON.parse(localStorage.getItem("myshop_orders")) || [];
    this.user = JSON.parse(localStorage.getItem("myshop_loggedInUser"));
    this.promoCodes = [
      new Promo("SO10", 10, false, 0, "10% off on all products"),
      new Promo("FREE", 0, true, 0, "Free shipping on orders"),
      new Promo("SO20", 20, false, 100, "20% off on orders above $100"),
      new Promo("SO40", 40, false, 500, "40% off on orders above $500"),
    ];
    this.appliedPromo = null;
  }

  getCartTotal() {
    return this.cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  }

  validatePromo(code) {
    const promo = this.promoCodes.find(p => p.code.toUpperCase() === code.toUpperCase());
    if (!promo) {
      return { valid: false, message: "Invalid promo code." };
    }
    if (!promo.isValid(this.getCartTotal())) {
      return { valid: false, message: `Minimum purchase of $${promo.minPurchase} required.` };
    }
    this.appliedPromo = promo;
    return { valid: true, promo };
  }

  getDiscountedTotal() {
    const total = this.getCartTotal();
    if (this.appliedPromo && this.appliedPromo.discountPercent) {
      return total * (1 - this.appliedPromo.discountPercent / 100);
    }
    return total;
  }

  async placeOrder(paymentMethod) {
    if (!this.user) {
      throw new Error("Please login before checkout.");
    }
    if (this.cart.length === 0) {
      throw new Error("Your cart is empty.");
    }
    const finalTotal = this.getDiscountedTotal();

    await this.simulatePayment(finalTotal, paymentMethod);

    const newOrder = {
      id: Date.now(),
      user: this.user.email,
      items: this.cart,
      total: finalTotal,
      promoCode: this.appliedPromo ? this.appliedPromo.code : null,
      date: new Date().toISOString(),
      status: "Pending",
      paymentMethod,
    };
    this.orders.push(newOrder);
    localStorage.setItem("myshop_orders", JSON.stringify(this.orders));
    localStorage.removeItem("myshop_cart");

    this.sendConfirmationEmail(this.user.email, newOrder);
  }

  simulatePayment(totalAmount, paymentMethod) {
    return new Promise((resolve, reject) => {
      console.log(`Processing payment of $${totalAmount} via ${paymentMethod}...`);
      setTimeout(() => {
        const success = Math.random() > 0.1;
        if (success) {
          resolve(`Payment successful via ${paymentMethod}!`);
        } else {
          reject(`Payment via ${paymentMethod} failed. Please try again.`);
        }
      }, 2000);
    });
  }

  sendConfirmationEmail(userEmail, orderDetails) {
    console.log(`Sending confirmation email to ${userEmail}...`);
    console.log("Order details:", orderDetails);
    alert(`Confirmation email sent to ${userEmail}!`);
  }
}

const promoInput = document.getElementById("promoCode");
const applyPromoBtn = document.getElementById("applyPromo");
const checkoutBtn = document.getElementById("checkoutBtn");
const totalDisplay = document.getElementById("totalAmount");
const paymentForm = document.getElementById("paymentForm");

const orderManager = new OrderManager();

totalDisplay.textContent = orderManager.getCartTotal().toFixed(2);

applyPromoBtn.addEventListener("click", () => {
  const code = promoInput.value.trim();
  const result = orderManager.validatePromo(code);

  if (!result.valid) {
    alert(result.message);
    orderManager.appliedPromo = null;
    totalDisplay.textContent = orderManager.getCartTotal().toFixed(2);
    return;
  }

  totalDisplay.textContent = orderManager.getDiscountedTotal().toFixed(2);
  alert(`Promo applied: ${result.promo.description}`);
});

checkoutBtn.addEventListener("click", async () => {
  try {
    const formData = new FormData(paymentForm);
    const paymentMethod = formData.get("paymentMethod") || "default";

    await orderManager.placeOrder(paymentMethod);

    alert("Order placed successfully! Confirmation email sent.");
    window.location.href = "../orders/orders.html";
  } catch (error) {
    alert(error.message || error);
  }
});
