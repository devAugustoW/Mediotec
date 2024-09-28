import './Sidebar.css';

const Sidebar = ({ setActiveSection }) => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Menu</h2>
      <ul className="sidebar-menu">
        <li><a onClick={() => setActiveSection('usuarios')}>Usuários</a></li>
        <li><a onClick={() => setActiveSection('turmas')}>Turmas</a></li>
        <li><a onClick={() => setActiveSection('disciplinas')}>Disciplinas</a></li>
      </ul>
      <button>Logout</button>
    </div>
  );
};

export default Sidebar;