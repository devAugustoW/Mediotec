import './Header.css';

const Header = () => {
	return (
		<header className="header">
			<div className="header-logo">Minha Aplicação</div>
			<nav className="header-nav">
				<ul>
					<li><a href="/">Home</a></li>
					<li><a href="/dashboard">Dashboard</a></li>
					<li><a href="/about">Sobre</a></li>
				</ul>
			</nav>
		</header>
	);
}

export default Header;