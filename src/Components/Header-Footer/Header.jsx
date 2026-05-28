import React from 'react';
import './Layout.css';

import LPU_logo from '../../Assets/LPU_Logo.png'

export default function Header({title, theme}) {
  return (
    <header className="main-header">
      {/* Top Beige Section */}
      <div className="header-top">
        {/* Logo Placeholder */}
        <img 
            src={LPU_logo} 
            alt="University Logo" 
            className="header-logo"
            style={{background: "transparent"}}
        />
        
        <div className="header-text">
          <h1 className="header-title">Student Scheduling System For Student Organizations</h1>
          <p className="header-subtitle">Human Computer Interaction</p>
        </div>
      </div>
    
      {/* Red Bar Section */}
      <div className="header-red-bar" >
        <h2 className="page-title">{title}</h2>
      </div>
      <div className='header-red-bar' style={{backgroundColor: theme}}></div>
    </header>
  );
}