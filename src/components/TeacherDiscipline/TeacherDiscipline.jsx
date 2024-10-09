import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../authContext/AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './TeacherDiscipline.css';

const TeacherDiscipline = () => {
  const [associations, setAssociations] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newAssociation, setNewAssociation] = useState({ teacher: '', discipline: '' });
  const [editingAssociation, setEditingAssociation] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchAssociations();
    fetchTeachers();
    fetchDisciplines();
  }, [token]);

  const fetchAssociations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/getAllTeacherDisciplines', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssociations(response.data);
    } catch (error) {
      console.error('Erro ao buscar associações:', error);
      setError('Não foi possível carregar a lista de associações.');
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const filteredTeachers = response.data.filter(user => user.userType === 'professor');
      setTeachers(filteredTeachers);
    } catch (error) {
      console.error('Erro ao buscar professores:', error);
      setError('Não foi possível carregar a lista de professores.');
    }
  };

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
        'http://localhost:3000/teacherToDiscipline',
        newAssociation,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 201) {
        console.log('Associação criada com sucesso:', response.data);
        setShowForm(false);
        setNewAssociation({ teacher: '', discipline: '' });
        fetchAssociations();
      }
    } catch (error) {
      console.error('Erro ao criar associação:', error);
      if (error.response) {
        setError(error.response.data.error || 'Não foi possível criar a associação.');
      } else {
        setError('Erro de conexão. Tente novamente mais tarde.');
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/editTeacherDiscipline/${editingAssociation._id}`,
        newAssociation,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        console.log('Associação atualizada com sucesso:', response.data);
        setEditingAssociation(null);
        setNewAssociation({ teacher: '', discipline: '' });
        fetchAssociations();
      }
    } catch (error) {
      console.error('Erro ao atualizar associação:', error);
      if (error.response) {
        setError(error.response.data.error || 'Não foi possível atualizar a associação.');
      } else {
        setError('Erro de conexão. Tente novamente mais tarde.');
      }
    }
  };

  const handleDeleteAssociation = async (associationId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/deleteTeacherDiscipline/${associationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        console.log('Associação deletada com sucesso:', response.data.message);
        fetchAssociations();
      }
    } catch (error) {
      console.error('Erro ao deletar associação:', error);
      if (error.response) {
        setError(error.response.data.error || 'Não foi possível deletar a associação.');
      } else {
        setError('Erro de conexão. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className="teacher-discipline-container">
      <h2>Gerenciamento de Professores e Disciplinas</h2>
      <div className="button-container">
        <button onClick={() => { setShowForm(!showForm); setEditingAssociation(null); }} className="toggle-button">
          {showForm ? 'Voltar para Lista' : 'Associar'}
        </button>
      </div>

      {showForm && !editingAssociation && (
        <form onSubmit={handleRegisterSubmit} className="association-form">
          <h3>Associar Professor - Disciplina</h3> {/* Título para criação */}
          <select
            value={newAssociation.teacher}
            onChange={(e) => setNewAssociation({ ...newAssociation, teacher: e.target.value })}
            required
          >
            <option value="">Selecione um Professor</option>
            {teachers.map(teacher => (
              <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
            ))}
          </select>
          <select
            value={newAssociation.discipline}
            onChange={(e) => setNewAssociation({ ...newAssociation, discipline: e.target.value })}
            required
          >
            <option value="">Selecione uma Disciplina</option>
            {disciplines.map(discipline => (
              <option key={discipline._id} value={discipline._id}>{discipline.name}</option>
            ))}
          </select>
          <button type="submit">Associar</button>
          <button type="button" onClick={() => setShowForm(false)}>Fechar</button> {/* Botão para fechar o formulário */}
        </form>
      )}

      {editingAssociation && (
        <div className="edit-card">
          <h3>Editando Associação</h3>
          <p>Professor: {editingAssociation.teacher.name}</p>
          <p>Disciplina: {editingAssociation.discipline.name}</p>
          <form onSubmit={handleEditSubmit} className="association-form">
            <select
              value={newAssociation.teacher}
              onChange={(e) => setNewAssociation({ ...newAssociation, teacher: e.target.value })}
              required
            >
              <option value="">Selecione um Professor</option>
              {teachers.map(teacher => (
                <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
              ))}
            </select>
            <select
              value={newAssociation.discipline}
              onChange={(e) => setNewAssociation({ ...newAssociation, discipline: e.target.value })}
              required
            >
              <option value="">Selecione uma Disciplina</option>
              {disciplines.map(discipline => (
                <option key={discipline._id} value={discipline._id}>{discipline.name}</option>
              ))}
            </select>
            <button type="submit">Atualizar</button>
            <button type="button" onClick={() => setEditingAssociation(null)}>Fechar</button> {/* Botão para fechar o formulário de edição */}
          </form>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {associations.length === 0 ? (
        <p>Nenhuma associação encontrada.</p>
      ) : (
        <table className="association-table">
          <thead>
            <tr>
              <th>Professor</th>
              <th>Disciplina</th>
              <th className='actions-column'>Ações</th>
            </tr>
          </thead>
          <tbody>
            {associations.map((association) => (
              <tr key={association._id}>
                <td>{association.teacher.name}</td>
                <td>{association.discipline.name}</td>
                <td className='action-column'>
                  <FaEdit
                    onClick={() => {
                      setEditingAssociation(association);
                      setNewAssociation({ teacher: association.teacher._id, discipline: association.discipline._id });
                      setShowForm(false);
                    }}
                    className="action-button action-button--edit"
                    title="Editar"
                  />
                  <FaTrash
                    onClick={() => handleDeleteAssociation(association._id)}
                    className="action-button action-button--delete"
                    title="Deletar"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherDiscipline;