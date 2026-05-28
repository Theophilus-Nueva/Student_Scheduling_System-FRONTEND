import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './DashboardCreateEvent.css';

import DashNavigation from '../Dash-Navigation/DashNavigation';



const DashboardCreateEvent = () => {
    const { id } = useParams();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/organizations/${id}/recent-events`);
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

    // State to handle form inputs
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        venue: '',
        duration: '',
        description: '',
        organizationId: parseInt(id)
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Helper: Converts "08:00 PM" -> "20:00"
        const convertTo24Hour = (timeStr) => {
            if (!timeStr) return '';
            
            const date = new Date(`1/1/2000 ${timeStr}`);
            
            if (isNaN(date.getTime())) return timeStr; 
    
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            
            return `${hours}:${minutes}`;
        };
    
        let startTimeRaw = '';
        let endTimeRaw = '';
    
        if (formData.duration.includes('-')) {
            const parts = formData.duration.split('-');
            startTimeRaw = parts[0].trim(); 
            endTimeRaw = parts[1] ? parts[1].trim() : ''; 
        } else {
            startTimeRaw = formData.duration.trim();
        }
    
        const payload = {
            title: formData.title,
            date: formData.date,
            venue: formData.venue,
            startTime: convertTo24Hour(startTimeRaw), 
            endTime: convertTo24Hour(endTimeRaw),    
            description: formData.description,
            organizationId: id
        };
    
        try {
            const response = await fetch('http://localhost:3000/api/events', {
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
                    duration: '',
                    description: '',
                });
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Submission failed:', error);
            alert('Failed to connect to server.');
        }
    };

    // Handle typing in form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Mock Data for "Recent Events" section
    const recentEvents = events;

    return (
        <section>
            <DashNavigation />

            <div className="create-event-page">
                {/* Main Content Grid */}
                <div className="create-content-grid">
                    {/* LEFT COLUMN: Event Details Form */}
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
                            <div className="form-group">
                                <label>Duration</label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    placeholder="e.g. 8:00 AM - 5:00 PM"
                                />
                            </div>
                            <div className="action-footer">
                                <button type='submit' className="finalize-btn">Save</button>
                            </div>
                        </form>
                    </div>
                    {/* RIGHT COLUMN: Confirmation & Recent Events */}
                    <div className="right-column">
                        {/* Section A: Confirmation Preview */}
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
                                    <span>{formData.duration}</span>
                                </div>
                            </div>
                        </div>

                        {/* Section B: Recent Events List */}
                        <div className="recent-section">
                            <h2 className="sub-header">Recent Events:</h2>

                            <div className="recent-grid">
                                {recentEvents.map((event) => (
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
                                            {event.time}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Finalize Button */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DashboardCreateEvent;
