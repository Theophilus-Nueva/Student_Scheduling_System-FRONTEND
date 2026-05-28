import { NavLink } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';

export default function DashNavigation() {
    const navigate = useNavigate();
    const { id } = useParams();
    return (
        <div className="org-navbar">
            {/* LEFT: Navigation Links */}
            <nav className="nav-links">
                <NavLink
                    to={`/org/${id}`}
                    end
                    className={({ isActive }) =>
                        isActive ? 'nav-tab active' : 'nav-tab'
                    }>
                    Calendar
                </NavLink>

                <NavLink
                    to={`/org/${id}/create-event`}
                    className={({ isActive }) =>
                        isActive ? 'nav-tab active' : 'nav-tab'
                    }>
                    Create Event
                </NavLink>

                <NavLink
                    to={`/org/${id}/excuse-letter`}
                    className={({ isActive }) =>
                        isActive ? 'nav-tab active' : 'nav-tab'
                    }>
                    Generate Excuse Letter
                </NavLink>
            </nav>

            <div className="nav-actions">
                <button onClick={() => navigate('/')} className="switch-btn">
                    <span className="icon">←</span> Go to home
                </button>
            </div>
        </div>
    );
}
//⇄