import React from 'react';
import  { useDrop, useDrag } from 'react-dnd';
import './RecipeCard.css'

const RecipeCard = ({ recipe, index, moveRecipe }) => {
    const ref = React.useRef(null);
  
    const [, drop] = useDrop({
      accept: 'recipe',
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
    );
  };

  export default RecipeCard;
