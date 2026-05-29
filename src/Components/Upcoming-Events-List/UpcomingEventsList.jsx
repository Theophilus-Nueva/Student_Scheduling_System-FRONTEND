import React, { useState, useEffect } from 'react';
import './UpcomingEventsList.css';

import { API_BASE_URL } from './../../../config';

export default function UpcomingEventsList({ id }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Get the user's role and token from their browser vault
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // MAGIC FIX: We must send the token to get past the backend Bouncer!
        const response = await fetch(`${API_BASE_URL}/api/organizations/${id}/upcoming-events`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch events');
        
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [id, token]);

  // 2. The Archive Function
  const handleArchive = async (eventId) => {
    const confirmed = window.confirm("Are you sure you want to archive this event?");
    if (!confirmed) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert("Event archived successfully!");
            // Instantly remove the event from the screen without refreshing the page!
            setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
        } else {
            const errorData = await response.json();
            alert(`Failed to archive: ${errorData.error}`);
        }
    } catch (err) {
        console.error("Error archiving event:", err);
        alert("An error occurred while archiving.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="upcoming-container">
      <h2 className="upcoming-header">UPCOMING</h2>
      
      <ul className="events-list">
        {events.map((event) => (
          <li key={event.id} className="event-item">
            <h3 className="event-title">{event.title}</h3>
            
            <div className="event-details">
              <div className="detail-row">
                <span className="label">Title :</span> 
                <span className="value">{event.title}</span>
              </div>

              <div className="detail-row">
                <span className="label">Date :</span> 
                <span className="value">
                  {formatDate(event.date)}
                  {event.start_time ? ` | ${event.start_time}` : ''}
                </span>
              </div>

              <div className="detail-row">
                <span className="label">Venue :</span> 
                <span className="value">{event.venue}</span>
              </div>
            </div>

            {/* 3. The Magic Button: Only Admins and Officers can see this! */}
            {userRole !== 'committee' && (
                <div style={{ marginTop: '15px', textAlign: 'right' }}>
                    <button 
                        onClick={() => handleArchive(event.id)} 
                        style={{
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Archive Event
                    </button>
                </div>
            )}
            
          </li>
        ))}
      </ul>
    </div>
  );
}