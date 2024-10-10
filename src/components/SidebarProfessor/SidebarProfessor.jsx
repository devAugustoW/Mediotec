import React from 'react';
import { useAuth } from '../../authContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import './SidebarProfessor.css';

const SidebarProfessor = ({ setActiveSection }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside className="sidebarp">
            <h2 className="sidebarp-title">Menu do Professor</h2>
            <ul className="sidebarp-menu">
                <li><a onClick={() => setActiveSection('dashboard')}>Home</a></li>
                <li><a onClick={() => setActiveSection('teacher-classes')}>Turmas</a></li>
                <li><a onClick={() => setActiveSection('teacher-discipline')}>Disciplinas</a></li>
                <li><a onClick={() => setActiveSection('teacher-grades')}>Conceitos</a></li>
                <li><a onClick={() => setActiveSection('teacher-announcements')}>Comunicados</a></li>
            </ul>
            <button onClick={handleLogout}>Logout</button>
        </aside>
    );
};

export default SidebarProfessor;