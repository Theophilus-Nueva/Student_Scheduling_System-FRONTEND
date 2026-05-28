import React from 'react';
import './DashboardOverview.css';
import { useParams } from 'react-router-dom';

import Calendar from '../../Components/Calendar/Calendar';
import UpcommingEventsList from '../../Components/Upcoming-Events-List/UpcomingEventsList';
import DashNavigation from '../Dash-Navigation/DashNavigation'

export default function DashboardOverview() {
    const { id } = useParams();

    return (
        <section>
            <DashNavigation />
            <div style={{ display: 'flex'}}>
                <Calendar id={id} />
                <UpcommingEventsList id={id} />
            </div>
        </section>
    );
}
