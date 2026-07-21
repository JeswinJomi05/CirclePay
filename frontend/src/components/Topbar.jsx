import React from 'react';
import './Topbar.css';

const Topbar = () => {
  return (
    <header className="topbar">
      <div className="welcome-info">
        <h1 className="welcome-title">Hi, Aromal 👋</h1>
        <p className="welcome-subtitle">Track your spending and manage shared expenses easily.</p>
      </div>
    </header>
  );
};

export default Topbar;
