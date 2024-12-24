import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AddRecipeModal from '../../components/AddRecipeModal/AddRecipeModal';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
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
  
  const updateOrderOnServer = (newOrder) => {
    newOrder.forEach((recipe, index) => {
      fetch(`http://localhost:3030/recipes/${recipe.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...recipe, order: index }),
      }).catch((error) => console.error(`Error updating recipe ${recipe.id}:`, error));
    });
  };

  // Move recipe to new position
  const moveRecipe = (dragIndex, hoverIndex) => {
    const updatedRecipes = [...recipes];
    const [draggedItem] = updatedRecipes.splice(dragIndex, 1);
    updatedRecipes.splice(hoverIndex, 0, draggedItem);

    setRecipes(updatedRecipes); // Update state
    updateOrderOnServer(updatedRecipes); // Persist new order
  };
  

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`list-page ${showModal ? 'darkened' : ''}`}>
        <h1>All Recipes</h1>
        <button className="add-recipe-button" onClick={() => setShowModal(true)}>
          Create Recipe
        </button>
        <div className="recipe-list">
          {recipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              index={index}
              moveRecipe={moveRecipe}
            />
          ))}
        </div>
        {showModal && <AddRecipeModal onClose={() => setShowModal(false)} onSave={addRecipe} />}
      </div>
    </DndProvider>
  );
};

export default ListPage;

              