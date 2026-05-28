import React from 'react';

const ScheduleTable = ({ schedule, isEditing, onChange, onAddRow }) => {
  return (
    <div className="mp-schedule-area">
      <h3>Class Schedule</h3>
      <div className="mp-table-wrapper">
        <table className="mp-schedule-table">
          <thead>
            <tr>
              <th style={{width: '10%'}}>DAY</th>
              <th style={{width: '25%'}}>TIME</th>
              <th style={{width: '20%'}}>SUBJECT CODE</th>
              <th style={{width: '15%'}}>SECTION</th>
              <th style={{width: '30%'}}>INSTRUCTOR</th>
            </tr>
          </thead>
          <tbody>
            {schedule && schedule.length > 0 ? schedule.map((row, idx) => (
              <tr key={idx}>
                <td>
                  {isEditing ? (
                    <input 
                      value={row.day || ''} 
                      onChange={(e) => onChange(idx, 'day', e.target.value)}
                      placeholder="Day"
                    />
                  ) : row.day}
                </td>
                <td>
                  {isEditing ? (
                      <div style={{ display: 'flex', gap: '5px' }}>
                          <input 
                            value={row.start_time || ''} 
                            onChange={(e) => onChange(idx, 'start_time', e.target.value)} 
                            placeholder="Start" 
                            style={{ width: '50%' }}
                          />
                          <input 
                            value={row.end_time || ''} 
                            onChange={(e) => onChange(idx, 'end_time', e.target.value)} 
                            placeholder="End" 
                            style={{ width: '50%' }}
                          />
                      </div>
                  ) : (
                      `${row.start_time || ''} - ${row.end_time || ''}`
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input 
                      value={row.subject_code || ''} 
                      onChange={(e) => onChange(idx, 'subject_code', e.target.value)} 
                    />
                  ) : row.subject_code}
                </td>
                <td>
                  {isEditing ? (
                    <input 
                      value={row.section || ''} 
                      onChange={(e) => onChange(idx, 'section', e.target.value)} 
                    />
                  ) : row.section}
                </td>
                <td>
                  {isEditing ? (
                    <input 
                      value={row.instructor || ''} 
                      onChange={(e) => onChange(idx, 'instructor', e.target.value)} 
                    />
                  ) : row.instructor}
                </td>
              </tr>
            )) : (
              !isEditing && (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>
                    No schedule data found.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {/* --- NEW: Add Row Button (Only visible in Edit Mode) --- */}
        {isEditing && (
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <button 
              onClick={onAddRow} 
              className="mp-add-row-btn"
            >
              + Add Schedule
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ScheduleTable;