import React from 'react';
import { useParams } from 'react-router-dom';
import DashNavigation from '../Dash-Navigation/DashNavigation'; // Adjust path if needed
import ArchivedEventsList from '../components/ArchivedEventsList'; // Adjust path if needed

const DashboardArchivedEvents = () => {
    const { id } = useParams(); // Grabs the organization ID from the URL

    return (
        <section>
            <DashNavigation />
            
            {/* You can reuse your existing dashboard container classes here */}
            <div className="dashboard-content" style={{ padding: '20px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {/* Render the Archive component we built earlier! */}
                    <ArchivedEventsList id={id} />
                </div>
            </div>
        </section>
    );
};

export default DashboardArchivedEvents;