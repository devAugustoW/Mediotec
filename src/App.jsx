import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import DashboardCoordenador from './pages/Dashboard/Coordenador/DashboardCoordenador';
import DashboardProfessor from './pages/Dashboard/Professor/DashboardProfessor';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path='/register' element={<Register />} />
			<Route path="/dashboardCoordenador" element={<DashboardCoordenador />} />
			<Route path="/dashboardProfessor" element={<DashboardProfessor />} />
		</Routes>
	);
}

export default App;