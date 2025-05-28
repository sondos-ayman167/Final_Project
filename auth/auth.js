class Auth {
  constructor() {
    this.loginTab = document.getElementById("loginTab");
    this.registerTab = document.getElementById("registerTab");
    this.loginForm = document.getElementById("loginForm");
    this.registerForm = document.getElementById("registerForm");
    this.authMessage = document.getElementById("authMessage");

    this.initEventListeners();
  }

  initEventListeners() {
    this.loginTab.onclick = () => this.showLogin();
    this.registerTab.onclick = () => this.showRegister();

    this.registerForm.addEventListener("submit", (e) => this.handleRegister(e));
    this.loginForm.addEventListener("submit", (e) => this.handleLogin(e));
  }

  showLogin() {
    this.loginTab.classList.add("active");
    this.registerTab.classList.remove("active");
    this.loginForm.classList.remove("hidden");
    this.registerForm.classList.add("hidden");
    this.clearMessage();
  }

  showRegister() {
    this.registerTab.classList.add("active");
    this.loginTab.classList.remove("active");
    this.registerForm.classList.remove("hidden");
    this.loginForm.classList.add("hidden");
    this.clearMessage();
  }

  clearMessage() {
    this.authMessage.textContent = "";
    this.authMessage.className = "message";
  }

  getUsers() {
    const users = localStorage.getItem("myshop_users");
    return users ? JSON.parse(users) : [];
  }

  saveUsers(users) {
    localStorage.setItem("myshop_users", JSON.stringify(users));
  }

  handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    if (!name || !email || !password) {
      this.setMessage("Please fill all fields.", "error");
      return;
    }

    let users = this.getUsers();

    if (users.find((u) => u.email === email)) {
      this.setMessage("Email already registered.", "error");
      return;
    }

    users.push({ name, email, password });
    this.saveUsers(users);

    this.setMessage("Registration successful! You can now login.", "success");
    this.registerForm.reset();
  }

  handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const users = this.getUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      this.setMessage("Invalid email or password.", "error");
      return;
    }

    localStorage.setItem("myshop_loggedInUser", JSON.stringify(user));

    this.setMessage(`Welcome back, ${user.name}! Redirecting...`, "success");

    setTimeout(() => {
      window.location.href = "../products/products.html";
    }, 1500);
  }

  setMessage(text, type) {
    this.authMessage.textContent = text;
    this.authMessage.className = `message ${type}`;
  }
}


document.addEventListener("DOMContentLoaded", () => {
  new Auth();
});
