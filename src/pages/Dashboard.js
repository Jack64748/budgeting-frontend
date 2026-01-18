import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate } from 'react-router-dom';
import TransactionManager from '../components/TransactionManager'; 
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './App.css';

const COLORS = ['#fea500', '#00C49F'];



// Main function for the app the variable transactions, the function setTransactions
// useState([]): Initializes the list as an empty array
function Dashboard() {
  const [transactions, setTransactions] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  const navigate = useNavigate();




  // Defines an asynchronous function to get data without freezing the browser.
  const fetchTransactions = async () => {
    try {
      // Sends GET request to .net backend url
      const response = await fetch('http://localhost:5170/api/Budget');
      //turns response into a JavaScript-readable list
      const data = await response.json();
      // Put the DB data into memory and redraws the table
      setTransactions(data); 
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  // tells React to run this fetch exactly 
  // once when the page first loads, preventing a never-ending loop of requests.
  useEffect(() => {
    fetchTransactions();
  }, []);
  
  // This is a "callback" function. When the delete button in the 
  // child component is clicked, this function wipes the local screen 
  // data so the table disappears immediately.
  const handleClear = () => {
    setTransactions([]); // Clears UI state
  };



  // This creates an object where the keys are Category Names 
// and the values are arrays of transactions
const groupedTransactions = transactions.reduce((groups, tx) => {
  const categoryName = tx.category?.name || 'Other';
  if (!groups[categoryName]) {
    groups[categoryName] = [];
  }
  groups[categoryName].push(tx);
  return groups;
}, {});



  // --- CALCULATION LOGIC FOR THE GAUGE ---
  const budgetGoal = 2000; // You can change this to your monthly limit
  
  // Calculate total spent specifically for "Fun Money" (or all spending)
  // Math.abs turns negative numbers into positive for the chart
  const totalSpent = transactions
    .filter(tx => tx.category?.name === "Beer") 
    .reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);

  const remaining = Math.max(0, budgetGoal - totalSpent);

  const chartData = [
    { name: 'Spent', value: totalSpent },
    { name: 'Remaining', value: remaining },
  ];


  if (loading) return <div>Loading...</div>;

  // IF NO DATA: Show the "Get Started" screen
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <h2>No Transactions Found</h2>
        <p>It looks like you haven't uploaded any bank statements yet.</p>
        <button className="btn" onClick={() => navigate('/upload')}>
          Go to Upload Page
        </button>
      </div>
    );
  }

  // What the user actually sees
  return (
    <div>
      <h1>Budget Dashboard</h1>

      {/* SECTION 1: THE GAUGE CHART */}
      <div className="gauge-section" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h3>Fun Money Progress</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ marginTop: '-40px' }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>£{totalSpent.toFixed(2)}</span>
          <p style={{ color: 'gray' }}>Spent of £{budgetGoal} limit</p>
        </div>
      </div>

      <h3>Manage existing data</h3>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        
        
        {/* Connects the delete button to the clearing logic */}
        <TransactionManager onDataCleared={handleClear} />

        <button className="btn" onClick={() => navigate('/upload')}>
          Upload new data
        </button>
      </div>


      {/* Replace your existing table with this mapped grouped data */}
<div className="grouped-transactions-container">
  <h2>Spending by Category</h2>
  
  {Object.keys(groupedTransactions).map((catName) => {
    let categoryItems = groupedTransactions[catName];

    // Check if this is the "Other" category and sort it
    if (catName === "Other") {
        categoryItems = [...categoryItems].sort((a, b) => {
            const descA = a.description?.toUpperCase() || "";
            const descB = b.description?.toUpperCase() || "";
            
            if (sortOrder === 'asc') {
                return descA.localeCompare(descB);
            } else {
                return descB.localeCompare(descA);
            }
        });
    }

    const total = categoryItems.reduce((sum, item) => sum + item.amount, 0);

    return (
      <details key={catName} className="category-accordion">
        <summary className="category-summary">
          <div className="summary-content">
            <span className="cat-name">
               {/* Small arrow emoji that rotates automatically with <details> */}
               <span className="arrow">▶</span> {catName}
            </span>
            <span className="cat-count">({categoryItems.length} items)</span>
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
                {/* Clickable Header for Sorting */}
      <th 
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        style={{ cursor: 'pointer', userSelect: 'none' }}
        className="sortable-header"
      >
        Description {catName === "Other" && (sortOrder === 'asc' ? '▲' : '▼')}
      </th>
                <th>Amount</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {categoryItems.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.startedDate ? new Date(tx.startedDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{tx.description}</td>
                  <td style={{ color: tx.amount < 0 ? '#e74c3c' : '#27ae60' }}>
                    {tx.amount.toFixed(2)}
                  </td>
                  <td>{tx.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    );
  })}
</div>
     
        
      
    </div>
  );
}

export default Dashboard;