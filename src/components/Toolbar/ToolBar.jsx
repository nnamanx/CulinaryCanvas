import React, { useState, useEffect } from 'react';
import AddRecipeModal from '../AddRecipeModal/AddRecipeModal'; 
import './Toolbar.css';

const Toolbar = ({
  filterToggled,
  setFilterToggled,
  existingTags,
  selectedTags,
  toggleTagSelection,
  selectedDifficulty,
  handleDifficultySelection,
  sortMenuToggled,
  setSortMenuToggled,
  selectedSort,
  handleSort,
  searchQuery,
  handleSearch,
  searchToggled,
  setSearchToggled,
  onAddRecipe,
  onShare,
  selectedRecipeCount
}) => {
  
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (filterToggled && !event.target.closest('.filter-menu') && !event.target.closest('.filter-tag')) {
        setFilterToggled(false); // Close the filter menu
      }
    };
  
    document.addEventListener('click', handleOutsideClick);
  
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [filterToggled]);
  
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sortMenuToggled && !event.target.closest('.sort-menu') && !event.target.closest('.filter-tag')) {
        setSortMenuToggled(false);
      }
    };
  
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [sortMenuToggled]);
  
  
  return (
    <div className="toolbar">
      {/* Filtering */}
      <button
        className={`filter-tag ${filterToggled || selectedTags.length > 0 || selectedDifficulty ? 'selected' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setFilterToggled(!filterToggled);
        }}
      >
        Filtering
      </button>
      {filterToggled && (
        <div className="filter-menu">
          <h3>Filter By</h3>
          <div className="filter-section">
            <label>Tags:</label>
            <div className="recipe-tags">
              {existingTags.map((tag, index) => (
                <button
                  key={index}
                  className={`recipe-tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                  onClick={() => toggleTagSelection(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
            <div className="filter-section">
              <label>Difficulty:</label>
              <div className="recipe-tags">
                {['Easy', 'Medium', 'Hard'].map((level) => (
                  <button
                    key={level}
                    className={`recipe-tag difficulty-${level.toLowerCase()} ${selectedDifficulty === level ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click events from propagating
                      handleDifficultySelection(level); // Pass the selected level
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
        </div>
      )}

      {/* Sorting */}
      <button
        className={`filter-tag sort-button ${sortMenuToggled ? 'selected' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setSortMenuToggled(!sortMenuToggled);
        }}
      >
        Sort
      </button>
      {sortMenuToggled && (
        <div className="sort-menu">
          <h3>Sort By</h3>
          <ul>
            <li
              className={selectedSort === 'default' ? 'selected' : ''}
              onClick={() => handleSort('default')}
            >
              Default
            </li>
            <li
              className={selectedSort === 'title' ? 'selected' : ''}
              onClick={() => handleSort('title')}
            >
              Title
            </li>
            <li
              className={selectedSort === 'created' ? 'selected' : ''}
              onClick={() => handleSort('created')}
            >
              Create Time
            </li>
            <li
              className={selectedSort === 'updated' ? 'selected' : ''}
              onClick={() => handleSort('updated')}
            >
              Update Time
            </li>
            <li
              className={selectedSort === 'tags' ? 'selected' : ''}
              onClick={() => handleSort('tags')}
            >
              Tags
            </li>
            <li
              className={selectedSort === 'difficulty' ? 'selected' : ''}
              onClick={() => handleSort('difficulty')}
            >
              Difficulty
            </li>
          </ul>
        </div>
      )}
      
      <div
        className={`search-container ${searchToggled ? 'expanded' : ''}`}
        onClick={() => !searchToggled && setSearchToggled(true)}
      >
        {searchToggled ? (
          <input
            type="text"
            className="search-box"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={handleSearch}
            onBlur={() => setSearchToggled(false)}
          />
        ) : (
          <span>Search</span>
        )}
      </div>
      <button className="add-recipe-button" onClick={() => setShowModal(true)}>
        Create Recipe
      </button>

      {/* Add Recipe Modal */}
      {showModal && (
        <AddRecipeModal
          onClose={() => setShowModal(false)}
          onSave={(newRecipe) => {
            onAddRecipe(newRecipe);
            setShowModal(false);
          }}
        />
      )}

      <button
        onClick={onShare}
        disabled={selectedRecipeCount === 0} 
        className="share-button"
      >
        Share Recipes ({selectedRecipeCount})
      </button>

    </div>
  );
};

export default Toolbar;
