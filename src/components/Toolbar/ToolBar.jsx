import React, { useState, useEffect } from 'react';
import AddRecipeModal from '../AddRecipeModal/AddRecipeModals'; // Import AddRecipeModal
import './Toolbar.css';

const Toolbar = ({
  searchQuery,
  handleSearch
}) => {
  
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  return (
    <div className="toolbar">
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
            setShowModal(false); // Close modal after saving
          }}
        />
      )}
    </div>
  );
};

export default Toolbar;





