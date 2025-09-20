import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Recipe from "./pages/Recipe";
import RestaurantLocator from "./pages/RestaurantLocator";
import Tools from "./pages/Tools";

const App = () => {
  return (
  // App.jsx
<Router>
  <div className="flex flex-col min-h-screen max-w-[1488px] mx-auto px-4">
    <NavBar />
    <main className="flex-1">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-recipes" element={<Recipe />} />
        <Route path="/nearest-restaurant" element={<RestaurantLocator/>} />
        <Route path="/tools" element={<Tools/>} />

      </Routes>
    </main>
    <Footer />
  </div>
</Router>

  );
};

export default App;
