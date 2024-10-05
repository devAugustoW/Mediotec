import { useState } from 'react';
import './Dashboard.css'; // Certifique-se de que o caminho está correto
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
        return <h2>Dashboard Coordenador</h2>;
    }
  };

  return (
    <>
      <Header />
      <div className='dashboardWrapper'> {/* Contêiner principal */}
        <Sidebar className='dashboardSidebar' setActiveSection={setActiveSection} />
        <div className='dashboardContent'> {/* Área de conteúdo */}
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default DashboardCoordenador;