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
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 10;

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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Calculate recipes to display on the current page
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  const toggleRecipeSelection = (recipeId) => {
    setSelectedRecipes((prevSelected) => {
      if (prevSelected.includes(recipeId)) {
        return prevSelected.filter((id) => id !== recipeId); // Deselect if already selected
      } else {
        return [...prevSelected, recipeId]; // Select if not already selected
      }
    });
  };
  
  const handleShare = () => {
    const recipesToShare = recipes.filter((recipe) => selectedRecipes.includes(recipe.id));
  
    if (recipesToShare.length === 0) {
      alert('No recipes selected to share!');
      return;
    }
  
    const jsonPayload = JSON.stringify(recipesToShare, null, 2); // Pretty JSON format
  
    // Create a `mailto` link
    const subject = encodeURIComponent('Shared Recipes');
    const body = encodeURIComponent(`Here are the recipes in JSON format:\n\n${jsonPayload}`);
  
    // Open the user's email client
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };
  
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
    const pageStartIndex = (currentPage - 1) * recipesPerPage;
    const dragGlobalIndex = pageStartIndex + dragIndex;
    const hoverGlobalIndex = pageStartIndex + hoverIndex;
  
    const updatedRecipes = [...recipes];
    const [draggedItem] = updatedRecipes.splice(dragGlobalIndex, 1);
    updatedRecipes.splice(hoverGlobalIndex, 0, draggedItem);

    setRecipes(updatedRecipes);
    setFilteredRecipes(updatedRecipes);
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
          onShare={handleShare}
          selectedRecipeCount={selectedRecipes.length}
        />
        <RecipeList
          recipes={currentRecipes}
          moveRecipe={moveRecipe}
          toggleTagSelection={toggleTagSelection}
          toggleRecipeSelection={toggleRecipeSelection}
          selectedTags={selectedTags}
        />
       {showModal && <AddRecipeModal onClose={() => setShowModal(false)} onSave={addRecipe} />}
       <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default ListPage;
