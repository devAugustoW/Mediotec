import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
	const [user, setUser] = useState(null);

	useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);


	if (!user) return null; 

	return (
		<header className="header">
		<div className="header-logo">Mediotec</div>
		<div className="header-user">
			<p>Bem-vindo, {user.name || user.email}</p>
			<p>Email: {user.email}</p>
			<p>Tipo de Usuário: {user.userType}</p>
		</div>
	</header>
  );
};

export default Header;