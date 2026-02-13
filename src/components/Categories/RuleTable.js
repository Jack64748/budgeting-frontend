import React from 'react';

const RuleTable = ({ rules, onDelete, onAddClick }) => (
  <section className="management-card">
    <div className="card-header">
      <h3>Category Rules</h3>
      <button className="btn add-btn" onClick={onAddClick}>+</button>
    </div>
    <table className="data-table">
      <thead>
        <tr>
          <th>Keyword</th>
          <th>Category</th>
          <th className="actions-column"></th>
        </tr>
      </thead>
      <tbody>
        {rules.map(rule => (
          <tr key={rule.id}>
            <td>{rule.keyword}</td>
            <td><span className="cat-badge">{rule.category?.name || 'Other'}</span></td>
            <td className="actions-cell">
              <button className="icon-btn delete" onClick={() => onDelete(rule.id)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);

export default RuleTable;
