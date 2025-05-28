
function simulatePayment(totalAmount, paymentMethod = "unknown") {
  return new Promise((resolve, reject) => {
    console.log(`Processing payment of $${totalAmount} via ${paymentMethod}...`);
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% نجاح
      if (success) {
        resolve(`Payment successful via ${paymentMethod}!`);
      } else {
        reject(`Payment via ${paymentMethod} failed. Please try again.`);
      }
    }, 2000);
  });
}

export { simulatePayment };
