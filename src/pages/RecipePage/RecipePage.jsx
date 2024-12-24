import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RecipePage.css';

const RecipePage = () => {
  const { id } = useParams(); // Get recipe ID from URL
  const [recipe, setRecipe] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false); // Toggle Update Modal
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch recipe by ID
    fetch(`http://localhost:3030/recipes/${id}`)
      .then((response) => response.json())
      .then((data) => setRecipe(data))
      .catch((error) => console.error('Error fetching recipe:', error));
  }, [id]);

  const handleUpdate = (updatedData) => {
    const updatedRecipe = {
      ...updatedData,
      id: recipe.id, // Keep the same ID
      lastUpdated: new Date().toISOString(), // Update lastUpdated timestamp
    };

    fetch(`http://localhost:3030/recipes/${id}`, {
      method: 'PUT', // Update recipe
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedRecipe),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Recipe updated successfully!');
        setRecipe(data); // Update local state
        setShowUpdateModal(false); // Close modal
      })
      .catch((error) => console.error('Error updating recipe:', error));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      fetch(`http://localhost:3030/recipes/${id}`, {
        method: 'DELETE', // Delete recipe
      })
        .then(() => {
          alert('Recipe deleted successfully!');
          navigate('/recipes'); // Navigate back to the list page
        })
        .catch((error) => console.error('Error deleting recipe:', error));
    }
  };

  if (!recipe) {
    return <div className="recipe-page">Loading...</div>;
  }

  return (
    <div className="recipe-page">
      <h1>{recipe.title}</h1>
      <p className="recipe-description">{recipe.description}</p>
      <div className="recipe-info">
        <h3>Difficulty: {recipe.difficulty}</h3>
        <h4>Last Updated: {new Date(recipe.lastUpdated).toLocaleString()}</h4>
        <h4>Tags:</h4>
        <div className="recipe-tags">
          {recipe.tags.map((tag, index) => (
            <span key={index} className="recipe-tag">{tag}</span>
          ))}
        </div>
      </div>
      <div className="recipe-ingredients">
        <h3>Ingredients:</h3>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      <div className="recipe-steps">
        <h3>Preparation Steps:</h3>
        <ol>
          {recipe.preparationSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
      <div className="recipe-actions">
        <button className="update-button" onClick={() => setShowUpdateModal(true)}>
          Update Recipe
        </button>
        <button className="delete-button" onClick={handleDelete}>
          Delete Recipe
        </button>
      </div>
      {showUpdateModal && (
        <UpdateRecipeModal
          recipe={recipe}
          onClose={() => setShowUpdateModal(false)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

const UpdateRecipeModal = ({ recipe, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: recipe.title,
    description: recipe.description,
    ingredients: recipe.ingredients.join(', '), // Join for display
    preparationSteps: recipe.preparationSteps.join('. '), // Join for display
    tags: recipe.tags,
    difficulty: recipe.difficulty,
  });

  const [newTag, setNewTag] = useState(''); // For typing tags

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagInputChange = (e) => {
    setNewTag(e.target.value);
  };

  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      setFormData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, newTag.trim()],
      }));
      setNewTag(''); // Clear the text box
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedRecipe = {
      ...formData,
      ingredients: formData.ingredients.split(',').map((item) => item.trim()),
      preparationSteps: formData.preparationSteps.split('.').map((step) => step.trim()).filter(Boolean),
    };

    onSave(updatedRecipe);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Update Recipe</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
          </label>
          <label>
            Description:
            <textarea name="description" value={formData.description} onChange={handleInputChange} required />
          </label>
          <label>
            Ingredients (comma-separated):
            <input type="text" name="ingredients" value={formData.ingredients} onChange={handleInputChange} required />
          </label>
          <label>
            Preparation Steps (separate with periods):
            <textarea name="preparationSteps" value={formData.preparationSteps} onChange={handleInputChange} required />
          </label>
          <label>
            Difficulty:
            <select name="difficulty" value={formData.difficulty} onChange={handleInputChange}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>
          <label>
            Tags:
            <div className="tag-input">
              <input
                type="text"
                value={newTag}
                onChange={handleTagInputChange}
                placeholder="Enter a tag"
              />
              <button type="button" onClick={handleAddTag}>
                Add Tag
              </button>
            </div>
            <div className="tag-list">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag-item">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="remove-tag">
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </label>
          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default RecipePage;
