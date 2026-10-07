import { $, $$, on } from './utils.js';
import { store } from './store.js';
import { t } from './i18n.js';

export function toast(msg, type = 'info', ms = 2800) {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  $('#toast-container').appendChild(el);
  setTimeout(() => { 
    el.style.opacity = '0'; 
    el.style.transition = 'opacity .2s'; 
    setTimeout(() => el.remove(), 220); 
  }, ms);
}

export const openModal = (id) => $(`#${id}`)?.classList.add('open');
export const closeModal = (id) => $(`#${id}`)?.classList.remove('open');

export function confirmModal(message, onConfirm, okTextKey = 'yes_delete', type = 'danger') {
  $('#confirm-message').textContent = message;
  openModal('modal-confirm');
  closeDropdowns();
  
  const btnOk = $('#btn-confirm-ok');
  const btnCancel = $('#btn-confirm-cancel');
  
  const newOk = btnOk.cloneNode(true);
  const newCancel = btnCancel.cloneNode(true);
  btnOk.parentNode.replaceChild(newOk, btnOk);
  btnCancel.parentNode.replaceChild(newCancel, btnCancel);
  
  newOk.dataset.i18n = okTextKey;
  let tText = t(okTextKey, store.settings.language);
  if (tText === okTextKey) {
    if (okTextKey === 'yes_replace') tText = 'Ya, Ganti';
    else if (okTextKey === 'yes_duplicate') tText = 'Ya, Duplikasi';
    else if (okTextKey === 'yes_import') tText = 'Ya, Impor';
    else if (okTextKey === 'yes_export') tText = 'Ya, Ekspor';
    else tText = 'Ya, Hapus';
  }
  newOk.textContent = tText;
  
  if (type === 'danger') newOk.style.background = 'var(--danger)';
  else if (type === 'primary') newOk.style.background = 'var(--accent)';
  else if (type === 'success') newOk.style.background = 'var(--success)';
  else if (type === 'warning') newOk.style.background = 'var(--warning)';
  else newOk.style.background = 'var(--accent)';
  
  newOk.style.color = '#ffffff';
  newOk.style.borderColor = 'transparent';
  
  const icon = $('#confirm-title svg');
  if (icon) {
    if (type === 'danger') icon.setAttribute('stroke', 'var(--danger)');
    else if (type === 'primary') icon.setAttribute('stroke', 'var(--accent)');
    else if (type === 'warning') icon.setAttribute('stroke', 'var(--warning)');
    else if (type === 'success') icon.setAttribute('stroke', 'var(--success)');
    else icon.setAttribute('stroke', 'var(--accent)');
  }
  
  newOk.addEventListener('click', () => { closeModal('modal-confirm'); onConfirm(); });
  newCancel.addEventListener('click', () => { closeModal('modal-confirm'); });
}

export function importModal(message, onAppend, onReplace, appendLabel = null, replaceLabel = null) {
  $('#import-message').textContent = message;
  openModal('modal-import');
  closeDropdowns();
  
  const btnAppend = $('#btn-import-append');
  const btnReplace = $('#btn-import-replace');
  const btnCancel = $('#btn-import-cancel');
  
  if (appendLabel) btnAppend.textContent = appendLabel;
  if (replaceLabel) btnReplace.textContent = replaceLabel;
  
  const newAppend = btnAppend.cloneNode(true);
  const newReplace = btnReplace.cloneNode(true);
  const newCancel = btnCancel.cloneNode(true);
  
  btnAppend.parentNode.replaceChild(newAppend, btnAppend);
  btnReplace.parentNode.replaceChild(newReplace, btnReplace);
  btnCancel.parentNode.replaceChild(newCancel, btnCancel);
  
  newAppend.addEventListener('click', () => { closeModal('modal-import'); onAppend(); });
  newReplace.addEventListener('click', () => { closeModal('modal-import'); onReplace(); });
  newCancel.addEventListener('click', () => { closeModal('modal-import'); });
}

export function closeDropdowns() { 
  $$('.dropdown.open').forEach((d) => d.classList.remove('open')); 
}

export function initUI() {
  store.addEventListener('error', (e) => toast(e.detail.message, 'error', 5000));

  on(document, 'click', (e) => {
    const btn = e.target.closest('[data-close-modal]');
    if (btn) closeModal(btn.dataset.closeModal);
    if (e.target.classList.contains('modal-backdrop')) closeModal(e.target.id);
  });

  on(document, 'click', (e) => {
    if (!e.target.closest('.dropdown') && !e.target.closest('[data-dropdown]')) closeDropdowns();
  });
  
  $$('[data-dropdown]').forEach((btn) => on(btn, 'click', () => {
    const dd = $(`#${btn.dataset.dropdown}`);
    const wasOpen = dd?.classList.contains('open');
    closeDropdowns();
    if (!wasOpen) dd?.classList.add('open');
  }));
}
