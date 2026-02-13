import React from 'react';

const CategoryModal = ({ isOpen, onClose, onSave, name, setName }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add New Category</h3>
        <input 
          type="text" 
          placeholder="e.g. Health" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="modal-btns">
          <button className="btn save-btn" onClick={onSave}>Save</button>
          <button className="btn cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
