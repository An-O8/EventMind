/**
 * maps.js – Venue navigation using Google Maps Embed API + deep links
 */

const mapLinks = [
  { icon: '📍', label: 'Get directions to IIT Delhi',  url: 'https://www.google.com/maps/search/IIT+Delhi+Hauz+Khas+New+Delhi' },
  { icon: '🍽️', label: 'Restaurants nearby',           url: 'https://www.google.com/maps/search/restaurants+near+IIT+Delhi+New+Delhi' },
  { icon: '🏨', label: 'Hotels nearby',                 url: 'https://www.google.com/maps/search/hotels+near+IIT+Delhi+New+Delhi' },
  { icon: '🚇', label: 'Nearest Metro station',         url: 'https://www.google.com/maps/search/metro+station+near+IIT+Delhi' },
  { icon: '🅿️', label: 'Parking areas',                url: 'https://www.google.com/maps/search/parking+near+IIT+Delhi' },
];

/**
 * Open Google Maps directions to the venue.
 */
function openMaps() {
  window.open('https://www.google.com/maps/search/IIT+Delhi+Hauz+Khas+New+Delhi', '_blank', 'noopener,noreferrer');

  // Track in Firebase Analytics
  if (typeof logEvent === 'function') {
    logEvent('venue_map_opened', { destination: 'IIT Delhi', event: currentEvent });
  }
}

/**
 * Render the venue navigation card with embedded Google Map + quick links.
 */
function renderMaps() {
  const card = document.getElementById('mapsCard');
  if (!card) return;

  const links = mapLinks.map(l => `
    <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="map-btn" aria-label="${sanitize(l.label)} — opens in Google Maps">
      <span class="map-icon" aria-hidden="true">${l.icon}</span>${sanitize(l.label)}
    </a>`).join('');

  card.innerHTML = `
    <div class="card-head">
      <div class="card-title">🗺️ Venue Navigation</div>
      <div style="font-size:12px;color:var(--muted)">IIT Delhi</div>
    </div>
    <div class="maps-embed" style="margin-bottom:12px;border-radius:12px;overflow:hidden;">
      <iframe
        title="IIT Delhi location map"
        width="100%"
        height="200"
        style="border:0;display:block;"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyD-Ejx8rM2RIdfJ77fVuqqSz4CABhWkBsY&q=IIT+Delhi,Hauz+Khas,New+Delhi&zoom=15"
        aria-label="Google Maps showing IIT Delhi location">
      </iframe>
    </div>
    ${links}`;
}