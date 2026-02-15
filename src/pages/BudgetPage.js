import React, { useState, useEffect } from 'react';
import BudgetTable from '../components/Budgets/BudgetTable';
import SuggestedBudgets from '../components/Budgets/SuggestedBudgets';
import './BudgetPage.css'; // Reuse your existing management styles!

const API_URL = 'http://localhost:5170/api';

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const currentMonth = "02-2026"; // We can make this dynamic later!

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [bRes, cRes] = await Promise.all([
        fetch(`${API_URL}/TheBudget/${currentMonth}`),
        fetch(`${API_URL}/Categories`)
      ]);
      if (bRes.ok) setBudgets(await bRes.json());
      if (cRes.ok) setCategories(await cRes.json());
    } catch (err) { console.error(err); }
  };

  const handleSaveBudget = async (categoryId, amount) => {
    await fetch(`${API_URL}/TheBudget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryId, amount: parseFloat(amount), monthYear: currentMonth })
    });
    fetchData();
  };

  const deleteBudget = async (id) => {
    await fetch(`${API_URL}/TheBudget/${id}`, { method: 'DELETE' });
    fetchData();
  };

  // Logic: Suggestions = Categories that ARE NOT in the current budgets list
  const suggestions = categories.filter(cat => 
    !budgets.some(b => b.categoryId === cat.id)
  );

  return (
    <div className="budgets-page">
      <div className="page-header">
        <h1>Budget Planning</h1>
        <p>Set limits for {currentMonth} to stay on track.</p>
      </div>

      <div className="tables-container">
        <BudgetTable 
          budgets={budgets} 
          onDelete={deleteBudget} 
          onUpdate={handleSaveBudget} 
        />
        
        <SuggestedBudgets 
          suggestions={suggestions} 
          onAdd={(catId) => handleSaveBudget(catId, 0)} 
        />
      </div>
    </div>
  );
};

export default BudgetsPage;