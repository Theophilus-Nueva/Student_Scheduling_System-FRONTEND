import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './DashboardCreateEvent.css';

import DashNavigation from '../Dash-Navigation/DashNavigation';

import { API_BASE_URL } from './../../../config';

const DashboardCreateEvent = () => {
    const { id } = useParams();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/organizations/${id}/recent-events`);
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
    }, [id]);

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        venue: '',
        startTime: '',
        endTime: '',
        description: '',
        organizationId: parseInt(id)
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const payload = {
            title: formData.title,
            date: formData.date,
            venue: formData.venue,
            startTime: formData.startTime || null, 
            endTime: formData.endTime || null,    
            description: formData.description,
            organizationId: id
        };
    
        try {
            const response = await fetch(`${API_BASE_URL}/api/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert('Event added successfully!');
                setFormData({
                    title: '',
                    date: '',
                    venue: '',
                    startTime: '',
                    endTime: '',
                    description: '',
                });
                
                const fetchEvents = async () => {
                    const res = await fetch(`${API_BASE_URL}/api/organizations/${id}/recent-events`);
                    const eventData = await res.json();
                    setEvents(eventData);
                };
                fetchEvents();
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Submission failed:', error);
            alert('Failed to connect to server.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <section>
            <DashNavigation />

            <div className="create-event-page">
                <div className="create-content-grid">
                    <div className="left-column">
                        <h2 className="section-header">Event Details</h2>

                        <form className="event-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title/Name</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter event title"
                                />
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Venue</label>
                                <input
                                    type="text"
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleChange}
                                    placeholder="Enter venue location"
                                />
                            </div>
                            <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label>Start Time</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>End Time</label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="action-footer">
                                <button type='submit' className="finalize-btn">Save</button>
                            </div>
                        </form>
                    </div>
                    <div className="right-column">
                        <div className="confirmation-section">
                            <h2 className="section-header">
                                Event Confirmation
                            </h2>

                            <div className="preview-box">
                                <h3 className="preview-title">
                                    {formData.title || ''}
                                </h3>
                                <div className="preview-row">
                                    <span className="p-label"></span>
                                    <span>{formData.date}</span>
                                </div>
                                <div className="preview-row">
                                    <span className="p-label"></span>
                                    <span>{formData.venue}</span>
                                </div>
                                <div className="preview-row">
                                    <span className="p-label"></span>
                                    <span>
                                        {formData.startTime && formData.endTime 
                                            ? `${formData.startTime} - ${formData.endTime}` 
                                            : formData.startTime || formData.endTime}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="recent-section">
                            <h2 className="sub-header">Recent Events:</h2>

                            <div className="recent-grid">
                                {events.map((event) => (
                                    <div key={event.id} className="recent-card">
                                        <h4 className="recent-title">
                                            {event.title}
                                        </h4>
                                        <p className="recent-info">
                                            {event.date}
                                        </p>
                                        <p className="recent-info">
                                            {event.venue}
                                        </p>
                                        <p className="recent-info">
                                            {event.start_time && event.end_time 
                                                ? `${event.start_time} - ${event.end_time}` 
                                                : ''}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DashboardCreateEvent;