/* ============================================================
   WanderLust — Main JS
   ============================================================ */

/* ── 1. Bootstrap form validation ─────────────────────────── */
(() => {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();


/* ── 2. Leaflet Map (only on show page) ───────────────────── */
const mapEl = document.getElementById('listing-map');
if (mapEl) {
  const lat = parseFloat(mapEl.dataset.lat);
  const lng = parseFloat(mapEl.dataset.lng);

  if (!isNaN(lat) && !isNaN(lng)) {
    const map = L.map('listing-map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);

    // Custom marker
    const markerIcon = L.divIcon({
      html: '<div style="background:#E8184A;color:#fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(232,24,74,0.4);font-size:16px;">⌂</div>',
      iconSize:   [36, 36],
      iconAnchor: [18, 36],
      className:  ''
    });

    L.marker([lat, lng], { icon: markerIcon })
      .addTo(map)
      .bindPopup('<strong style="font-family:Inter,sans-serif;font-size:13px;">📍 Listing Location</strong>')
      .openPopup();
  }
}


/* ── 3. Toast dismiss ─────────────────────────────────────── */
function dismissToast(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.animation = 'toastOut 0.3s ease forwards';
  setTimeout(() => el.remove(), 320);
}

// Auto-dismiss all toasts after 4 seconds
document.addEventListener('DOMContentLoaded', () => {
  const toasts = document.querySelectorAll('.toast-msg');
  toasts.forEach((t, i) => {
    setTimeout(() => {
      t.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => t.remove(), 320);
    }, 4000 + i * 400);
  });
});


/* ── 4. Navbar scroll shadow ──────────────────────────────── */
const navbar = document.querySelector('nav.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}


/* ── 5. Scroll-to-top button ──────────────────────────────── */
const scrollBtn = document.getElementById('scrollTopBtn');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ── 6. Category filter bar (index page) ─────────────────── */
document.querySelectorAll('.cat-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.cat-item').forEach(c => c.classList.remove('active'));
    item.classList.add('active');
  });
});


/* ── 7. Wishlist heart toggle ─────────────────────────────── */
document.querySelectorAll('.wishlist-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    btn.classList.toggle('liked');
    const icon = btn.querySelector('i');
    if (btn.classList.contains('liked')) {
      icon.classList.replace('fa-regular', 'fa-solid');
    } else {
      icon.classList.replace('fa-solid', 'fa-regular');
    }
  });
});


/* ── 8. Image upload preview (new/update form) ────────────── */
const imgInput = document.getElementById('listingImage');
const imgPreview = document.getElementById('imgPreview');
const uploadArea = document.querySelector('.img-upload-area');

if (imgInput && imgPreview) {
  imgInput.addEventListener('change', () => {
    const file = imgInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        imgPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        imgPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });
}

if (uploadArea && imgInput) {
  uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });
  uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
  uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) {
      imgInput.files = e.dataTransfer.files;
      const reader = new FileReader();
      reader.onload = ev => {
        imgPreview.innerHTML = `<img src="${ev.target.result}" alt="Preview">`;
        imgPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });
  uploadArea.addEventListener('click', () => imgInput.click());
}
