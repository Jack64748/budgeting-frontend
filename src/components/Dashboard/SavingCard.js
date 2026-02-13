import React from 'react';

const SavingsCard = ({ transactions }) => {
  const savingsData = transactions
    .filter(tx => tx.product === "Savings")
    .sort((a, b) => new Date(b.startedDate) - new Date(a.startedDate));

  const currentSavings = savingsData.length > 0 ? savingsData[0].balance : 0;
  const latestDate = savingsData.length > 0 ? savingsData[0].startedDate : null;

  return (
    <div className="savings-card" style={{ 
      background: '#f0f9ff', padding: '10px', borderRadius: '10px', 
      border: '4px solid #bae6fd', marginBottom: '20px' 
    }}>
      <h3 style={{ margin: 0, color: '#0369a1' }}>🏦 Total Savings Balance</h3>
      <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>
        £{currentSavings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </p>
      <small style={{ color: '#0c4a6e' }}>
        Latest sync: {latestDate ? new Date(latestDate).toLocaleDateString() : 'No data'}
      </small>
    </div>
  );
};

export default SavingsCard;