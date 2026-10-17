document.addEventListener('DOMContentLoaded', () => {
  const orderDialog = document.getElementById('order-dialog');
  const orderButtons = document.querySelectorAll('[data-product]');
  const closeDialogButton = document.getElementById('close-order-dialog');
  const selectedProductInput = document.getElementById('selected-product');
  const orderForm = document.getElementById('order-form');
  const successMessage = document.getElementById('success-message');

  // Открытие модалки
  if (orderDialog && orderButtons.length > 0) {
    orderButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const productName = button.dataset.product;
        if (selectedProductInput) selectedProductInput.value = productName;
        orderDialog.showModal();
      });
    });
  }

  // Закрытие модалки
  if (closeDialogButton) {
    closeDialogButton.addEventListener('click', () => {
      orderDialog.close();
    });
  }

  // Отправка формы
  if (orderForm) {
    orderForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      if (!orderForm.checkValidity()) {
        orderForm.reportValidity();
        return;
      }

      if (successMessage) successMessage.hidden = false;
      orderForm.reset();
      orderDialog.close();
    });
  }
});