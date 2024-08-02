import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

export const getRecipesByIngredients = async (ingredients) => {
  try {
    const response = await axios.get(`${BASE_URL}/findByIngredients`, {
      params: {
        ingredients: ingredients.join(','),
        number: 3,
        ranking: 1,
        apiKey: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

export const getRecipeDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}/information`, {
      params: {
        apiKey: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};