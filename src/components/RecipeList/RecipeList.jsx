import React from 'react';
import RecipeCard from '../RecipeCard/RecipeCard';
import './RecipeList.css';

const RecipeList = ({ recipes, moveRecipe, onDrop, toggleTagSelection, toggleRecipeSelection, selectedTags }) => {
  return (
    <div className="recipe-list">
      {recipes.map((recipe, index) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          index={index}
          moveRecipe={moveRecipe}
          onDrop={onDrop}
          toggleTagSelection={toggleTagSelection}
          toggleRecipeSelection={toggleRecipeSelection}
          selectedTags={selectedTags}
        />
      ))}
    </div>
  );
};

export default RecipeList;
