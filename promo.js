const promoCodes = [
  { code: "SO10", discountPercent: 10, description: "10% off on all products" },
  { code: "FREE", discountPercent: 0, freeShipping: true, description: "Free shipping on orders" },
  { code: "SO20", discountPercent: 20, minPurchase: 100, description: "20% off on orders above $100" },
  { code: "SO40", discountPercent: 40, minPurchase: 100, description: "40% off on orders above $500" },
];


function validatePromo(code, cartTotal) {
  const promo = promoCodes.find(p => p.code.toUpperCase() === code.toUpperCase());
  if (!promo) {
    return { valid: false, message: "Invalid promo code." };
  }
  if (promo.minPurchase && cartTotal < promo.minPurchase) {
    return { valid: false, message: `Minimum purchase of $${promo.minPurchase} required.` };
  }
  return { valid: true, promo };
}

export { validatePromo };
