import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const RecipeCard = ({ recipe, index, moveRecipe, onDrop, toggleTagSelection, toggleRecipeSelection, selectedTags, isSelected }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: 'recipe',
    drop: onDrop,
    hover: (item) => {
      if (item.index !== index) {
        moveRecipe(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'recipe',
    item: { type: 'recipe', index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`recipe-card ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="recipe-card-header">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleRecipeSelection(recipe.id)}
        />
        <h3>{recipe.title}</h3>
      </div>
      <p>{recipe.description}</p>

      {/* Tags Section */}
      <div className="recipe-tags">
        {recipe.tags.map((tag, index) => (
          <button
            key={index}
            className={`recipe-tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
            onClick={() => toggleTagSelection(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Difficulty */}
      <button className={`difficulty-button ${recipe.difficulty.toLowerCase()}`}>
        {recipe.difficulty}
      </button>

      {/* Last Updated */}
      <p className="last-updated">Last Updated: {new Date(recipe.lastUpdated).toLocaleString()}</p>
      
      {/* View Recipe */}
      <a href={`/recipes/${recipe.id}`} className="view-recipe-link">View Recipe</a>
    </div>
  );
};

export default RecipeCard;
