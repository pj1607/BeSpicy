import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { MapPin, Compass, Search, CornerUpRight, ChevronDown, XCircle, Hotel } from "lucide-react";
import * as Select from "@radix-ui/react-select";

const API = import.meta.env.VITE_API_URL;

const RestaurantLocator = () => {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [radius, setRadius] = useState("5000");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [notification, setNotification] = useState(null);
  const [locationName, setLocationName] = useState("");
const [lastSearchedRadius, setLastSearchedRadius] = useState("");


  const mapRef = useRef(null);

  useEffect(() => {
    if (selectedPlace && mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedPlace]);

const fetchRestaurants = async () => {
  if (!navigator.geolocation) {
    showNotification("Geolocation not supported.", "error");
    return;
  }

  setLoading(true);
  setSelectedPlace(null); // <-- Clear previous map

navigator.geolocation.getCurrentPosition(
  async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    setLocation({ lat, lng });

    try {
      const geoRes = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        { params: { lat, lon: lng, format: "json" } }
      );
      setLocationName(geoRes.data.display_name || "");
    } catch {
      setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }

    try {
      const res = await axios.post(`${API}/restaurants/nearby`, { lat, lng, radius });
      setPlaces(res.data.places || []);
      setSearchPerformed(true);
      setLastSearchedRadius(radius); // Store radius
      if (!res.data.places || res.data.places.length === 0) {
        showNotification("No restaurants found nearby.", "warning");
      }
    } catch (err) {
      showNotification("Failed to fetch nearby restaurants.", "error");
    }
    setLoading(false);
  },
  () => {
    showNotification("Location access denied or unavailable.", "error");
    setLoading(false);
  }
);

};


  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const extractCoords = (text) => {
    const match = text.match(/query=([-0-9.]+),([-0-9.]+)/);
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    return null;
  };

  return (
    <section className="relative max-w-6xl mx-auto px-4 py-12 mt-30">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
        <svg className="w-full h-full" fill="none" stroke="#d33232" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="29" strokeWidth="5" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className="w-32 h-32 text-white"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.5}
          >
            <path d="M8 32 C12 52, 52 52, 56 32 Z" />
            <path d="M14 36 Q20 40, 26 36 T38 36 T50 36" />
            <circle cx="20" cy="24" r="5" />
            <circle cx="28" cy="22" r="5" />
            <circle cx="36" cy="25" r="5" />
            <circle cx="44" cy="22" r="5" />
            <path d="M34 16 L46 6" />
          </svg>
        </div>
      </div>

     {/* Header */}
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="text-center mb-10 relative z-10"
>
  <h1 className="text-4xl md:text-5xl font-extrabold text-white flex flex-wrap justify-center items-center gap-2">
    <Hotel className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0" /> Nearest
    <span className="bg-[#d33232] text-white px-2 rounded block md:inline">
      Restaurant
    </span>
  </h1>
  <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
    Locate the best restaurants closest to you in just one click.
  </p>
</motion.div>


      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center gap-4 bg-[#161616] p-6 rounded-2xl shadow-xl border border-[#1e1e1e] w-full max-w-3xl mx-auto relative z-10"
      >
        <div className="relative w-full md:w-44">
          <Select.Root value={radius} onValueChange={setRadius}>
            <Select.Trigger
              className="inline-flex items-center justify-between w-full p-3 rounded-lg bg-[#1e1e1e] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#d33232] transition outline-none"
              aria-label="Search Radius"
            >
              <Select.Value placeholder="Radius (m)" />
              <Select.Icon>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                position="popper"
                sideOffset={4}
                className="z-50 w-[var(--radix-select-trigger-width)] bg-[#1e1e1e] rounded-lg shadow-xl border border-[#333] overflow-hidden"
              >
                <Select.Viewport className="p-1">
                  {["1000","5000","10000"].map((r) => (
                    <Select.Item
                      key={r}
                      value={r}
                      className="px-3 py-2 rounded-md text-white text-sm cursor-pointer hover:bg-[#ecebeb] hover:text-black data-[highlighted]:bg-white data-[highlighted]:text-black outline-none"
                    >
                      <Select.ItemText>{r} m</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
        <button
          onClick={fetchRestaurants}
          disabled={loading}
          className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold shadow-lg hover:bg-white/80 transition-all hover:scale-105"
        >
          {loading ? (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-black rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-black rounded-full animate-bounce animation-delay-200"></span>
              <span className="w-2 h-2 bg-black rounded-full animate-bounce animation-delay-400"></span>
            </span>
          ) : (
            <>
              <Search className="w-4 h-4 flex-shrink-0" /> Find Nearby Restaurants
            </>
          )}
        </button>
      </motion.div>

 {searchPerformed && !loading && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="mt-4 max-w-3xl mx-auto text-gray-300 flex flex-col gap-2 items-start relative z-10"
  >
    {locationName && (
      <p>
        <span className="font-medium text-white">Your Location:</span> {locationName}
      </p>
    )}
    {lastSearchedRadius && (
      <p>
        <span className="font-medium text-white">Search :</span> {lastSearchedRadius} m
      </p>
    )}
  </motion.div>
)}



      {/* Results */}
      {searchPerformed && !loading && places.length === 0 && (
        <p className="mt-6 text-center text-red-400">No restaurants found.</p>
      )}

      {places.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10"
        >
          {places.map((place, idx) => {
            const parts = place.split("\n");
            const name = parts[0];
            const coords = extractCoords(place);

            return (
              <motion.div
                key={idx}
                className="bg-[#161616] rounded-xl shadow-lg p-5 transition-all hover:bg-[#1e1e1e]"
              >
                <h2 className="text-xl font-bold text-white mb-2 flex gap-2 items-center">
                  <CornerUpRight className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" /> {name}
                </h2>
                {coords && (
                  <div className="flex gap-4 mt-3 text-sm">
                    <button
                      onClick={() => setSelectedPlace(coords)}
                      className="cursor-pointer flex items-center gap-1 text-blue-400 hover:text-blue-300"
                    >
                      <Compass className="w-4 h-4 flex-shrink-0" /> View on Map
                    </button>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-green-400 hover:text-green-300"
                    >
                      <MapPin className="w-4 h-4 flex-shrink-0" /> Directions
                    </a>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Notifications below cards */}
      {notification && (
        <div
          className={`mt-6 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-white mx-auto max-w-3xl
            ${
              notification.type === "error"
                ? "bg-red-500"
                : notification.type === "warning"
                ? "bg-yellow-500 text-black"
                : "bg-green-500"
            }`}
        >
          <XCircle className="w-5 h-5 flex-shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Map */}
      {selectedPlace && (
        <div ref={mapRef} className="mt-12">
          <div className="bg-[#0f172a] border border-gray-700 rounded-2xl shadow-md h-[500px] overflow-hidden">
            <iframe
              title="Restaurant Map"
              src={`https://www.google.com/maps?q=${selectedPlace.lat},${selectedPlace.lng}&z=16&output=embed`}
              width="100%"
              height="100%"
              className="rounded-2xl"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
};

export default RestaurantLocator;
