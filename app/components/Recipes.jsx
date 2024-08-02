import { getRecipesByIngredients } from '../../edamamRecipeApi';
import { useState, useEffect } from "react";

export default function Recipes({ inventory }) {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      const ingredients = inventory.map((item) => item.name);
      try {
        const recipeData = await getRecipesByIngredients(ingredients);
        setRecipes(recipeData);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [inventory]);

  if (isLoading) return <p>Loading recipes...</p>;

  return (
    <section className="recipeSection">
      <h1>Recipe Suggestions</h1>
      <div className="recipeContainer">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe.id} className="recipes">
              <div className="recipeCard">
                <h3>{recipe.title}</h3>
                <img src={recipe.image} alt={recipe.title} />
                <a href={recipe.url} target="_blank" rel="noopener noreferrer">
                  View Recipe
                </a>
                <p>
                  Missing ingredients:{" "}
                  <span>{recipe.missedIngredientCount}</span>{" "}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No recipes found based on your inventory.</p>
        )}
      </div>
    </section>
  );
}