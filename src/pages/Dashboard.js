import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import './App.css';

function Dashboard() {
  const [transactions, setTransactions] = useState(null);

  return (
    <div>
      <h1>Budget Dashboard</h1>
      <h3>This is where you upload your CSV file!</h3>
      <FileUpload onData={setTransactions} />
      {Array.isArray(transactions) && transactions.length > 0 && (
        <div>
          <h2>Transactions</h2>
          <table border="1" cellPadding="3" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Product</th>
                <th>StartedDate</th>
                <th>CompletedDate</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Fee</th>
                <th>Currency</th>
                <th>State</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i}>
                  <td>{tx.type}</td>
                  <td>{tx.product}</td>
                  <td>{tx.startedDate}</td>
                  <td>{tx.completedDate}</td>
                  <td>{tx.description}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.fee}</td>
                  <td>{tx.currency}</td>
                  <td>{tx.state}</td>
                  <td>{tx.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Optional: debug raw result */}
      {/* <pre>{JSON.stringify(transactions, null, 2)}</pre> */}
      {transactions && transactions.length === 0 && <div>No transactions</div>}
    </div>
  );
}

export default Dashboard;