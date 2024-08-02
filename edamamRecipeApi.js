import axios from 'axios';

const APP_ID = process.env.NEXT_PUBLIC_EDAMAM_APP_ID;
const APP_KEY = process.env.NEXT_PUBLIC_EDAMAM_APP_KEY;
const BASE_URL = 'https://api.edamam.com/search';

export const getRecipesByIngredients = async (ingredients) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: ingredients.join(' '),
        app_id: APP_ID,
        app_key: APP_KEY,
        from: 0,
        to: 3 // Limit to 5 recipes
      }
    });

    return response.data.hits.map(hit => ({
      id: hit.recipe.uri.split('#recipe_')[1],
      title: hit.recipe.label,
      image: hit.recipe.image,
      url: hit.recipe.url,
      missedIngredientCount: hit.recipe.ingredients.length - ingredients.length
    }));
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};