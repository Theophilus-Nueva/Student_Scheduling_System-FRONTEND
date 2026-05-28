import React, { useState, useEffect } from 'react';
import './UpcomingEventsList.css';

export default function UpcomingEventsList({ id }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/organizations/${id}/upcoming-events`);
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
  }, []);

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
            {/* 1. TITLE */}
            <h3 className="event-title">{event.title}</h3>
            
            <div className="event-details">

              {/* 2. EVENT NAME */}
              <div className="detail-row">
                <span className="label">Title :</span> 
                <span className="value">{event.title}</span>
              </div>

              {/* 3. DATE */}
              <div className="detail-row">
                <span className="label">Date :</span> 
                <span className="value">
                  {formatDate(event.date)}
                  {event.start_time ? ` | ${event.start_time}` : ''}
                </span>
              </div>

              {/* 4. VENUE */}
              <div className="detail-row">
                <span className="label">Venue :</span> 
                <span className="value">{event.venue}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
