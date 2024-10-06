import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../authContext/AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importando os ícones
import './ClassList.css';

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', year: '', semester: '' });
  const [editingClassId, setEditingClassId] = useState(null); // Novo estado para armazenar o ID da turma em edição
  const { token } = useAuth();

  useEffect(() => {
    fetchClasses();
  }, [token]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/getAllClasses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClasses(response.data);
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
      setError('Não foi possível carregar a lista de turmas.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/createClass',
        newClass,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 201) {
        console.log('Turma cadastrada com sucesso:', response.data);
        setShowForm(false);
        setNewClass({ name: '', year: '', semester: '' });
        fetchClasses();
      }
    } catch (error) {
      console.error('Erro ao cadastrar turma:', error);
      if (error.response) {
        setError(error.response.data.error || 'Não foi possível cadastrar a turma.');
      } else {
        setError('Erro de conexão. Tente novamente mais tarde.');
      }
    }
  };

  const handleUpdateClass = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/editClass/${editingClassId}`, // Ajuste a URL para a rota correta
        newClass,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        console.log('Turma atualizada com sucesso:', response.data);
        setShowForm(false);
        setNewClass({ name: '', year: '', semester: '' });
        setEditingClassId(null);
        fetchClasses();
      }
    } catch (error) {
      console.error('Erro ao atualizar turma:', error);
      if (error.response) {
        setError(error.response.data.error || 'Não foi possível atualizar a turma.');
      } else {
        setError('Erro de conexão. Tente novamente mais tarde.');
      }
    }
  };

  const editClass = (classId) => {
    const classToEdit = classes.find((classItem) => classItem._id === classId);
    if (classToEdit) {
      setNewClass({
        name: classToEdit.name,
        year: classToEdit.year,
        semester: classToEdit.semester,
      });
      setEditingClassId(classId); // Armazena o ID da turma em edição
      setShowForm(true);
    } else {
      setError('Turma não encontrada.');
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/deleteClass/${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        console.log('Turma deletada com sucesso:', response.data.message);
        fetchClasses(); // Atualiza a lista de turmas após a exclusão
      }
    } catch (error) {
      console.error('Erro ao deletar turma:', error);
      if (error.response) {
        setError(error.response.data.error || 'Não foi possível deletar a turma.');
      } else {
        setError('Erro de conexão. Tente novamente mais tarde.');
      }
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="class-list-container">
      <h2>Gerenciamento de Turmas</h2>
      <div className="button-container">
        <button onClick={() => {
          setShowForm(!showForm);
          setEditingClassId(null); // Limpa o ID da turma em edição ao criar novo
        }} className="toggle-button">
          {showForm ? 'Voltar para Lista' : 'Cadastrar Nova Turma'}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={editingClassId ? handleUpdateClass : handleRegisterSubmit} className="class-form">
          <input
            type="text"
            placeholder="Nome da Turma"
            value={newClass.name}
            onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Ano"
            value={newClass.year}
            onChange={(e) => setNewClass({ ...newClass, year: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Semestre"
            value={newClass.semester}
            onChange={(e) => setNewClass({ ...newClass, semester: e.target.value })}
            required
          />
          <button type="submit">{editingClassId ? 'Atualizar' : 'Cadastrar'}</button>
        </form>
      ) : (
        <>
          {classes.length === 0 ? (
            <p>Nenhuma turma encontrada.</p>
          ) : (
            <table className="class-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Ano</th>
                  <th>Semestre</th>
                  <th className='actions-column'>Ações</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classItem) => (
                  <tr key={classItem._id}>
                    <td>{classItem.name}</td>
                    <td>{classItem.year}</td>
                    <td>{classItem.semester}</td>
                    <td className='action-column'>
                      <FaEdit
                        onClick={() => editClass(classItem._id)}
                        className="action-button action-button--edit"
                        title="Editar"
                      />
                      <FaTrash
                        onClick={() => handleDeleteClass(classItem._id)}
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

export default ClassList;