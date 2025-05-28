class OrdersManager {
  constructor() {
    this.ordersKey = "myshop_orders";
    this.userKey = "myshop_loggedInUser";
  }

  async getOrders() {
    
    return new Promise((resolve) => {
      const orders = localStorage.getItem(this.ordersKey);
      resolve(orders ? JSON.parse(orders) : []);
    });
  }

  async getLoggedInUserEmail() {
    return new Promise((resolve) => {
      const user = localStorage.getItem(this.userKey);
      resolve(user ? JSON.parse(user).email : null);
    });
  }

  async saveOrders(orders) {
    return new Promise((resolve) => {
      localStorage.setItem(this.ordersKey, JSON.stringify(orders));
      resolve(true);
    });
  }

  async deleteOrder(orderId) {
    const orders = await this.getOrders();
    const filteredOrders = orders.filter((order) => order.id.toString() !== orderId.toString());
    await this.saveOrders(filteredOrders);
  }

  async getUserOrders() {
    const [orders, userEmail] = await Promise.all([this.getOrders(), this.getLoggedInUserEmail()]);
    if (!userEmail) return null;
    return orders.filter((order) => order.user === userEmail);
  }
}

const ordersList = document.getElementById("ordersList");
const manager = new OrdersManager();

async function renderOrders() {
  const userOrders = await manager.getUserOrders();

  if (userOrders === null) {
    ordersList.innerHTML = "<p>Please login to see your orders.</p>";
    return;
  }

  if (userOrders.length === 0) {
    ordersList.innerHTML = "<p>You have no orders yet.</p>";
    return;
  }

  ordersList.innerHTML = "";

  userOrders.forEach((order) => {
    const orderDiv = document.createElement("div");
    orderDiv.className = "order-card";

    orderDiv.innerHTML = `
      <div class="order-header">
        <span>Order ID: ${order.id}</span>
        <span>Date: ${order.date}</span>
        <span class="status">${order.status}</span>
        <button class="delete-order-btn" data-id="${order.id}">Delete</button>
      </div>
      <div class="order-items">
        ${order.items
          .map(
            (item) =>
              `<div class="order-item">${item.quantity} x ${item.title} - $${(item.price * item.quantity).toFixed(2)}</div>`
          )
          .join("")}
      </div>
    `;

    ordersList.appendChild(orderDiv);
  });

  document.querySelectorAll(".delete-order-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const orderId = btn.dataset.id;
      if (confirm("Are you sure you want to delete this order?")) {
        await manager.deleteOrder(orderId);
        renderOrders();
      }
    });
  });
}

renderOrders();
