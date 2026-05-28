import React from 'react';
import image from '../../Scripts/image'; 

const ProfileInfo = ({ profile, isEditing, onChange }) => {
  return (
    <div className="mp-identity-section">
      {/* Avatar */}
      <div className="mp-avatar-box">
          {profile?.profile_picture ? (
            <img 
              src={image(profile.profile_picture)} 
              alt="Profile" 
              onError={(e) => {e.target.style.display='none'}} 
            />
          ) : (
            <span className="mp-camera-icon">📷</span>
          )}
      </div>

      {/* Details */}
      <div className="mp-details-block">
        {isEditing ? (
            <div className="mp-edit-inputs">
              <input 
                type="text" name="last_name" placeholder="Last Name"
                value={profile.last_name || ''} onChange={onChange} 
              />
              <input 
                type="text" name="first_name" placeholder="First Name"
                value={profile.first_name || ''} onChange={onChange} 
              />
              <input 
                type="text" name="college" placeholder="College"
                value={profile.college || ''} onChange={onChange} className="full-width"
              />
            </div>
        ) : (
          <>
            <h1 className="mp-name-text">
              {profile.last_name?.toUpperCase() || 'LAST NAME'}, {profile.first_name?.toUpperCase() || 'FIRST NAME'} {profile.middle_initial || ''}.
            </h1>
            <p className="mp-college-text">{profile.college || 'College Not Set'}</p>
          </>
        )}

        <div className="mp-info-grid">
          <div className="mp-info-row">
            <span className="mp-label">Program:</span>
            {isEditing ? (
              <input type="text" name="program" value={profile.program || ''} onChange={onChange} />
            ) : (
              <span className="value">{profile.program}</span>
            )}
          </div>

          <div className="mp-info-row">
            <span className="mp-label">Section:</span>
            {isEditing ? (
              <input type="text" name="section" value={profile.section || ''} onChange={onChange} />
            ) : (
              <span className="value">{profile.section}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;