import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login/Login';
import DashboardCoordenador from "../pages/Dashboard/Coordenador/DashboardCoordenador";
import DashboardProfessor from "../pages/Dashboard/Professor/DashboardProfessor";
import DashboardAluno from "../pages/Dashboard/Aluno/DashboardAluno";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
			
      <Route path="/dashboard/coordenador" element={<DashboardCoordenador />} />
      <Route path="/dashboard/professor" element={<DashboardProfessor />} />
      <Route path="/dashboard/aluno" element={<DashboardAluno />} />
    </Routes>
  );
}

export default AppRoutes;