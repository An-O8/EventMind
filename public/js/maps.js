const mapLinks = [
  { icon: '📍', label: 'Get directions to IIT Delhi',  url: 'https://www.google.com/maps/search/IIT+Delhi+Hauz+Khas+New+Delhi' },
  { icon: '🍽️', label: 'Restaurants nearby',           url: 'https://www.google.com/maps/search/restaurants+near+IIT+Delhi+New+Delhi' },
  { icon: '🏨', label: 'Hotels nearby',                 url: 'https://www.google.com/maps/search/hotels+near+IIT+Delhi+New+Delhi' },
  { icon: '🚇', label: 'Nearest Metro station',         url: 'https://www.google.com/maps/search/metro+station+near+IIT+Delhi' },
  { icon: '🅿️', label: 'Parking areas',                url: 'https://www.google.com/maps/search/parking+near+IIT+Delhi' },
];

function openMaps() {
  window.open('https://www.google.com/maps/search/IIT+Delhi+Hauz+Khas+New+Delhi', '_blank', 'noopener,noreferrer');
}

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
    ${links}`;
}