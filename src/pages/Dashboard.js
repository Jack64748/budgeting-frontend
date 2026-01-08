import React, { useState, useEffect } from 'react'; // Added useEffect
import FileUpload from '../components/FileUpload';
import TransactionManager from '../components/TransactionManager'; 
import './App.css';

function Dashboard() {
  const [transactions, setTransactions] = useState([]); // Default to empty array []

  // --- NEW LOGIC: Fetch data from Backend on Load ---
  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5170/api/Budget');
      const data = await response.json();
      setTransactions(data); // Put the DB data into our state
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Run this once when the page loads
  useEffect(() => {
    fetchTransactions();
  }, []);
  // ------------------------------------------------

  const handleClear = () => {
    setTransactions([]); // Clears UI state
  };

  return (
    <div>
      <h1>Budget Dashboard</h1>
      <h3>Upload your CSV file or manage existing data</h3>
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        {/* Upload Button */}
        <FileUpload onData={setTransactions} />
        
        {/* Delete Button */}
        <TransactionManager onDataCleared={handleClear} />
      </div>

      {Array.isArray(transactions) && transactions.length > 0 ? (
        <div>
          <h2>Transactions</h2>
          <table border="1" cellPadding="3" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Product</th>
                <th>Started Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>State</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={tx.id || i}>
                  <td>{tx.type}</td>
                  <td>{tx.product}</td>
                  <td>{tx.startedDate ? new Date(tx.startedDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{tx.description}</td>
                  <td style={{ color: tx.amount < 0 ? 'red' : 'green' }}>
                    {tx.amount}
                  </td>
                  <td>{tx.currency}</td>
                  <td>{tx.state}</td>
                  <td>{tx.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ marginTop: '20px', color: 'gray' }}>
          No transactions found. Try uploading a CSV!
        </div>
      )}
    </div>
  );
}

export default Dashboard;