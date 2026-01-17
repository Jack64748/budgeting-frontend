import React, { useState, useEffect } from 'react';
import './CategoriesPage.css';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [rules, setRules] = useState([]);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [editingCatId, setEditingCatId] = useState(null);
  const [tempCatName, setTempCatName] = useState("");

  // Modal Visibility
const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);

// Form Data
const [newRuleKeyword, setNewRuleKeyword] = useState("");
const [selectedCatId, setSelectedCatId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const catRes = await fetch('http://localhost:5170/api/Categories');
      const ruleRes = await fetch('http://localhost:5170/api/CategoryRules');
      if (catRes.ok) setCategories(await catRes.json());
      if (ruleRes.ok) setRules(await ruleRes.json());
    } catch (err) { console.error("Fetch error:", err); }
  };

  // --- Category Logic ---
  const updateCategory = async (id) => {
    await fetch(`http://localhost:5170/api/Categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: tempCatName })
    });
    setEditingCatId(null);
    fetchData();
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Delete this category?")) {
      await fetch(`http://localhost:5170/api/Categories/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  // --- Rule Logic ---
  const deleteRule = async (id) => {
    if (window.confirm("Delete this rule?")) {
      await fetch(`http://localhost:5170/api/CategoryRules/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };


  // --- Category Logic ---
  const saveCategory = async () => {
    if (!newCatName) return alert("Enter a name");
    try {
      const response = await fetch('http://localhost:5170/api/Categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName })
      });
      if (response.ok) {
        setNewCatName("");
        setIsCatModalOpen(false);
        fetchData();
      }
    } catch (err) { console.error("Error saving category:", err); }
  };

  // --- Rule Logic ---
  const saveRule = async () => {
    console.log("Attempting to save rule..."); // Debug log
    if (!newRuleKeyword || !selectedCatId) {
      alert("Please enter a keyword and select a category");
      return;
    }

    try {
      const response = await fetch('http://localhost:5170/api/CategoryRules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          keyword: newRuleKeyword.toUpperCase(), 
          categoryId: parseInt(selectedCatId) // Ensure this is a number
        })
      });

      if (response.ok) {
        setNewRuleKeyword("");
        setSelectedCatId("");
        setIsRuleModalOpen(false);
        fetchData(); 
      } else {
        const errorText = await response.text();
        console.error("Server rejected rule:", errorText);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  return (
    <div className="categories-page">
    {/* RESTORED PAGE HEADER */}
    <div className="page-header">
      <h1>Category Management</h1>
      <p>Configure your spending buckets and auto-categorization keywords.</p>
    </div>
      <div className="tables-container">
        
        {/* CATEGORIES TABLE */}
        <section className="management-card">
          <div className="card-header">
            <h3>Categories</h3>
            <button className="btn add-btn" onClick={() => setIsCatModalOpen(true)}>+</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>ID</th> {/* Added ID Header */}
                <th>Name</th>
                <th className="actions-column"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td>{cat.id}</td> {/* Added ID Cell */}
                  <td>
                    {editingCatId === cat.id ? (
                      <input 
                        className="inline-input"
                        value={tempCatName} 
                        onChange={(e) => setTempCatName(e.target.value)}
                        onBlur={() => updateCategory(cat.id)}
                        autoFocus
                      />
                    ) : cat.name}
                  </td>
                  <td className="actions-cell">
                    <button className="icon-btn edit" onClick={() => {setEditingCatId(cat.id); setTempCatName(cat.name)}}>✏️</button>
                    <button className="icon-btn delete" onClick={() => deleteCategory(cat.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* RULES TABLE */}
        <section className="management-card">
          <div className="card-header">
            <h3>Category Rules</h3>
            <button className="btn add-btn" onClick={() => setIsRuleModalOpen(true)}>+</button>
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
                    <button className="icon-btn delete" onClick={() => deleteRule(rule.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* ADD CATEGORY MODAL */}
      {isCatModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Category</h3>
            <input 
              type="text" 
              placeholder="e.g. Health" 
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
            <div className="modal-btns">
              <button className="btn save-btn" onClick={saveCategory}>Save</button>
              <button className="btn cancel-btn" onClick={() => setIsCatModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD RULE MODAL */}
{isRuleModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Add New Logic Rule</h3>
      <p className="modal-subtitle">Transactions containing this keyword will be auto-categorized.</p>
      
      <label>Keyword</label>
      <input 
        type="text" 
        placeholder="e.g. PUREGYM" 
        value={newRuleKeyword}
        onChange={(e) => setNewRuleKeyword(e.target.value)}
      />

      <label>Target Category</label>
      <select 
        value={selectedCatId} 
        onChange={(e) => setSelectedCatId(e.target.value)}
      >
        <option value="">-- Select a Category --</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name} (ID: {cat.id})
          </option>
        ))}
      </select>

      <div className="modal-btns">
        <button className="btn" onClick={saveRule}>Create Rule</button>
        <button className="btn cancel-btn" onClick={() => setIsRuleModalOpen(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default CategoriesPage;
