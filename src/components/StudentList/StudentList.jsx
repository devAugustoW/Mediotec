import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../authContext/AuthContext';
import FormRegister from '../FormRegister/FormRegister';
import './StudentList.css';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchStudents();
  }, [token]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const filteredStudents = response.data.filter(user => user.userType === 'aluno');
      setStudents(filteredStudents);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      setError('Não foi possível carregar a lista de alunos.');
    }
  };

  const handleRegisterSubmit = async (userData) => {
    // Adicionando o console.log com as informações solicitadas
    console.log('Dados do cadastro:', {
      nome: userData.name,
      email: userData.email,
      senha: userData.password,
      userType: userData.userType,
      token: token
    });

    try {
      const response = await axios.post(
        'http://localhost:3000/createUserByCoordinator', 
        {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          userType: userData.userType
        },
        { 
          headers: { Authorization: `Bearer ${token}` } 
        }
      );

      if (response.status === 201) {
        console.log('Aluno cadastrado com sucesso:', response.data);
        setShowForm(false);
        fetchStudents(); // Atualiza a lista após cadastro
      }
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error);
      if (error.response) {
        setError(error.response.data.error || 'Não foi possível cadastrar o aluno.');
      } else {
        setError('Erro de conexão. Tente novamente mais tarde.');
      }
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="student-list-container">
      <h2>Gerenciamento de Alunos</h2>
      <button onClick={() => setShowForm(!showForm)} className="toggle-button">
        {showForm ? 'Voltar para Lista' : 'Cadastrar Novo Aluno'}
      </button>

      {showForm ? (
        <FormRegister 
          onSubmit={handleRegisterSubmit}
          userType="aluno"
        />
      ) : (
        <>
          {students.length === 0 ? (
            <p>Nenhum aluno encontrado.</p>
          ) : (
            <table className="student-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default StudentList;