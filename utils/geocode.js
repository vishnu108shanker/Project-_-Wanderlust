// For Node.js <18
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function geocodeAddress(address) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    const response = await fetch(url, {
        headers: { 'User-Agent': 'wanderlust-project/1.0' }
    });
    const data = await response.json();
    if (!data || data.length === 0) {
        throw new Error('Location not found');
    }
    return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
    };
}

module.exports = { geocodeAddress };
