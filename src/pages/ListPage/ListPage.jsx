import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AddRecipeModal from '../../components/AddRecipeModal/AddRecipeModal';
import Toolbar from '../../components/Toolbar/ToolBar';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import './ListPage.css';

const ListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch all recipes from json-server
    fetch('http://localhost:3030/recipes')
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => a.order - b.order);
        setRecipes(sortedData);
        setFilteredRecipes(sortedData); // Initialize filtered recipes
      })
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
  
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query) {
      const filtered = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(query)
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes); // Reset to full list if query is empty
    }
  };

  // Move recipe to new position (only when drop happens)
  const moveRecipe = (dragIndex, hoverIndex) => {
    const updatedRecipes = [...recipes];
    const [draggedItem] = updatedRecipes.splice(dragIndex, 1);
    updatedRecipes.splice(hoverIndex, 0, draggedItem);
    setRecipes(updatedRecipes);
    setFilteredRecipes(updatedRecipes);
  };

  // Update the recipe order on the server
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

  // Handle drop event to finalize order
  const onDrop = () => {
    updateOrderOnServer(recipes);
  };


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="list-page">
        <h1>All Recipes</h1>
        <Toolbar
          searchQuery={searchQuery}
          handleSearch={handleSearch}
        />
        <div className="recipe-list">
          {filteredRecipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              index={index}
              moveRecipe={moveRecipe}
              onDrop={onDrop}
            />
          ))}
        </div>
        {showModal && <AddRecipeModal onClose={() => setShowModal(false)} onSave={addRecipe} />}
      </div>
    </DndProvider>
  );
};

export default ListPage;

              