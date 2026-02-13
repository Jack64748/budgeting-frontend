import React from 'react';

const CategoryTable = ({ categories, editingId, tempName, onEdit, onCancel, onSave, onDelete, onTempNameChange, onAddClick }) => (
  <section className="management-card">
    <div className="card-header">
      <h3>Categories</h3>
      <button className="btn add-btn" onClick={onAddClick}>+</button>
    </div>
    <table className="data-table">
      <thead>
        <tr>
          <th style={{ width: '50px' }}>ID</th>
          <th>Name</th>
          <th className="actions-column"></th>
        </tr>
      </thead>
      <tbody>
        {categories.map(cat => (
          <tr key={cat.id}>
            <td>{cat.id}</td>
            <td>
              {editingId === cat.id ? (
                <input 
                  className="inline-input"
                  value={tempName} 
                  onChange={(e) => onTempNameChange(e.target.value)}
                  onBlur={() => onSave(cat.id)}
                  autoFocus
                />
              ) : cat.name}
            </td>
            <td className="actions-cell">
              <button className="icon-btn edit" onClick={() => onEdit(cat)}>✏️</button>
              <button className="icon-btn delete" onClick={() => onDelete(cat.id)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);

export default CategoryTable;
