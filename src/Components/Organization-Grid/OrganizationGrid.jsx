import React, { useState, useEffect } from 'react';
import './OrganizationGrid.css';

import image from '../../Scripts/image';

import { NavLink, useNavigate } from 'react-router-dom';


export default function OrganizationGrid() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/organizations');
        if (!response.ok) throw new Error('Failed to fetch organizations');
        const data = await response.json();
        console.log(data)
        setOrgs(data);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrgs();
  }, []);



  if (loading) return <div className="loading-state">Loading...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="org-grid-container">
      <h2 className="section-title">Select Organization</h2>
      
      <div className="org-grid">
        {orgs.map((org, index) => (
          <NavLink
            to={`/org/${org.id}`}
            key={org.id} 
          >

          <div 
            className="org-card"
            style={{ '--hover-color': org.primary_color || '#a00000' }}
          >
            <div className="card-content">
              <div className="logo-container">
                <img 
                  src={image(org.logo)} 
                  alt={`${org.abbreviation} Logo`} 
                  className="org-logo" 
                />
              </div>
              <h3 className="org-abbreviation">{org.abbreviation}</h3>
            </div>
          </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
