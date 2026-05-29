import React, { useState, useEffect } from 'react';
import './UpcomingEventsList.css';

import { API_BASE_URL } from './../../../config';

export default function ArchivedEventsList({ id }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArchivedEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/organizations/${id}/archived-events`);
        
        if (!response.ok) throw new Error('Failed to fetch archived events');
        
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArchivedEvents();
  }, [id]);

  const handleRestore = async (eventId) => {
    const confirmed = window.confirm("Are you sure you want to restore this event to the active schedule?");
    if (!confirmed) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/restore`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Instantly remove it from the archive list on the screen
            setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
            alert("Event restored successfully!");
        } else {
            const errorData = await response.json();
            alert(`Failed to restore: ${errorData.error}`);
        }
    } catch (err) {
        console.error("Error restoring event:", err);
        alert("An error occurred while restoring.");
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
      <h2 className="upcoming-header" style={{ color: '#777' }}>ARCHIVED EVENTS</h2>
      
      {events.length === 0 ? (
        <p style={{ paddingLeft: '10px', color: '#555' }}>No archived events found.</p>
      ) : (
        <ul className="events-list">
          {events.map((event) => (
            <li key={event.id} className="event-item">
              <h3 className="event-title" style={{ color: '#777' }}>{event.title}</h3>
              
              <div className="event-details" style={{ color: '#555' }}>
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

              <div className="event-actions">
                  <button 
                      className="archive-btn" 
                      style={{ borderColor: '#28a745', color: '#28a745' }}
                      onMouseOver={(e) => { e.target.style.backgroundColor = '#28a745'; e.target.style.color = 'white'; }}
                      onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#28a745'; }}
                      onClick={() => handleRestore(event.id)}
                  >
                      Restore Event
                  </button>
              </div>
              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}