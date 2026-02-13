import React, { useState, useEffect } from 'react';
import CategoryTable from '../components/Categories/CategoryTable.js';
import RuleTable from '../components/Categories/RuleTable.js';
import CategoryModal from '../components/Categories/CategoryModal.js';
import RuleModal from '../components/Categories/RuleModal.js';
import './CategoriesPage.css';

const API_URL = 'http://localhost:5170/api';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [rules, setRules] = useState([]);
  
  // Modal & Edit States
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [tempCatName, setTempCatName] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newRuleKeyword, setNewRuleKeyword] = useState("");
  const [selectedCatId, setSelectedCatId] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [catRes, ruleRes] = await Promise.all([
        fetch(`${API_URL}/Categories`),
        fetch(`${API_URL}/CategoryRules`)
      ]);
      if (catRes.ok) setCategories(await catRes.json());
      if (ruleRes.ok) setRules(await ruleRes.json());
    } catch (err) { console.error("Fetch error:", err); }
  };

  const handleUpdateCategory = async (id) => {
    await fetch(`${API_URL}/Categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: tempCatName })
    });
    setEditingCatId(null);
    fetchData();
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Delete this category? Transactions will move to 'Other'.")) {
      await fetch(`${API_URL}/Categories/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const handleSaveCategory = async () => {
    if (!newCatName) return alert("Enter a name");
    const res = await fetch(`${API_URL}/Categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCatName })
    });
    if (res.ok) {
      setNewCatName("");
      setIsCatModalOpen(false);
      fetchData();
    }
  };

  const handleSaveRule = async () => {
    if (!newRuleKeyword || !selectedCatId) return alert("Fill all fields");
    const res = await fetch(`${API_URL}/CategoryRules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword: newRuleKeyword.toUpperCase(), categoryId: parseInt(selectedCatId) })
    });
    if (res.ok) {
      setNewRuleKeyword("");
      setSelectedCatId("");
      setIsRuleModalOpen(false);
      fetchData();
    }
  };

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1>Category Management</h1>
        <p>Configure your spending buckets and auto-categorization keywords.</p>
      </div>

      <div className="tables-container">
        <CategoryTable 
          categories={categories} 
          editingId={editingCatId}
          tempName={tempCatName}
          onEdit={(cat) => { setEditingCatId(cat.id); setTempCatName(cat.name); }}
          onSave={handleUpdateCategory}
          onDelete={handleDeleteCategory}
          onTempNameChange={setTempCatName}
          onAddClick={() => setIsCatModalOpen(true)}
        />

        <RuleTable 
          rules={rules} 
          onDelete={(id) => fetch(`${API_URL}/CategoryRules/${id}`, { method: 'DELETE' }).then(fetchData)}
          onAddClick={() => setIsRuleModalOpen(true)}
        />
      </div>

      <CategoryModal 
        isOpen={isCatModalOpen} 
        onClose={() => setIsCatModalOpen(false)} 
        onSave={handleSaveCategory}
        name={newCatName}
        setName={setNewCatName}
      />

      <RuleModal 
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        onSave={handleSaveRule}
        categories={categories}
        keyword={newRuleKeyword}
        setKeyword={setNewRuleKeyword}
        selectedCatId={selectedCatId}
        setSelectedCatId={setSelectedCatId}
      />
    </div>
  );
};

export default CategoriesPage;
