import {useNavigate } from 'react-router-dom';
import './RecipePage.css';

const RecipePage = () => {

  const navigate = useNavigate();


  return (
    <div className="recipe-page">
      <h1>Title</h1>
      <p className="recipe-description">Description</p>
      <div className="recipe-info">
        <h3>Difficulty: Easy</h3>
        <h4>Tags:</h4>
        <div className="recipe-tags">
          <span className="recipe-tag">Tag 1</span>
          <span className="recipe-tag">Tag 2</span>
          <span className="recipe-tag">Tag 3</span>
        </div>
      </div>
      <div className="recipe-ingredients">
        <h3>Ingredients:</h3>
        <ul>
            <li >Ingredient 1</li>
            <li >Ingredient 2</li>
            <li >Ingredient 3</li>
        </ul>
      </div>
      <div className="recipe-steps">
        <h3>Preparation Steps:</h3>
        <ol>
          <li>Step 1</li>
          <li>Step 2</li>
          <li>Step 3</li>
        </ol>
      </div>
      <button className="back-button" onClick={() => navigate('/recipes')}>Back to Recipes</button>
    </div>
  );
};

export default RecipePage;
