import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashNavigation from '../Dash-Navigation/DashNavigation';
import '../Member-Profile/MemberProfile.css'; 
import ScheduleTable from '../Member-Profile/ScheduleTable'; 

const AddMember = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        college: '',
        program: '',
        section: '',
    });

    const [profilePicture, setProfilePicture] = useState(null); // Store RAW file
    const [previewImage, setPreviewImage] = useState(null);   // For display only
    const [schedule, setSchedule] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file); // Save the raw file object
            setPreviewImage(URL.createObjectURL(file)); // Create local preview
        }
    };

    const handleScheduleChange = (index, field, value) => {
        const updatedSchedule = [...schedule];
        updatedSchedule[index][field] = value;
        setSchedule(updatedSchedule);
    };

    const handleAddRow = () => {
        setSchedule((prev) => [
            ...prev,
            { day: '', start_time: '', end_time: '', subject_code: '', section: '', instructor: '' },
        ]);
    };

    const handleSubmit = async () => {
        if (!formData.first_name || !formData.last_name) {
            alert('First Name and Last Name are required.');
            return;
        }

        try {
            setLoading(true);

            // 2. Use FormData for Multipart Upload
            const data = new FormData();
            data.append('firstName', formData.first_name);
            data.append('lastName', formData.last_name);
            data.append('college', formData.college);
            data.append('program', formData.program);
            data.append('section', formData.section);
            data.append('orgId', id);
            
            if (profilePicture) {
                // 'profilePicture' must match the key in backend upload.single()
                data.append('profilePicture', profilePicture); 
            }

            // --- API CALL 1: Add Member (Multipart) ---
            const profileResponse = await fetch(`http://localhost:3000/api/committees`, {
                method: 'POST',
                // Note: Do NOT set Content-Type header manually for FormData
                body: data, 
            });

            if (!profileResponse.ok) {
                const errorText = await profileResponse.text();
                throw new Error('Failed to add profile: ' + errorText);
            }

            const profileResult = await profileResponse.json();
            const newCommitteeId = profileResult.id || profileResult.lastID; 

            if (!newCommitteeId) throw new Error("Profile created, but no ID was returned.");

            // --- API CALL 2: Add Schedule (JSON) ---
            if (schedule.length > 0) {
                const validSchedule = schedule.filter(row => row.subject_code || row.day);
                
                const schedulePromises = validSchedule.map(row => {
                    return fetch(`http://localhost:3000/api/schedules`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            startTime: row.start_time,
                            endTime: row.end_time,
                            day: row.day,
                            section: row.section,
                            subjectTitle: row.subject_code,
                            subjectCode: row.subject_code,
                            instructor: row.instructor,
                            userId: newCommitteeId
                        })
                    });
                });
                await Promise.all(schedulePromises);
            }

            alert('Member added successfully!');
            navigate(`/org/${id}/excuse-letter`); 

        } catch (error) {
            console.error('Error adding member:', error);
            alert('An error occurred: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mp-page-wrapper">
            <DashNavigation id={id} />
            <div className="mp-main-container">
                <div className="mp-profile-card">
                    <button className="mp-back-btn" onClick={() => navigate(-1)}>
                        &larr; Back to list
                    </button>
                    <button className="mp-top-edit-btn mp-save-mode" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'SAVING...' : 'SAVE MEMBER'}
                    </button>

                    <div className="mp-identity-section">
                        {/* Avatar Upload UI */}
                        <div className="mp-avatar-box" style={{ overflow: 'visible' }}>
                            <label style={{
                                    width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden',
                                    border: '3px solid #ccc', background: '#e0e0e0',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: '#555', position: 'relative',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#d0d0d0')} 
                                onMouseLeave={(e) => (e.currentTarget.style.background = '#e0e0e0')}
                            >
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <>
                                        <span className="mp-camera-icon" style={{ fontSize: '2rem', opacity: 0.6 }}>📷</span>
                                        <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' }}>upload image</span>
                                    </>
                                )}
                                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>

                        {/* Inputs Block */}
                        <div className="mp-details-block">
                            <div className="mp-edit-inputs">
                                <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} />
                                <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} />
                                <input type="text" name="college" placeholder="College" style={{ width: '100%' }} value={formData.college} onChange={handleChange} />
                            </div>
                            <div className="mp-info-grid">
                                <div className="mp-info-row">
                                    <span className="mp-label">Program:</span>
                                    <input type="text" name="program" placeholder="e.g. BS Computer Science" value={formData.program} onChange={handleChange} />
                                </div>
                                <div className="mp-info-row">
                                    <span className="mp-label">Section:</span>
                                    <input type="text" name="section" placeholder="e.g. IT201-WM" value={formData.section} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <ScheduleTable schedule={schedule} isEditing={true} onChange={handleScheduleChange} onAddRow={handleAddRow} />
                </div>
            </div>
        </div>
    );
};

export default AddMember;