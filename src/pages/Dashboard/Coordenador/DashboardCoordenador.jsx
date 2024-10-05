import { useState } from 'react';
import './Dashboard.css';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/Sidebar/Sidebar';
import StudentList from '../../../components/StudentList/StudentList';

const DashboardCoordenador = () => {
	const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'alunos':
        return <StudentList />;
      default:
        return <h2>DashboardCoordenador</h2>;
    }
  };

 	return (
    <>
      <Header />
      <div className='divSideDash'>
        <Sidebar setActiveSection={setActiveSection} />
        <div className='dashboardCoordenadorContainer'>
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default DashboardCoordenador;