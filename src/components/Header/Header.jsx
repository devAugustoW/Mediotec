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

	const handleLogout = () => {
    localStorage.removeItem('user');
		setUser(null); // Limpa o estado do usuário após o logout
    navigate('/'); // Redireciona para a página de login após o logout
  };

	// Ou um placeholder enquanto carrega
	if (!user) return null; 


	return (
		<header className="header">
		<div className="header-logo">Mediotec</div>
		<div className="header-user">
			<p>Bem-vindo, {user.name || user.email}</p>
			<p>Email: {user.email}</p>
			<p>Tipo de Usuário: {user.userType}</p>
			<button onClick={handleLogout}>Logout</button>
		</div>
	</header>
  );
};

export default Header;