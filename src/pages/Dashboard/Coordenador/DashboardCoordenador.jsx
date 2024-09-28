import './Dashboard.css';
import { useState } from 'react';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/Sidebar/Sidebar';
//import FormRegister from '../../../components/FormRegister/FormRegister';

const DashboardCoordenador = () => {
	const [activeSection, setActiveSection] = useState('dashboard');

	const renderSection = () => {
    switch (activeSection) {
      case 'usuarios':
        return <FormRegister />; // Renderiza o formulário de registro
      case 'turmas':
        return <div>Turmas</div>; // Renderiza um placeholder para "Turmas"
      case 'disciplinas':
        return <div>Disciplinas</div>; // Renderiza um placeholder para "Disciplinas"
      default:
        return <div>Dashboard Coordenador</div>; // Conteúdo padrão do dashboard
    }
  };

	return (
		<>
			<Header />
			<div className='divSideDash'>
				 <Sidebar setActiveSection={setActiveSection} />
				<div className='dashboardCoordenadorContainer'>
					<h2>DashboardCoordenador</h2>
					{renderSection()} {/* Renderiza a seção ativa */}
				</div>
			</div>
		</>
		
	)
}

export default DashboardCoordenador