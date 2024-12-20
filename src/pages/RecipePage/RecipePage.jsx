import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RecipePage.css';

const RecipePage = () => {
  const { id } = useParams(); // Get recipe ID from URL
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch recipe by ID
    fetch(`http://localhost:3030/recipes/${id}`)
      .then((response) => response.json())
      .then((data) => setRecipe(data))
      .catch((error) => console.error('Error fetching recipe:', error));
  }, [id]);

  if (!recipe) {
    return <div className="recipe-page">Loading...</div>;
  }

  return (
    <div className="recipe-page">
      <h1>{recipe.title}</h1>
      <p className="recipe-description">{recipe.description}</p>
      <div className="recipe-info">
        <h3>Difficulty: {recipe.difficulty}</h3>
        <h4>Tags:</h4>
        <div className="recipe-tags">
          {recipe.tags.map((tag, index) => (
            <span key={index} className="recipe-tag">{tag},</span>
          ))}
        </div>
      </div>
      <div className="recipe-ingredients">
        <h3>Ingredients:</h3>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      <div className="recipe-steps">
        <h3>Preparation Steps:</h3>
        <ol>
          {recipe.preparationSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
      <button className="back-button" onClick={() => navigate('/recipes')}>Back to Recipes</button>
    </div>
  );
};

export default RecipePage;
