import React from 'react';

const Favorites = ({ favorites, toggleFavorite }) => {
  return (
    <div>
      <h2>Favorites</h2>
      <ul>
        {favorites.map((item) => (
          <li key={item}>
            {item}
            <button onClick={() => toggleFavorite(item)}>
              Remove from Favorites
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;