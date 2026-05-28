import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashNavigation from '../Dash-Navigation/DashNavigation'; 
import './DashboardGenerateExcuseLettter.css';
import image from '../../Scripts/image'; 
import searchIcon from '../../Assets/searchIcon.svg'

import GenerateExcuseModal from './GenerateExcuseModal'; // Adjust path as needed

const DashboardGenerateExcuseLetter = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedIds, setSelectedIds] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/organizations/${id}/committees`);
        if (!response.ok) throw new Error('Failed to fetch members');
        
        const data = await response.json();
        setMembers(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleMember = (memberId) => {
    setSelectedIds(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  const toggleAll = () => {
    const allSelected = members.length > 0 && members.every(m => selectedIds[m.id]);
    const newSelection = {};
    if (!allSelected) {
      members.forEach(m => { newSelection[m.id] = true; });
    }
    setSelectedIds(newSelection);
  };

  const handleProfileClick = (e, memberId) => {
    e.stopPropagation(); 
    navigate(`/org/${id}/member-profile/${memberId}`);
  };
  
  const handleGenerate = () => {
    const selectedCount = Object.values(selectedIds).filter(Boolean).length;
    
    if (selectedCount === 0) {
      alert("Please select at least one member.");
      return;
    }
    
    setIsGenerateModalOpen(true);
  };

  const handleAddMember = () => {
    navigate(`/org/${id}/add-member`);
  };

  const isAllSelected = members.length > 0 && members.every(m => selectedIds[m.id]);

  const filteredMembers = members.filter(member => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    const programInfo = `${member.program} ${member.section}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    return fullName.includes(searchLower) || programInfo.includes(searchLower);
  });

  const selectedMembersList = members.filter(member => selectedIds[member.id]);

  if (loading) return <div className="loading-screen">Loading Members...</div>;

  return (
    <div className="excuse-letter-page">
      <DashNavigation id={id} />

      <div className="excuse-layout">
        
        {/* LEFT SIDEBAR */}
        <div className="excuse-sidebar">
          <div className="sidebar-header">
            <h2>Select Members</h2>
            <span className="subtitle">Filter Selection</span>
          </div>

          <div className="committees-list">
             <div className="committee-group">
                <div className="comm-title-row">
                    <div className="red-indicator"></div>
                    <h3>ALL MEMBERS</h3>
                </div>
                
                <label className="checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={isAllSelected}
                    onChange={toggleAll}
                  />
                  <div className="checkbox-info">
                    <span className="cb-name">SELECT ALL</span>
                    <span className="cb-office">{members.length} Members</span>
                  </div>
                </label>
              </div>

              {selectedMembersList.length > 0 && (
                <div className="committee-group" style={{ marginTop: '20px' }}>
                    <div className="comm-title-row">
                        <div className="red-indicator"></div>
                        <h3>SELECTED ({selectedMembersList.length})</h3> 
                    </div>

                    {selectedMembersList.map((member) => (
                      <label key={member.id} className="checkbox-row animate-fade-in">
                        <input 
                          type="checkbox" 
                          checked={true} 
                          onChange={() => toggleMember(member.id)} 
                        />
                        <div className="checkbox-info">
                          <span className="cb-name">
                             {member.last_name}, {member.first_name}
                          </span>
                          <span className="cb-office">
                             {member.section}
                          </span>
                        </div>
                      </label>
                    ))}
                </div>
              )}
          </div>
          
          <div className="sidebar-footer">
            <button className="generate-btn" onClick={handleGenerate}>
              GENERATE EXCUSE LETTER
            </button>
          </div>
        </div>

        <div className="excuse-main">
          <div className="main-header-row">
            <h2>Members List</h2>
            <div className="search-bar">
                <span className="search-icon"><img src={searchIcon} alt="" width={32} /></span>
                <input 
                    type="text" 
                    placeholder="Search name, program, or section..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
          </div>

          <div className="members-grid">
             {filteredMembers.map((member) => {
                 const isSelected = !!selectedIds[member.id];
                 
                 return (
                    <div 
                        key={member.id} 
                        className={`member-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleMember(member.id)} 
                        style={{ cursor: 'pointer', border: isSelected ? '2px solid #a00000' : '1px solid transparent' }}
                    >
                        <div 
                            className="profile-img-container" 
                            onClick={(e) => handleProfileClick(e, member.id)}
                            title="View Profile"
                        >
                            {member.profile_picture ? (
                                <img 
                                    src={image(member.profile_picture)} 
                                    alt="Profile" 
                                    className="profile-img"
                                />
                            ) : (
                                <div className="profile-placeholder"></div>
                            )}
                        </div>

                        <div 
                            className="name-container"
                            onClick={(e) => handleProfileClick(e, member.id)}
                            title="View Profile"
                        >
                            <h3 className="member-name hover-underline">
                                {member.last_name},<br/>
                                <span style={{ fontWeight: 400 }}>{member.first_name}</span>
                            </h3>
                        </div>

                        <p className="member-office">{member.section}</p>
                        <p className="member-college">{member.program}</p>

                        <button className="view-btn">
                            {isSelected ? 'SELECTED' : 'SELECT'}
                        </button>
                    </div>
                 );
             })}
          </div>

          <div className="floating-add-container">
            <button className="floating-add-btn" onClick={handleAddMember}>
              + ADD NEW MEMBER
            </button>
          </div>

        </div>
      </div>

      <GenerateExcuseModal 
        isOpen={isGenerateModalOpen} 
        onClose={() => setIsGenerateModalOpen(false)}
        orgId={id}
        selectedMembers={selectedMembersList}
      />

    </div>
  );
};

export default DashboardGenerateExcuseLetter;