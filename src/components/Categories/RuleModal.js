import React from 'react';

const RuleModal = ({ isOpen, onClose, onSave, categories, keyword, setKeyword, selectedCatId, setSelectedCatId }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add New Logic Rule</h3>
        <label>Keyword</label>
        <input 
          type="text" 
          placeholder="e.g. PUREGYM" 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <label>Target Category</label>
        <select value={selectedCatId} onChange={(e) => setSelectedCatId(e.target.value)}>
          <option value="">-- Select a Category --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name} (ID: {cat.id})</option>
          ))}
        </select>
        <div className="modal-btns">
          <button className="btn save-btn" onClick={onSave}>Create Rule</button>
          <button className="btn cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default RuleModal;
