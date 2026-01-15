import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? '➡' : '⬅'}
      </button>
      
      <div className="sidebar-header">
        {!isCollapsed && <h2>Auto Budget</h2>}
      </div>

      <nav className="nav-menu">
        <NavLink to="/" className="nav-item">
          <span className="icon">📊</span>
          {!isCollapsed && <span className="label">Dashboard</span>}
        </NavLink>
        <NavLink to="/upload" className="nav-item">
          <span className="icon">📁</span>
          {!isCollapsed && <span className="label">Upload</span>}
        </NavLink>
        <NavLink to="/categories" className="nav-item">
          <span className="icon">🏷️</span>
          {!isCollapsed && <span className="label">Categories</span>}
        </NavLink>
        <NavLink to="/budgets" className="nav-item">
          <span className="icon">💰</span>
          {!isCollapsed && <span className="label">Budgets</span>}
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;