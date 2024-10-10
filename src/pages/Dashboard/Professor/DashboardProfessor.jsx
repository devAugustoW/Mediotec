import React, { useState, useEffect } from 'react';
import './DashboardProfessor.css';
import Header from '../../../components/Header/Header';
import SidebarProfessor from '../../../components/SidebarProfessor/SidebarProfessor';
import TeacherClasses from '../../../components/TeacherClasses/TeacherClasses';
//import TeacherDiscipline from '../../../components/TeacherDiscipline/TeacherDiscipline';
//import TeacherGrades from '../../../components/TeacherGrades/TeacherGrades';
//import TeacherAnnouncements from '../../../components/TeacherAnnouncements/TeacherAnnouncements';

const DashboardProfessor = () => {
    const [activeSection, setActiveSection] = useState('dashboard');

    useEffect(() => {
        console.log('Seção ativa:', activeSection);
    }, [activeSection]);

    const renderContent = () => {
        switch (activeSection) {
            case 'teacher-classes':
                return <TeacherClasses />;
            case 'teacher-discipline':
                return <TeacherDiscipline />; 
            case 'teacher-grades':
                return <TeacherGrades />; 
            case 'teacher-announcements':
                return <TeacherAnnouncements />; 
            default:
                return <h2>Dashboard Professor</h2>;
        }
    };

    return (
        <div className='dashboardProfessor'>
            <Header />
            <div className='dashboardWrapper'>
                <SidebarProfessor setActiveSection={setActiveSection} />
                <div className='dashboardContent'>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default DashboardProfessor;