import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#fea500', '#00C49F'];

const BudgetGauge = ({ transactions, budgetGoal = 2000 }) => {
  const totalSpent = transactions
    .filter(tx => tx.category?.name === "Fitness") 
    .reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);

  const remaining = Math.max(0, budgetGoal - totalSpent);
  const chartData = [
    { name: 'Spent', value: totalSpent },
    { name: 'Remaining', value: remaining },
  ];

  return (
    <div className="gauge-section" style={{ textAlign: 'center', marginBottom: '30px' }}>
      <h3>Fitness Budget Progress</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData} cx="50%" cy="100%" startAngle={180} endAngle={0}
            innerRadius={70} outerRadius={90} paddingAngle={2} dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-gauge-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ marginTop: '-40px' }}>
        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>£{totalSpent.toFixed(2)}</span>
        <p style={{ color: 'gray' }}>Spent of £{budgetGoal} limit</p>
      </div>
    </div>
  );
};

export default BudgetGauge;