import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Toolbar from '../../components/Toolbar/ToolBar';
import RecipeList from '../../components/RecipeList/RecipeList';
import AddRecipeModal from '../../components/AddRecipeModal/AddRecipeModal';
import './ListPage.css';

const ListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchToggled, setSearchToggled] = useState(false);
  const [existingTags, setExistingTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [filterToggled, setFilterToggled] = useState(false);
  const [sortMenuToggled, setSortMenuToggled] = useState(false);
  const [selectedSort, setSelectedSort] = useState('default');

  useEffect(() => {
    fetch('http://localhost:3030/recipes')
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => b.order - a.order); // Descending order
        setRecipes(sortedData);
        setFilteredRecipes(sortedData); // Initialize filtered recipes
  
        // Extract unique tags from recipes
        const uniqueTags = [...new Set(data.flatMap((recipe) => recipe.tags))];
        setExistingTags(uniqueTags);
      })
      .catch((error) => console.error('Error fetching recipes:', error));
  }, []);
  
  const handleSort = (attribute) => {
    setSelectedSort(attribute); // Track the selected sorting option
  
    const sortedRecipes = [...filteredRecipes];
  
    switch (attribute) {
      case 'title':
        sortedRecipes.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'created':
        sortedRecipes.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
        break;
      case 'updated':
        sortedRecipes.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        break;
      case 'tags':
        sortedRecipes.sort((a, b) => a.tags.join(',').localeCompare(b.tags.join(',')));
        break;
      case 'difficulty':
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
        sortedRecipes.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
        break;
      case 'default':
        setFilteredRecipes(recipes); // Reset to original order
        return;
      default:
        break;
    }
  
    setFilteredRecipes(sortedRecipes); // Update the filtered recipes state   
  };

  const addRecipe = (newRecipe) => {
    const nextId = recipes.length > 0
      ? (Math.max(...recipes.map((r) => parseInt(r.id, 10) || 0)) + 1).toString()
      : "1";
  
    const recipeWithIdAndTimestamp = { 
      ...newRecipe, 
      id: nextId,
      createdTime: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
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
        setFilteredRecipes((prevRecipes) => [...prevRecipes, data]);
        setShowModal(false);
      })
      .catch((error) => console.error('Error adding recipe:', error));
  };  
  

  const updateOrderOnServer = (newOrder) => {
    // Iterate over each recipe and update its order on the server
    newOrder.forEach((recipe, index) => {
      fetch(`http://localhost:3030/recipes/${recipe.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...recipe, order: index }), // Add an `order` field for persistence
      }).catch((error) => console.error(`Error updating recipe ${recipe.id}:`, error));
    });
  };
  
  const toggleTagSelection = (tag) => {
    setSelectedTags((prevSelected) => {
      const newSelectedTags = prevSelected.includes(tag)
        ? prevSelected.filter((t) => t !== tag) // Deselect tag
        : [...prevSelected, tag]; // Select tag
  
      applyFilters(newSelectedTags, selectedDifficulty); // Apply filters dynamically
      return newSelectedTags;
    });
  };
  
  const handleDifficultySelection = (difficulty) => {
    const newDifficulty = selectedDifficulty === difficulty ? '' : difficulty; // Toggle difficulty
    console.log('Selected Difficulty:', newDifficulty); // Debugging
    setSelectedDifficulty(newDifficulty);
    applyFilters(selectedTags, newDifficulty);
  };

  const applyFilters = (tags, difficulty) => {
    console.log('Applying Filters - Tags:', tags, 'Difficulty:', difficulty); // Debugging
    let filtered = [...recipes];
  
    if (tags.length > 0) {
      filtered = filtered.filter((recipe) =>
        tags.every((tag) => recipe.tags.includes(tag))
      );
    }
  
    if (difficulty) {
      filtered = filtered.filter((recipe) => recipe.difficulty === difficulty);
    }
  
    console.log('Filtered Recipes:', filtered); // Debugging
    setFilteredRecipes(filtered);
  };
  
  const moveRecipe = (dragIndex, hoverIndex) => {
    const updatedRecipes = [...recipes];
    const [draggedItem] = updatedRecipes.splice(dragIndex, 1);
    updatedRecipes.splice(hoverIndex, 0, draggedItem);
  
    setRecipes(updatedRecipes); // Update local state
    setFilteredRecipes(updatedRecipes); // Update filtered view
  };
  
  const onDrop = () => {
    updateOrderOnServer(recipes);
  };
  
  // Filter recipes based on search query
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

  
  

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="list-page">
        <h1>All Recipes</h1>
        <Toolbar
          filterToggled={filterToggled}
          setFilterToggled={setFilterToggled}
          existingTags={existingTags}
          selectedTags={selectedTags}
          toggleTagSelection={toggleTagSelection}
          selectedDifficulty={selectedDifficulty}
          handleDifficultySelection={handleDifficultySelection}
          sortMenuToggled={sortMenuToggled}
          setSortMenuToggled={setSortMenuToggled}
          selectedSort={selectedSort}
          handleSort={handleSort}
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          searchToggled={searchToggled}
          setSearchToggled={setSearchToggled}
          onAddRecipe={addRecipe} 
        />
        <RecipeList
          recipes={filteredRecipes}
          moveRecipe={moveRecipe}
          onDrop={() => {}}
          toggleTagSelection={toggleTagSelection}
          selectedTags={selectedTags}
        />
       {showModal && <AddRecipeModal onClose={() => setShowModal(false)} onSave={addRecipe} />}

      </div>
    </DndProvider>
  );
};

export default ListPage;
