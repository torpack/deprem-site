const key = 'xqlDu9jizr0yujXvXZmf';

const map = L.map('map').setView([39.925533, 32.866287], 6);
const mtLayer = L.maptilerLayer({
    apiKey: key,
    style: L.MaptilerStyle.DATAVIZ.DARK,
}).addTo(map);

async function fetchEarthquakes() {
    try {
        const response = await fetch('https://api.orhanaydogdu.com.tr/deprem/kandilli/live');
        const data = await response.json();
        displayEarthquakes(data.result);
    } catch (error) {
        console.error("Veri çekme hatası:", error);
    }
}

var greenIcon = L.icon({
iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Red_circle.svg',

iconSize:     [40, 40],
iconAnchor:   [20, 20],
popupAnchor:  [0, 0]
});
function displayEarthquakes(earthquakes) {
    const earthquakeList = document.getElementById('earthquake-list');
    earthquakeList.innerHTML = '';

    earthquakes.forEach(eq => {
        const { title, date, mag, depth, geojson, location_properties } = eq;
        const item = document.createElement('div');
        item.className = 'earthquake-item';
        item.innerHTML = `
          <h3>${title}</h3>
          <p><strong>Şiddet:</strong> ${mag} - <strong>Derinlik:</strong> ${depth} km</p>
          <p><strong>Tarih:</strong> ${date}</p>
          <p><strong>En Yakın Şehir:</strong> ${location_properties.closestCity.name} (${(location_properties.closestCity.distance / 1000).toFixed(2)} km)</p>
      `;
        earthquakeList.appendChild(item);
        if (geojson && geojson.coordinates) {
            const [long, lat] = geojson.coordinates;
            L.marker([lat, long], {icon: greenIcon}).addTo(map)
                .bindPopup(`
                  <strong>${title}</strong><br>
                  Şiddet: ${mag} - Derinlik: ${depth} km<br>
                  Tarih: ${date}
              `);
        }
    });
}

fetchEarthquakes();