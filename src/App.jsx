import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import DashboardCoordenador from './pages/Dashboard/Coordenador/DashboardCoordenador'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path="/dashboardCoordenador" element={<DashboardCoordenador />} />
    </Routes>
  );
}

export default App;