import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../authContext/AuthContext';
import FormRegister from '../FormRegister/FormRegister';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './StudentList.css';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null); // Novo estado para o aluno em edição
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
        fetchStudents();
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

  const handleUpdateSubmit = async (userData) => {
    console.log('Dados da atualização:', {
      nome: userData.name,
      email: userData.email,
      senha: userData.password,
      userType: userData.userType,
      token: token
    });

    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userData._id}`, 
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

      if (response.status === 200) {
        console.log('Aluno atualizado com sucesso:', response.data);
        setShowForm(false);
        setEditingStudent(null); // Limpa o aluno em edição
        fetchStudents();
      }
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error);
      if (error.response) {
        setError(error.response.data.error || 'Não foi possível atualizar o aluno.');
      } else {
        setError('Erro de conexão. Tente novamente mais tarde.');
      }
    }
  };

  const handleEditStudent = (studentId) => {
    const studentToEdit = students.find(student => student._id === studentId);
    setEditingStudent(studentToEdit);
    setShowForm(true);
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/users/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        console.log('Usuário deletado com sucesso:', response.data.message);
        fetchStudents(); // Atualiza a lista de alunos após a exclusão
      }
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
      if (error.response) {
        if (error.response.status === 403) {
          setError('Acesso negado. Apenas coordenadores podem deletar usuários.');
        } else if (error.response.status === 404) {
          setError('Usuário não encontrado.');
        } else {
          setError(error.response.data.error || 'Não foi possível deletar o aluno.');
        }
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
      <div className="button-container"> {/* Contêiner para o botão */}
        <button onClick={() => {
          setShowForm(!showForm);
          setEditingStudent(null); // Limpa o aluno em edição ao criar novo
        }} className="toggle-button">
          {showForm ? 'Voltar para Lista' : 'Cadastrar Novo Aluno'}
        </button>
      </div>

      {showForm ? (
        <FormRegister 
          onSubmit={editingStudent ? handleUpdateSubmit : handleRegisterSubmit}
          userType="aluno"
          initialData={editingStudent}
        />
      ) : (
        <>
          <button onClick={() => {
            setShowForm(true);
            setEditingStudent(null); // Limpa o aluno em edição ao criar novo
          }} className="toggle-button">
            Cadastrar Aluno
          </button>
          {students.length === 0 ? (
            <p>Nenhum aluno encontrado.</p>
          ) : (
            <table className="student-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th className='actions-column'>Ações</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td className='action-column'> 
                      <FaEdit 
                        onClick={() => handleEditStudent(student._id)} 
                        className="action-button action-button--edit" 
                        title="Editar"
                      />
                      <FaTrash 
                        onClick={() => handleDeleteStudent(student._id)} 
                        className="action-button action-button--delete" 
                        title="Deletar"
                      />
                    </td>
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