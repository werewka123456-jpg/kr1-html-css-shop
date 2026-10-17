'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.getElementById('order-dialog');
  const toast = document.getElementById('success-message');

  function showSuccess() {
    if (!toast) return;
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 4000);
  }

  // ---- Модальное окно ----
  if (dialog) {
    const hidden = document.getElementById('selected-product');
    const label = document.getElementById('dialog-product-name');
    document.querySelectorAll('[data-product]').forEach((btn) => btn.addEventListener('click', () => {
      hidden.value = btn.dataset.product;
      label.textContent = 'Товар: ' + btn.dataset.product;
      dialog.showModal();
    }));
    document.getElementById('close-order-dialog').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (ev) => { if (ev.target === dialog) dialog.close(); });
  }

  // ---- Маска телефона ----
  document.querySelectorAll('input[type="tel"]').forEach((input) => input.addEventListener('input', () => {
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
  }));

  // ---- Валидация форм ----
  const messages = {
    valueMissing: 'Заполните это поле',
    typeMismatch: 'Проверьте формат значения',
    patternMismatch: 'Проверьте формат значения',
    tooShort: 'Слишком короткое значение'
  };
  function check(field) {
    const box = field.closest('.form-field');
    if (!box) return true;
    let err = box.querySelector('.form-field__error');
    if (!err) { err = document.createElement('p'); err.className = 'form-field__error'; box.append(err); }
    const v = field.validity;
    const key = Object.keys(messages).find((k) => v[k]);
    err.textContent = key ? messages[key] : '';
    box.classList.toggle('form-field--invalid', Boolean(key));
    return !key;
  }
  document.querySelectorAll('form.order-form').forEach((form) => {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const ok = [...form.elements].filter((f) => f.willValidate).map(check).every(Boolean);
      if (!ok) { form.querySelector('.form-field--invalid :is(input,select,textarea)')?.focus(); return; }
      form.reset();
      form.querySelectorAll('.form-field__error').forEach((p) => { p.textContent = ''; });
      if (dialog && dialog.open) dialog.close();
      showSuccess();
    });
    form.addEventListener('blur', (ev) => { if (ev.target.willValidate) check(ev.target); }, true);
  });

  // ---- Фильтры каталога ----
  const grid = document.getElementById('products-grid');
  if (grid) {
    const form = document.getElementById('filters-form');
    const cards = [...grid.children];
    const count = document.getElementById('products-count');
    const empty = document.getElementById('products-empty');
    function apply() {
      const cats = [...form.querySelectorAll('input[name="category"]:checked')].map((i) => i.value);
      const from = Number(form.elements['price-from'].value) || 0;
      const to = Number(form.elements['price-to'].value) || Infinity;
      let n = 0;
      cards.forEach((c) => {
        const price = Number(c.dataset.price);
        const show = (!cats.length || cats.includes(c.dataset.category)) && price >= from && price <= to;
        c.hidden = !show;
        if (show) n++;
      });
      count.textContent = 'Найдено товаров: ' + n;
      empty.hidden = n > 0;
    }
    form.addEventListener('submit', (ev) => { ev.preventDefault(); apply(); });
    form.addEventListener('change', apply);
    form.addEventListener('reset', () => setTimeout(apply));
    apply();
  }

  // ---- Кнопка «Наверх» ----
  const top = document.getElementById('to-top');
  if (top) {
    window.addEventListener('scroll', () => { top.hidden = window.scrollY < 400; });
    top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
});
