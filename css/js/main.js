'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.getElementById('order-dialog');
  const toast = document.getElementById('success-message');

  // Функция показа сообщения об успехе
  function showSuccess() {
    if (!toast) return;
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 4000);
  }

  // ---- Модальное окно ----
  if (dialog) {
    const hiddenInput = document.getElementById('selected-product');
    const dialogTitle = document.getElementById('dialog-product-name');
    
    // Ищем все кнопки с атрибутом data-product (например, в карточках товаров)
    document.querySelectorAll('[data-product]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const productName = btn.dataset.product;
        if (hiddenInput) hiddenInput.value = productName;
        if (dialogTitle) dialogTitle.textContent = 'Товар: ' + productName;
        dialog.showModal();
      });
    });

    // Закрытие окна по кнопке
    const closeBtn = document.getElementById('close-order-dialog');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => dialog.close());
    }

    // Закрытие окна по клику на темный фон вокруг него
    dialog.addEventListener('click', (ev) => { 
      if (ev.target === dialog) dialog.close(); 
    });
  }

  // ---- Маска телефона ----
  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener('input', () => {
      let d = input.value.replace(/\D/g, '');
      if (d.startsWith('7') || d.startsWith('8')) d = d.slice(1);
      d = d.slice(0, 10);
      
      let r = '+7';
      if (d.length) r += ' (' + d.slice(0, 3);
      if (d.length >= 3) r += ')';
      if (d.length > 3) r += ' ' + d.slice(3, 6);
      if (d.length > 6) r += '-' + d.slice(6, 8);
      if (d.length > 8) r += '-' + d.slice(8, 10);
      
      input.value = r;
    });
  });

  // ---- Валидация форм (проверка заполнения) ----
  document.querySelectorAll('form.order-form').forEach((form) => {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault(); // Отменяем перезагрузку страницы

      // Встроенная проверка браузера
      if (!form.checkValidity()) {
        form.reportValidity(); // Показывает стандартные подсказки браузера
        return;
      }

      // Если всё ок:
      form.reset();
      if (dialog && dialog.open) dialog.close();
      showSuccess();
    });
  });

  // (Фильтры и кнопку "Наверх" я убрал, так как в новой простой версии HTML 
  // этих элементов больше нет. Если они понадобятся, мы их добавим отдельно).
});