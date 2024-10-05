import './Login.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../authContext/AuthContext';

const routes = {
  aluno: '/dashboardAluno',
  professor: '/dashboardProfessor',
  coordenador: '/dashboardCoordenador',
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleLogin = async (event) => {
    event.preventDefault(); 

    try {
      const response = await axios.post('http://localhost:3000/login', { email, password });

      const { token, user } = response.data;
      login(token, user);

      const storedToken = localStorage.getItem('token');
      console.log('User:', user);
      console.log('Token no localStorage:', storedToken);

      const route = routes[user.userType];
      if (route) navigate(route);
      else console.error("Tipo de usuário desconhecido:", user.userType);
      
    } catch (error) {
      console.error('Erro no login:', error);
      setErrorMessage(error.response?.data?.message || 'Erro no login. Tente novamente.');
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

        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Exibe a mensagem de erro */}

        <div className="login-button-group">
          <Link to="/register">Fazer cadastro</Link>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default Login;