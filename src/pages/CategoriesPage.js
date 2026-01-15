import React, { useState, useEffect } from 'react';
import './CategoriesPage.css';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const catRes = await fetch('http://localhost:5170/api/Categories'); // You'll need these endpoints
    const ruleRes = await fetch('http://localhost:5170/api/CategoryRules');
    setCategories(await catRes.json());
    setRules(await ruleRes.json());
  };

  return (
    <div className="categories-container">
      <h1>Category Management</h1>

      <div className="tables-wrapper">
        {/* Left Section: Categories */}
        <div className="table-section">
          <div className="header-actions">
            <h3>Categories</h3>
            <div className="button-group">
              <button className="btn add">Add</button>
              <button className="btn edit">Edit</button>
              <button className="btn delete">Delete</button>
            </div>
          </div>
          <table className="management-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>{cat.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Section: Category Rules */}
        <div className="table-section">
          <div className="header-actions">
            <h3>Category Rules (Keywords)</h3>
            <div className="button-group">
              <button className="btn add">Add Rule</button>
              <button className="btn edit">Edit Rule</button>
              <button className="btn delete">Delete Rule</button>
            </div>
          </div>
          <table className="management-table">
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {rules.map(rule => (
                <tr key={rule.id}>
                  <td>{rule.keyword}</td>
                  <td>{rule.category?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
