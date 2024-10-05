import './Sidebar.css';
import { useAuth } from '../../authContext/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ setActiveSection }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Menu</h2>
      <ul className="sidebar-menu">
        <li><a onClick={() => setActiveSection('dashboard')}>Home</a></li>
        <li><a onClick={() => setActiveSection('alunos')}>Alunos</a></li>
        <li><a onClick={() => setActiveSection('docentes')}>Docentes</a></li>
        <li><a onClick={() => setActiveSection('turmas')}>Turmas</a></li>
        <li><a onClick={() => setActiveSection('disciplinas')}>Disciplinas</a></li>
        <li><a onClick={() => setActiveSection('conceitos')}>Conceitos</a></li>
        <li><a onClick={() => setActiveSection('avisos')}>Avisos</a></li> 
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </aside>
  );
};

export default Sidebar;