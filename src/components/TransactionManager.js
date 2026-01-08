import React from 'react';

const TransactionManager = ({ onDataCleared }) => {
    
    const handleClearData = async () => {
    if (!window.confirm("Are you sure?")) return;

    try {
        // Change the port here if your terminal shows something other than 5000!
        const response = await fetch('http://localhost:5170/api/Budget/clear', {
            method: 'DELETE',
        });

        if (response.ok) {
            alert("Database cleared!");
            if (onDataCleared) onDataCleared();
        } else {
            const errorData = await response.json();
            alert("Server Error: " + errorData.error);
        }
    } catch (error) {
        // This is where your 'ERR_CONNECTION_REFUSED' is being caught
        console.error("Connection Error:", error);
        alert("Could not connect to the server. Is the .NET backend running?");
    }
};

    return (
        <div style={{ marginTop: '20px' }}>
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