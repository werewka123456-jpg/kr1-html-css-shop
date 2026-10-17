document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. РАБОТА С МОДАЛЬНЫМ ОКНОМ (на Главной)
  // ==========================================
  const orderDialog = document.getElementById('order-dialog');
  const orderButtons = document.querySelectorAll('[data-product]');
  const closeDialogButton = document.getElementById('close-order-dialog');
  const selectedProductInput = document.getElementById('selected-product');
  const orderForm = document.getElementById('order-form');
  const successMessage = document.getElementById('success-message');

  // Открытие модального окна при клике на "Заказать"
  if (orderDialog && orderButtons.length > 0) {
    orderButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const productName = button.dataset.product;
        if (selectedProductInput) selectedProductInput.value = productName;
        orderDialog.showModal();
      });
    });
  }

  // Закрытие модального окна по кнопке "Закрыть"
  if (closeDialogButton) {
    closeDialogButton.addEventListener('click', () => {
      orderDialog.close();
    });
  }

  // Закрытие по клику на затемненный фон вокруг окна
  if (orderDialog) {
    orderDialog.addEventListener('click', (event) => {
      if (event.target === orderDialog) {
        orderDialog.close();
      }
    });
  }

  // ==========================================
  // 2. ОТПРАВКА ФОРМ (и в модалке, и на страницах)
  // ==========================================
  
  // Обработка формы внутри модального окна
  if (orderForm) {
    orderForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Отменяем перезагрузку страницы
      
      if (!orderForm.checkValidity()) {
        orderForm.reportValidity(); // Показываем встроенные ошибки браузера
        return;
      }

      if (successMessage) successMessage.hidden = false; // Показываем сообщение
      orderForm.reset(); // Очищаем поля
      orderDialog.close(); // Закрываем окно
    });
  }

  // Обработка форм на отдельных страницах (order.html, contacts.html)
  const pageForms = document.querySelectorAll('.order-form');
  pageForms.forEach((form) => {
    // Пропускаем форму из модального окна, так как мы ее уже обработали выше
    if (form.id === 'order-form') return; 

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Ищем на странице блок для сообщения об успехе
      const pageSuccessMessage = document.getElementById('success-message');
      if (pageSuccessMessage) {
        pageSuccessMessage.hidden = false;
      } else {
        // Если блока нет, просто показываем стандартный alert
        alert('Форма успешно отправлена!');
      }

      form.reset();
    });
  });

  // ==========================================
  // 3. ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ (Опционально)
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});