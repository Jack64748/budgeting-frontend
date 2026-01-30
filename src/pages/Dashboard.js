import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionManager from '../components/TransactionManager'; 
import SavingsCard from '../components/SavingCard';
import BudgetGauge from '../components/BudgetGauge';
import CategoryAccordion from '../components/CategoryAccordion';
import './App.css';

function Dashboard() {
  const [transactions, setTransactions] = useState([]); 
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const [resTrans, resCat] = await Promise.all([
        fetch('http://localhost:5170/api/Budget'),
        fetch('http://localhost:5170/api/Categories')
      ]);
      setTransactions(await resTrans.json());
      setCategories(await resCat.json());
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleMoveAll = async (description, newCatId) => {
    const response = await fetch('http://localhost:5170/api/Budget/reassign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, newCategoryId: parseInt(newCatId) })
    });
    if (response.ok) fetchTransactions();
  };

  const createAndMove = async (description) => {
    const newName = prompt("Enter new category name:");
    if (!newName) return;
    const catRes = await fetch('http://localhost:5170/api/Categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName })
    });
    const newCategory = await catRes.json();
    await handleMoveAll(description, newCategory.id);
  };

  const groupedTransactions = transactions.reduce((groups, tx) => {
    const categoryName = tx.category?.name || 'Other';
    if (!groups[categoryName]) groups[categoryName] = [];
    groups[categoryName].push(tx);
    return groups;
  }, {});

  if (loading) return <div>Loading...</div>;

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <h2>No Transactions Found</h2>
        <button className="btn" onClick={() => navigate('/upload')}>Go to Upload Page</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Budget Dashboard</h1>
      
      <SavingsCard transactions={transactions} />
      
      <BudgetGauge transactions={transactions} budgetGoal={2000} />

      <h3>Manage existing data</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <TransactionManager onDataCleared={() => setTransactions([])} />
        <button className="btn" onClick={() => navigate('/upload')} style={{ backgroundColor: '#2aa03d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}>
          Upload new data
        </button>
      </div>

      <div className="grouped-transactions-container">
        <h2>Spending by Category</h2>
        {Object.keys(groupedTransactions).map((catName) => (
          <CategoryAccordion 
            key={catName}
            catName={catName}
            items={groupedTransactions[catName]}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            categories={categories}
            handleMoveAll={handleMoveAll}
            createAndMove={createAndMove}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;