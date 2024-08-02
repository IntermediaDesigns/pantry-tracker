import React from "react";

const Favorites = ({ favorites, toggleFavorite }) => {
  const handleToggle = (item) => {
    if (typeof toggleFavorite === "function") {
      toggleFavorite(item);
    } else {
      console.error("toggleFavorite is not a function");
    }
  };

  return (
    <div className="favoritesContainer">
      <h1>Favorites</h1>
      <div className="favorites">
        <ul>
          {favorites && favorites.length > 0 ? (
            favorites.map((item) => (
              <li key={item} className="flex justify-between items-center mb-4 mt-2">
                <span>{item}</span>
                <button
                  onClick={() => handleToggle(item)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  title="Remove from favorites"
                >
                  ★
                </button>
              </li>
            ))
          ) : (
            <li>No favorites added yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

Favorites.displayName = "Favorites";

export default Favorites;