import React from 'react';

const CategoryAccordion = ({ 
  catName, 
  items, 
  sortOrder, 
  setSortOrder, 
  categories, 
  handleMoveAll, 
  createAndMove 
}) => {
  // Sort logic for "Other"
  let displayItems = catName === "Other" 
    ? [...items].sort((a, b) => {
        const descA = a.description?.toUpperCase() || "";
        const descB = b.description?.toUpperCase() || "";
        return sortOrder === 'asc' ? descA.localeCompare(descB) : descB.localeCompare(descA);
      })
    : items;

  const total = displayItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <details className="category-accordion">
      <summary className="category-summary">
        <div className="summary-content">
          <span className="cat-name"><span className="arrow">▶</span> {catName}</span>
          <span className="cat-count">({displayItems.length} items)</span>
          <span className={`cat-total ${total < 0 ? 'negative' : 'positive'}`}>
            £{Math.abs(total).toFixed(2)}
          </span>
        </div>
      </summary>
      <div className="expanded-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="sortable-header" style={{ cursor: 'pointer' }}>
                Description {catName === "Other" && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th>Amount</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayItems.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.startedDate ? new Date(tx.startedDate).toLocaleDateString() : 'N/A'}</td>
                <td>{tx.description}</td>
                <td style={{ color: tx.amount < 0 ? '#e74c3c' : '#27ae60' }}>{tx.amount.toFixed(2)}</td>
                <td>{tx.state}</td>
                <td>
                  <select className="move-select" defaultValue="" onChange={(e) => {
                    if (e.target.value === "CREATE_NEW") createAndMove(tx.description);
                    else if (e.target.value !== "") handleMoveAll(tx.description, e.target.value);
                    e.target.value = "";
                  }}>
                    <option value="" disabled>Actions...</option>
                    <option value="CREATE_NEW" style={{ fontWeight: 'bold', color: '#007bff' }}>✨ New Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>Move to {cat.name}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
};

export default CategoryAccordion;