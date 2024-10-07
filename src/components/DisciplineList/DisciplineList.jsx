import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../authContext/AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importando os ícones
import './DisciplineList.css';

const DisciplineList = () => {
  const [disciplines, setDisciplines] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newDiscipline, setNewDiscipline] = useState({ name: '', description: '' });
  const [editingDisciplineId, setEditingDisciplineId] = useState(null); // Novo estado para armazenar o ID da disciplina em edição
  const { token } = useAuth();

  useEffect(() => {
    fetchDisciplines();
  }, [token]);

  const fetchDisciplines = async () => {
    try {
      const response = await axios.get('http://localhost:3000/getAllDisciplines', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDisciplines(response.data);
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error);
      setError('Não foi possível carregar a lista de disciplinas.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/createDiscipline',
        newDiscipline,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 201) {
        console.log('Disciplina cadastrada com sucesso:', response.data);
        setShowForm(false);
        setNewDiscipline({ name: '', description: '' });
        fetchDisciplines();
      }
    } catch (error) {
      console.error('Erro ao cadastrar disciplina:', error);
      if (error.response) {
        setError(error.response.data.error || 'Não foi possível cadastrar a disciplina.');
      } else {
        setError('Erro de conexão. Tente novamente mais tarde.');
      }
    }
  };

  const handleUpdateDiscipline = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/editDiscipline/${editingDisciplineId}`, // Ajuste a URL para a rota correta
        newDiscipline,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        console.log('Disciplina atualizada com sucesso:', response.data);
        setShowForm(false);
        setNewDiscipline({ name: '', description: '' });
        setEditingDisciplineId(null);
        fetchDisciplines();
      }
    } catch (error) {
      console.error('Erro ao atualizar disciplina:', error);
      if (error.response) {
        setError(error.response.data.error || 'Não foi possível atualizar a disciplina.');
      } else {
        setError('Erro de conexão. Tente novamente mais tarde.');
      }
    }
  };

  const editDiscipline = (disciplineId) => {
    const disciplineToEdit = disciplines.find((discipline) => discipline._id === disciplineId);
    if (disciplineToEdit) {
      setNewDiscipline({
        name: disciplineToEdit.name,
        description: disciplineToEdit.description,
      });
      setEditingDisciplineId(disciplineId); // Armazena o ID da disciplina em edição
      setShowForm(true);
    } else {
      setError('Disciplina não encontrada.');
    }
  };

  const handleDeleteDiscipline = async (disciplineId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/deleteDiscipline/${disciplineId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        console.log('Disciplina deletada com sucesso:', response.data.message);
        fetchDisciplines(); // Atualiza a lista de disciplinas após a exclusão
      }
    } catch (error) {
      console.error('Erro ao deletar disciplina:', error);
      if (error.response) {
        setError(error.response.data.error || 'Não foi possível deletar a disciplina.');
      } else {
        setError('Erro de conexão. Tente novamente mais tarde.');
      }
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="discipline-list-container">
      <h2>Gerenciamento de Disciplinas</h2>
      <div className="button-container">
        <button onClick={() => {
          setShowForm(!showForm);
          setEditingDisciplineId(null); // Limpa o ID da disciplina em edição ao criar novo
        }} className="toggle-button">
          {showForm ? 'Voltar para Lista' : 'Cadastrar Nova Disciplina'}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={editingDisciplineId ? handleUpdateDiscipline : handleRegisterSubmit} className="discipline-form">
          <input
            type="text"
            placeholder="Nome da Disciplina"
            value={newDiscipline.name}
            onChange={(e) => setNewDiscipline({ ...newDiscipline, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Descrição"
            value={newDiscipline.description}
            onChange={(e) => setNewDiscipline({ ...newDiscipline, description: e.target.value })}
            required
          />
          <button type="submit">{editingDisciplineId ? 'Atualizar' : 'Cadastrar'}</button>
        </form>
      ) : (
        <>
          {disciplines.length === 0 ? (
            <p>Nenhuma disciplina encontrada.</p>
          ) : (
            <table className="discipline-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th className='actions-column'>Ações</th>
                </tr>
              </thead>
              <tbody>
                {disciplines.map((discipline) => (
                  <tr key={discipline._id}>
                    <td>{discipline.name}</td>
                    <td>{discipline.description}</td>
                    <td className='action-column'>
                      <FaEdit
                        onClick={() => editDiscipline(discipline._id)}
                        className="action-button action-button--edit"
                        title="Editar"
                      />
                      <FaTrash
                        onClick={() => handleDeleteDiscipline(discipline._id)}
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

export default DisciplineList;