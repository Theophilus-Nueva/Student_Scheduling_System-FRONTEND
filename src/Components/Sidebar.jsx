import React, { useState, useMemo } from 'react';

import CustomCalendar from './Calendar/Calendar';
import UpcomingEventsList from './Upcoming-Events-List/UpcomingEventsList';
import Header from './Header/Header';
import Footer from './Header/Footer';
import OrganizationGrid from './Organization-Grid/OrganizationGrid';

export default function Sidebar() {
    return <>
        <Header />
        <div style={{display: "flex"}}>
            <CustomCalendar />
            <UpcomingEventsList />
        </div>
        <OrganizationGrid />
        <Footer />
    </>
}