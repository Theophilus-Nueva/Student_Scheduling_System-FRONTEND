import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashNavigation from '../Dash-Navigation/DashNavigation'; 
import './MemberProfile.css'; 

import ProfileInfo from './ProfileInfo';
import ScheduleTable from './ScheduleTable';

import { API_BASE_URL } from './../../../config';

const MemberProfile = () => {
  const { id, committee } = useParams();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await fetch(`${API_BASE_URL}/api/committees/${committee}`);
        const profileData = await profileRes.json();
        const finalProfile = Array.isArray(profileData) ? profileData[0] : profileData;
        setProfile(finalProfile);
        
        const scheduleRes = await fetch(`${API_BASE_URL}/api/organizations/${id}/committee-schedule/${committee}`);
        const scheduleData = await scheduleRes.json();
        
        if (Array.isArray(scheduleData)) {
            setSchedule(scheduleData);
        } else {
            setSchedule([]); 
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, committee]);

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

  const handleDelete = async () => {
    const confirmed = window.confirm(
        `Are you sure you want to delete ${profile.first_name} ${profile.last_name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/committees/${committee}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete member');
        }

        alert("Member deleted successfully.");
        navigate(`/org/${id}/excuse-letter`); 

    } catch (error) {
        console.error(error);
        alert("An error occurred while deleting.");
        setLoading(false);
    }
  };

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

      const profileResponse = await fetch(`${API_BASE_URL}/api/committees/${committee}`, {
        method: 'PUT',
        body: formData, 
      });

      if (!profileResponse.ok) {
          const errText = await profileResponse.text();
          throw new Error("Failed to update profile: " + errText);
      }

      const schedulePromises = schedule.map(row => {
        if (!row.subject_code && !row.day && !row.start_time) return Promise.resolve();

        const payload = {
            start_time: row.start_time,
            end_time: row.end_time,
            day: row.day,
            section: row.section,
            subject_code: row.subject_code,
            instructor: row.instructor,
            committee_id: committee 
        };

        if (row.id) {
            return fetch(`${API_BASE_URL}/api/schedules/${row.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            return fetch(`${API_BASE_URL}/api/schedules`, {
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
      console.error(err);
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

          <div className="mp-top-actions">
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