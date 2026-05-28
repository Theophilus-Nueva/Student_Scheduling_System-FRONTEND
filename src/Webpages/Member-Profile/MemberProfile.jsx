import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashNavigation from '../Dash-Navigation/DashNavigation'; 
import './MemberProfile.css'; 

import ProfileInfo from './ProfileInfo';
import ScheduleTable from './ScheduleTable';

const MemberProfile = () => {
  const { id, committee } = useParams(); // 'id' = Org ID, 'committee' = Member ID
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    first_name: '', last_name: '', middle_initial: '', 
    college: '', birthday: '', program: '', section: '', profile_picture: null
  });

  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [schedule, setSchedule] = useState([]);

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await fetch(`http://localhost:3000/api/committees/${committee}`);
        const profileData = await profileRes.json();
        const finalProfile = Array.isArray(profileData) ? profileData[0] : profileData;
        setProfile(finalProfile);
        
        const scheduleRes = await fetch(`http://localhost:3000/api/organizations/${id}/committee-schedule/${committee}`);
        const scheduleData = await scheduleRes.json();
        
        if (Array.isArray(scheduleData)) {
            setSchedule(scheduleData);
        } else {
            setSchedule([]); 
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, committee]);

  // Handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setNewProfilePicture(file);
        setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[index][field] = value;
    setSchedule(updatedSchedule);
  };

  const handleAddRow = () => {
    setSchedule(prev => [
      ...prev,
      { day: '', start_time: '', end_time: '', subject_code: '', section: '', instructor: '' }
    ]);
  };

  // --- NEW: DELETE MEMBER FUNCTION ---
  const handleDelete = async () => {
    // 1. Confirm deletion
    const confirmed = window.confirm(
        `Are you sure you want to delete ${profile.first_name} ${profile.last_name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
        setLoading(true);
        // 2. Call API
        const response = await fetch(`http://localhost:3000/api/committees/${committee}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete member');
        }

        // 3. Success
        alert("Member deleted successfully.");
        navigate(`/org/${id}/excuse-letter`); // Go back to main list

    } catch (error) {
        console.error("Error deleting member:", error);
        alert("An error occurred while deleting.");
        setLoading(false);
    }
  };

  // Save Logic (Updated with correct fields)
  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('firstName', profile.first_name);
      formData.append('lastName', profile.last_name);
      formData.append('college', profile.college);
      formData.append('program', profile.program);
      formData.append('section', profile.section);
      formData.append('orgId', id);

      if (newProfilePicture) {
        formData.append('profilePicture', newProfilePicture);
      }

      const profileResponse = await fetch(`http://localhost:3000/api/committees/${committee}`, {
        method: 'PUT',
        body: formData, 
      });

      if (!profileResponse.ok) {
          const errText = await profileResponse.text();
          throw new Error("Failed to update profile: " + errText);
      }

      // Schedule Logic (PUT vs POST)
      const schedulePromises = schedule.map(row => {
        if (!row.subject_code && !row.day && !row.start_time) return Promise.resolve();

        const payload = {
            startTime: row.start_time,
            endTime: row.end_time,
            day: row.day,
            section: row.section,
            subjectTitle: row.subject_title || row.subject_code,
            subjectCode: row.subject_code,
            instructor: row.instructor,
            userId: committee
        };

        if (row.id) {
            return fetch(`http://localhost:3000/api/schedules/${row.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            return fetch(`http://localhost:3000/api/schedules`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }
      });

      await Promise.all(schedulePromises);
      setIsEditing(false);
      alert("Details updated successfully!");
      window.location.reload(); 

    } catch (err) {
      console.error("Error updating:", err);
      alert("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading Profile...</div>;

  return (
    <div className="mp-page-wrapper">
      <DashNavigation id={id} />

      <div className="mp-main-container">
        <div className="mp-profile-card">
          
          <button className="mp-back-btn" onClick={() => navigate(-1)}>
            &larr; Back to list
          </button>

          {/* Action Buttons Container */}
          <div className="mp-top-actions">
            
            {/* NEW: Delete Button (Only visible in Edit Mode) */}
            {isEditing && (
                <button 
                    className="mp-delete-btn" 
                    onClick={handleDelete}
                    disabled={loading}
                >
                    DELETE MEMBER
                </button>
            )}

            <button 
                className={`mp-top-edit-btn ${isEditing ? 'mp-save-mode' : ''}`} 
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                disabled={loading && isEditing}
            >
                {isEditing ? (loading ? 'SAVING...' : 'SAVE CHANGES') : 'EDIT DETAILS'}
            </button>
          </div>

          <ProfileInfo 
            profile={profile} 
            isEditing={isEditing} 
            onChange={handleProfileChange}
            previewImage={previewImage} 
            onImageChange={handleImageChange} 
          />

          <ScheduleTable 
            schedule={schedule} 
            isEditing={isEditing} 
            onChange={handleScheduleChange} 
            onAddRow={handleAddRow} 
          />

        </div>
      </div>
    </div>
  );
};

export default MemberProfile;