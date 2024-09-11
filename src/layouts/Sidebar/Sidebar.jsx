import './Sidebar.css';


const Sidebar = () => {


  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Menu</h2>
      <ul className="sidebar-menu">
        <li className="sidebar-menu-item">Dashboard</li>
        <li className="sidebar-menu-item">Profile</li>
        <li className="sidebar-menu-item">Settings</li>
        <li className="sidebar-menu-item">Logout</li>
      </ul>
    </div>
  );
};

export default Sidebar;