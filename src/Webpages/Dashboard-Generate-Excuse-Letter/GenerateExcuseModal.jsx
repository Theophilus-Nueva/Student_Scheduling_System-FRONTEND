import React, { useState, useEffect } from 'react';
import './GenerateExcuseModal.css'; 

const GenerateExcuseModal = ({ isOpen, onClose, orgId, selectedMembers }) => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && orgId) {
      const fetchEvents = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/organizations/${orgId}/upcoming-events`);
          const data = await response.json();
          setEvents(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      };
      fetchEvents();
    }
  }, [isOpen, orgId]);

  // 2. Handle Generation & Download
  const onGenerateClick = async () => {
    if (!selectedEventId) {
      alert("Please select an event.");
      return;
    }

    if (selectedMembers.length === 0) {
      alert("No members selected.");
      return;
    }

    try {
        setLoading(true);

        // Prepare the payload
        const payload = {
          eventId: selectedEventId,
          memberIds: selectedMembers.map(m => m.id)
        };
    
        // Call the API
        const response = await fetch('http://localhost:3000/api/generate-excuse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Failed to generate PDF");

        // --- THE MAGIC PART: HANDLE FILE DOWNLOAD ---
        
        // A. Convert the response to a Blob (Binary Large Object)
        const blob = await response.blob();

        // B. Create a temporary URL pointing to this data
        const url = window.URL.createObjectURL(blob);

        // C. Create a hidden <a> tag and click it to trigger the browser's download
        const a = document.createElement('a');
        a.href = url;
        a.download = `Master_List_${new Date().toISOString().split('T')[0]}.pdf`; // Name of the file
        document.body.appendChild(a);
        a.click();
        
        // D. Cleanup
        a.remove();
        window.URL.revokeObjectURL(url);
        
        alert(`Master list generated for ${selectedMembers.length} members!`);
        onClose();

    } catch (error) {
        console.error("Generation Error:", error);
        alert("An error occurred while generating the PDF.");
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-pop-in">
        
        <div className="modal-header">
          <h2>Generate Master List</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <label className="input-label">Select Event</label>
          <select 
            className="modal-select"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="">-- Choose an Event --</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
          
          <div className="selected-count">
             Generating list for: <strong>{selectedMembers.length} Students</strong>
          </div>
        </div>

        <div className="modal-footer">
            <button 
                className="modal-gen-btn" 
                onClick={onGenerateClick}
                disabled={loading}
            >
              {loading ? "Generating..." : "Download PDF"}
            </button>
        </div>

      </div>
    </div>
  );
};

export default GenerateExcuseModal;