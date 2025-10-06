// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


// <!-- Leaflet JS -->
// Get coordinates from server-side injected vars
const lat = parseFloat(document.getElementById('listing-map').dataset.lat);
const lng = parseFloat(document.getElementById('listing-map').dataset.lng);

// Initialize map
const map = L.map('listing-map').setView([lat, lng], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

L.marker([lat, lng]).addTo(map)
  .bindPopup('Listing Location')
  .openPopup();
