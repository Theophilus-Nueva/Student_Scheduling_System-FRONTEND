import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';

import Header from './Components/Header-Footer/Header';
import Footer from './Components/Header-Footer/Footer';
import OrganizationGrid from './Components/Organization-Grid/OrganizationGrid';
import './Components/Header-Footer/Layout.css';

import DashboardOverview from './Webpages/Dashboard-Overview/DashboardOverview';
import DashboardCreateEvent from './Webpages/Dashboard-Create-Event/DashboardCreateEvent';
import DashboardGenerateExcuseLettter from './Webpages/Dashboard-Generate-Excuse-Letter/DashboardGenerateExcuseLettter';
import MemberProfile from './Webpages/Member-Profile/MemberProfile';
import AddMember from './Webpages/Dashboard-Generate-Excuse-Letter/GenerateAddMember'

const Layout = () => {
  const location = useLocation();
  const [headerTitle, setHeaderTitle] = useState('Home');
  const [colorTheme, setColorTheme] = useState("transparent");

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const orgIndex = pathParts.indexOf('org');
    
    // Check if we are inside an organization route
    if (orgIndex !== -1 && pathParts[orgIndex + 1]) {
      const orgId = pathParts[orgIndex + 1];

      const fetchOrgName = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/organizations/${orgId}`);
          if (response.ok) {
            const [data] = await response.json();
            
            const name = data.name;
            const color = data.accent_color;
            setHeaderTitle(name);
            setColorTheme(color);
          }
        } catch (error) {
          console.error("Failed to fetch org name:", error);
          setHeaderTitle('Organization Dashboard');
        }
      };

      fetchOrgName();
    } else {
      setHeaderTitle('Home');
      setColorTheme('transparent')
    }
  }, [location.pathname]); 

  return (
    <div className="app-container">
      <Header title={headerTitle} theme={colorTheme}/>

      <main className="main-content">
        <Outlet /> 
      </main>

      <Footer />
    </div>
  );
};

function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<OrganizationGrid />} />
              <Route path="org/:id" element={<DashboardOverview />} />
              <Route path="org/:id/create-event" element={<DashboardCreateEvent />} />
              <Route path="org/:id/excuse-letter" element={<DashboardGenerateExcuseLettter />} />
              <Route path="org/:id/member-profile/:committee" element={<MemberProfile />} />
              <Route path="org/:id/add-member" element={<AddMember />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;