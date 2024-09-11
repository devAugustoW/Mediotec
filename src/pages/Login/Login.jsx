import './Login.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (dashboard) => {
    // Aqui você pode adicionar a lógica para autenticação
    // Por enquanto, apenas navegue para o dashboard selecionado
    navigate(`/dashboard/${dashboard}`);
  };

  return (
    <div className="login-container">
      <h1>Mediotec</h1>
      <form className="login-form">
        <label htmlFor="email">Username</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label> 
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
				<div class="login-button-group">
					<Link to="/forgot-password" className="forgot-password-link">
						Esqueci a senha
					</Link>
					<button className=' ' type="submit">Login</button>
				</div>

        <button type="button" onClick={() => handleLogin('coordenador')}>
          Acessar Dashboard Coordenador
        </button>
        <button type="button" onClick={() => handleLogin('professor')}>
          Acessar Dashboard Professor
        </button>
        <button type="button" onClick={() => handleLogin('aluno')}>
          Acessar Dashboard Aluno
        </button>
      </form>
    </div>
  );
}

export default Login;