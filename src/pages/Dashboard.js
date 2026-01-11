import React, { useState, useEffect } from 'react'; // Added useEffect
import FileUpload from '../components/FileUpload';
import TransactionManager from '../components/TransactionManager'; 
import './App.css';


// Main function for the app the variable transactions, the function setTransactions
// useState([]): Initializes the list as an empty array
function Dashboard() {
  const [transactions, setTransactions] = useState([]); 




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
      console.error("Error fetching transactions:", error);
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



  // What the user actually sees
  return (
    <div>
      <h1>Budget Dashboard</h1>
      <h3>Upload your CSV file or manage existing data</h3>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        
        {/* Passes the "memory update" function to the upload button so it can 
        refresh the table after a successful upload.*/}
        <FileUpload onData={setTransactions} />

        {/* Connects the delete button to the clearing logic */}
        <TransactionManager onDataCleared={handleClear} />
      </div>
      {/*Ternary Operator. It checks if you have data. If yes, 
      show the table; if no, show a message.*/}
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
              {/* This loops through every transaction in 
               memory and creates a new row (<tr>) for each one. */}
              {transactions.map((tx, i) => (
                <tr key={tx.id || i}>
                  <td>{tx.type}</td>
                  <td>{tx.product}</td>
                  {/* turns a messy computer timestamp into a readable date (e.g., 11/01/2026) */}
                  <td>{tx.startedDate ? new Date(tx.startedDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{tx.description}</td>
                  {/* checks if the money is going out (negative) or coming in (positive) and colors the text red or green accordingly */}
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