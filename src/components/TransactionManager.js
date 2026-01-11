import React from 'react';

// This is a functional component that accepts a Prop called onDataCleared
const TransactionManager = ({ onDataCleared }) => {
    
    // Triggers a native browser popup
    const handleClearData = async () => {
    if (!window.confirm("Are you sure?")) return;

    try {
        // This matches the [HttpDelete("clear")] route  defined in BudgetController.cs
        const response = await fetch('http://localhost:5170/api/Budget/clear', {
            method: 'DELETE',
        });

        if (response.ok) {
            alert("Database cleared!");
            // if database empty calls function to clear ui table within dashboard.js
            if (onDataCleared) onDataCleared();
        } else {
            const errorData = await response.json();
            alert("Server Error: " + errorData.error);
        }
    } catch (error) {
       
        console.error("Connection Error:", error);
        alert("Could not connect to the server. Is the .NET backend running?");
    }
};

    return (
        <div style={{ marginTop: '20px' }}>
            {/* Connects the button click to the asynchronous function.*/} 
            <button 
                onClick={handleClearData} 
                style={{ backgroundColor: '#ff4d4d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
                Clear All Data
            </button>
        </div>
    );
};

export default TransactionManager;