const overlays = {
  liked: document.getElementById('liked-overlay'),
  cart: document.getElementById('cart-overlay'),
  category: document.getElementById('category-overlay'),
  filter: document.getElementById('filter-overlay')
};

const backdrop = document.getElementById('overlay-backdrop');

export function closeAllOverlays() {
  Object.values(overlays).forEach(overlay => {
    if (overlay) overlay.style.display = 'none';
  });

  if (backdrop) backdrop.style.display = 'none';
  document.body.classList.remove('no-scroll');

  document.querySelectorAll('.filter-section').forEach(section => {
    section.classList.remove('expanded');
  });

  const filterActions = document.querySelector('.filter-actions');
  if (filterActions) {
    filterActions.classList.remove('visible');
    filterActions.style.display = '';
  }
}

export function toggleOverlay(name) {
  const overlay = overlays[name];
  if (!overlay) return;

  const isVisible = overlay.style.display === 'block';
  closeAllOverlays();

  if (!isVisible) {
    overlay.style.display = 'block';
    if (backdrop) backdrop.style.display = 'block';
    document.body.classList.add('no-scroll');
  }
}

export function showModal(title, message, isError = false) {
  const modal = document.getElementById('success-modal');
  if (!modal) return;
  
  const icon = modal.querySelector('.success-icon');
  const titleEl = modal.querySelector('.success-title');
  const messageEl = modal.querySelector('.success-message');

  if (titleEl) titleEl.textContent = title;
  if (messageEl) messageEl.textContent = message;
  
  if (icon) {
    if (isError) {
      icon.textContent = '!';
      icon.style.background = '#e74c3c';
      icon.style.color = '#fff';
    } else {
      icon.textContent = '✓';
      icon.style.background = '#F4C557';
      icon.style.color = '#000';
    }
  }

  modal.style.display = 'flex';
}

export function hideSuccessModal() {
  const successModal = document.getElementById('success-modal');
  if (successModal) successModal.style.display = 'none';
}
