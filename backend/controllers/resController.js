import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
const LOCATIONIQ_KEY = process.env.LOCATIONIQ_API_KEY;
console.log("Using LocationIQ Key:", LOCATIONIQ_KEY);

function extractPlacesFromList(data) {
  return data.slice(0, 5).map((place) => {
    const name = place.display_name || "Unknown";
    const lat = place.lat;
    const lon = place.lon;
    const gmapLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    return `${name}\n📍 ${gmapLink}`;
  });
}

async function getFallbackPlaces(lat, lon, query = "restaurant") {
  const left = lon - 0.05,
        right = lon + 0.05,
        top = lat + 0.05,
        bottom = lat - 0.05;

  const url = `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_KEY}&q=${query}&format=json&limit=5&viewbox=${left},${top},${right},${bottom}&bounded=1`;

  const { data } = await axios.get(url, {
    headers: { "User-Agent": "restaurant-locator" },
  });

  return extractPlacesFromList(data);
}

async function getNearbyRestaurants(lat, lon, radius = 5000) {
  const url = `https://us1.locationiq.com/v1/nearby.php?key=${LOCATIONIQ_KEY}&lat=${lat}&lon=${lon}&tag=restaurant&radius=${radius}&format=json`;

  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "restaurant-locator" },
    });

    if (Array.isArray(data)) return extractPlacesFromList(data);
    if (!Array.isArray(data) || data.error) return await getFallbackPlaces(lat, lon);

    const places = data.places?.slice(0, 5).map((place) => {
      const name = place.name || "Unknown";
      const lat2 = place.lat;
      const lon2 = place.lon;
      const gmapLink = `https://www.google.com/maps/search/?api=1&query=${lat2},${lon2}`;
      return `${name}\n📍 ${gmapLink}`;
    });

    return places?.length ? places : await getFallbackPlaces(lat, lon);
  } catch (err) {
    console.error("Primary request failed:", err.message);
    return ["⚠️ Primary API error"];
  }
}

export const nearbyRestaurants = async (req, res) => {
  const { lat, lng, radius } = req.body;
  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitude and longitude are required." });
  }

  const searchRadius = radius ? Number(radius) : 5000;

  const places = await getNearbyRestaurants(lat, lng, searchRadius);
  res.json({ places });
};
