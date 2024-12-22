import { useState } from "react";
import "./AddRecipeModal.css"

const AddRecipeModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      ingredients: '',
      preparationSteps: '',
      tags: '',
      difficulty: 'Easy',
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      const newRecipe = {
        ...formData,
        ingredients: formData.ingredients.split(',').map((item) => item.trim()),
        preparationSteps: formData.preparationSteps.split('.').map((step) => step.trim()).filter(Boolean),
        tags: formData.tags.split(',').map((tag) => tag.trim()),
        id: Date.now(), // Use timestamp as a temporary ID
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
              Tags (comma-separated):
              <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} />
            </label>
            <label>
              Difficulty:
              <select name="difficulty" value={formData.difficulty} onChange={handleInputChange}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
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