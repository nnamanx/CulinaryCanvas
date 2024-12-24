import React, { useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3030/recipes')
      .then((response) => response.json())
      .then((data) => {
        // Taking random 3 recipes
        const randomRecipes = data.sort(() => 0.5 - Math.random()).slice(0, 3);
        setFeaturedRecipes(randomRecipes);
      })
      .catch((error) => console.error('Error fetching recipes:', error));
  }, []);

  return (
    <div className="home-page">
      <section className="welcome-section">
        <h1>Welcome to Culinary Recipes</h1>
        <p>Explore delicious recipes, create your own, and share them with the world!</p>
      </section>
      <section className="featured-section">
        <h2>Featured Recipes</h2>
        <div className="recipe-grid">
          {featuredRecipes.map((recipe) => (
            <div className="recipe-card" key={recipe.id}>
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
              <a href={`/recipes/${recipe.id}`} className="view-recipe-link">View Recipe</a>
            </div>
          ))}
        </div>
        <div className="Projects">
           {/* Project should be added */}
        </div>

        
      </section>
    </div>
  );
};

export default HomePage;
