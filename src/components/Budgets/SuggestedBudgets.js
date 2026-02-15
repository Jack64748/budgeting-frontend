import React from 'react';

const SuggestedBudgets = ({ suggestions, onAdd }) => (
  <section className="management-card suggestions-sidebar">
    <div className="card-header">
      <h3>Quick Add</h3>
    </div>
    <p className="modal-subtitle">Categories without a budget:</p>
    <div className="suggestion-list">
      {suggestions.map(cat => (
        <div key={cat.id} className="suggestion-item">
          <span>{cat.name}</span>
          <button className="btn add-btn" onClick={() => onAdd(cat.id)}>+ £0</button>
        </div>
      ))}
    </div>
  </section>
);

export default SuggestedBudgets;