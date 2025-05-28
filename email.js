function sendConfirmationEmail(userEmail, orderDetails) {
  
  const notification = document.createElement('div');
  notification.className = 'email-notification';
  notification.innerHTML = `
    <strong>Confirmation Email Sent!</strong><br/>
    Email sent to: ${userEmail}
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

export { sendConfirmationEmail };
