import React, { useState, useEffect } from 'react';
import './ListPage.css';

const ListPage = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Fetch all recipes from json-server
    fetch('http://localhost:3030/recipes')
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error('Error fetching recipes:', error));
  }, []);

  return (
    <div className="list-page">
      <h1>All Recipes</h1>
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div className="recipe-card" key={recipe.id}>
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            {/* Tags Section */}
            {recipe.tags && (
              <div className="recipe-tags">
                {recipe.tags.map((tag, index) => (
                  <span key={index} className="recipe-tag">{tag}</span>
                ))}
              </div>
            )}
            <a href={`/recipes/${recipe.id}`} className="view-recipe-link">View Recipe</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListPage;
