import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import './calendar.css'; 

const CustomCalendar = ({ id }) => {
  const [value, setValue] = useState(new Date()); // Selected date
  const [activeStartDate, setActiveStartDate] = useState(new Date()); // Visible month
  const [events, setEvents] = useState([]); // State to store fetched events

  // 1. Fetch data from the API
  useEffect(() => {
    if (!id) return;

    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/organizations/${id}/events`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        setEvents(data); // Store the raw event objects
      } catch (error) {
        console.error("Error loading calendar events:", error);
      }
    };

    fetchEvents();
  }, [id]); // Re-run if ID changes

  const changeMonth = (direction) => {
    const newDate = new Date(activeStartDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setActiveStartDate(newDate);
  };

  const monthName = activeStartDate.toLocaleString('default', { month: 'long' }).toUpperCase();
  const yearShort = activeStartDate.getFullYear().toString().slice();

  // Helper to compare dates
  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // 2. Check if a calendar tile matches an event date
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      // Check if any event in the state matches the current tile's date
      const hasEvent = events.some(event => {
        // REPLACE 'event_date' with your actual database column name
        const eventDate = new Date(event.date); 
        return isSameDay(eventDate, date);
      });

      if (hasEvent) {
        return <div className="event-dot"></div>;
      }
    }
    return null;
  };

  return (
    <div className="calendar-container">
      <div className="custom-header">
        <div className="header-nav">
          <button onClick={() => changeMonth(-1)} className="nav-btn">
            &lt; 
          </button>
          
          <h2 className="month-year">{monthName} {yearShort}</h2>
          
          <button onClick={() => changeMonth(1)} className="nav-btn">
            &gt; 
          </button>
        </div>
      </div>

      <Calendar
        onChange={setValue} 
        value={value}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
        tileContent={tileContent}
        showNavigation={false} 
        locale="en-US"
        formatShortWeekday={(locale, date) =>
          ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'][date.getDay()]
        }
      />
    </div>
  );
};

export default CustomCalendar;