import React, { useState } from 'react';
import './AddRecipeModal.css';

const AddRecipeModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    preparationSteps: '',
    tags: [],
    difficulty: 'Easy',
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

    const newRecipe = {
      ...formData,
      ingredients: formData.ingredients.split(',').map((item) => item.trim()),
      preparationSteps: formData.preparationSteps.split('.').map((step) => step.trim()).filter(Boolean),
    };

    onSave(newRecipe);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create New Recipe</h2>
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

export default AddRecipeModal;
