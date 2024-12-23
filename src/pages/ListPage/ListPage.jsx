import React, { useState, useEffect } from 'react';
import AddRecipeModal from '../../components/AddRecipeModal/AddRecipeModal';
import './ListPage.css';

const ListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch all recipes from json-server
    fetch('http://localhost:3030/recipes')
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error('Error fetching recipes:', error));
  }, []);

  const addRecipe = (newRecipe) => {
    const nextId = recipes.length > 0 ? Math.max(...recipes.map((r) => r.id)) + 1 : 1;
    const recipeWithIdAndTimestamp = { 
      ...newRecipe, 
      id: nextId, 
      lastUpdated: new Date().toISOString() // Add lastUpdated timestamp
    };
  

    fetch('http://localhost:3030/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeWithIdAndTimestamp),
    })
      .then((response) => response.json())
      .then((data) => {
        setRecipes((prevRecipes) => [...prevRecipes, data]);
        setShowModal(false); // Close modal after adding
      })
      .catch((error) => console.error('Error adding recipe:', error));
  };
  
 return (
    <div className={`list-page ${showModal ? 'darkened' : ''}`}>
      <h1>All Recipes</h1>
      <button className="add-recipe-button" onClick={() => setShowModal(true)}>
        Create Recipe
      </button>
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div className="recipe-card" key={recipe.id}>
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
          <div className="recipe-tags">
                {recipe.tags.map((tag, index) => (
                  <span key={index} className="recipe-tag">{tag}</span>
                ))}
              </div>
          <p className="last-updated">Last Updated: {new Date(recipe.lastUpdated).toLocaleString()}</p>
          <a href={`/recipes/${recipe.id}`} className="view-recipe-link">View Recipe</a>
        </div>
        
        ))}
      </div>
      {showModal && <AddRecipeModal onClose={() => setShowModal(false)} onSave={addRecipe} />}
    </div>
  );
};

export default ListPage;

              