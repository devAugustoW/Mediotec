import './Login.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const routes = {
  aluno: '/dashboardAluno',
  professor: '/dashboardProfessor',
  coordenador: '/dashboardCoordenador',
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
	const navigate = useNavigate();
//  const [userType, setUsertype] = useState('');
  

  const handleLogin = async (event) => {
    event.preventDefault(); 
		try {
			const response = await axios.post('http://localhost:3000/login', { email, password });
			const { token, user } = response.data;
			const { user_id, userType } = user;

      localStorage.setItem('user', JSON.stringify({ token, user_id, userType }));
			
			console.log('Login bem-sucedido:', response.data);

			const route = routes[userType];
			if (route) navigate(route);
			else console.error("Tipo de usuário desconhecido:", userType);

			
		} catch (error) {
			console.error('Erro no login:', error);
      alert('Falha no login. Verifique suas credenciais.');
		}
  };

  return (
    <div className="login-container">
      <h1 className='login-title'>Mediotec - Login</h1>
      <form className="login-form" onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Senha</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="login-button-group">
				<Link to="/register">Fazer cadastro</Link>
          <button type="submit">Login </button>
        </div>
      </form>
    </div>
  );
}

export default Login;