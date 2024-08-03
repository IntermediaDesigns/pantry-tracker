import axios from 'axios';

const APP_ID = process.env.NEXT_PUBLIC_EDAMAM_APP_ID;
const APP_KEY = process.env.NEXT_PUBLIC_EDAMAM_APP_KEY;
const BASE_URL = 'https://api.edamam.com/search';
const CACHE_KEY = 'recipeCache';
const LAST_CALL_TIME_KEY = 'lastRecipeCallTime';
const CALL_INTERVAL = 0 * 60 * 1000; // 2 minutes in milliseconds

export const getRecipesByIngredients = async (ingredients) => {
  const currentTime = new Date().getTime();
  const lastCallTime = localStorage.getItem(LAST_CALL_TIME_KEY);
  const cachedData = localStorage.getItem(CACHE_KEY);

  // If it's been less than 15 minutes since the last call and we have cached data, return the cached data
  if (lastCallTime && currentTime - parseInt(lastCallTime) < CALL_INTERVAL && cachedData) {
    console.log('Returning cached recipe data');
    return JSON.parse(cachedData);
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: ingredients.join(' '),
        app_id: APP_ID,
        app_key: APP_KEY,
        from: 0,
        to: 3 // Limit to 3 recipes
      }
    });

    const recipes = response.data.hits.map(hit => ({
      id: hit.recipe.uri.split('#recipe_')[1],
      title: hit.recipe.label,
      image: hit.recipe.image,
      url: hit.recipe.url,
      missedIngredientCount: hit.recipe.ingredients.length - ingredients.length
    }));

    // Cache the results and update the last call time
    localStorage.setItem(CACHE_KEY, JSON.stringify(recipes));
    localStorage.setItem(LAST_CALL_TIME_KEY, currentTime.toString());

    return recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};