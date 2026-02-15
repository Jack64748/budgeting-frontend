import React from 'react';

const BudgetTable = ({ budgets, onDelete, onUpdate }) => (
  <section className="management-card">
    <div className="card-header">
      <h3>Active Monthly Budgets</h3>
    </div>
    <table className="data-table">
      <thead>
        <tr>
          <th>Category</th>
          <th>Monthly Limit</th>
          <th className="actions-column"></th>
        </tr>
      </thead>
      <tbody>
        {budgets.map(b => (
          <tr key={b.id}>
            <td><span className="cat-badge">{b.category?.name}</span></td>
            <td>
              £<input 
                type="number" 
                className="inline-input" 
                value={b.amount} 
                onChange={(e) => onUpdate(b.categoryId, e.target.value)}
              />
            </td>
            <td className="actions-cell">
              <button className="icon-btn delete" onClick={() => onDelete(b.id)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);

export default BudgetTable;