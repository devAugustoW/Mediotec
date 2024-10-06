import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../authContext/AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa'; 
//import './ClassDiscipline.css';

const ClassDiscipline = () => {
  const [associations, setAssociations] = useState([]);
  const [classes, setClasses] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newAssociation, setNewAssociation] = useState({ class: '', discipline: '' });
  const [editingAssociation, setEditingAssociation] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchAssociations();
    fetchClasses();
    fetchDisciplines();
  }, [token]);

  const fetchAssociations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/getAllClassDisciplines', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssociations(response.data);
      setError(''); // Limpa o erro se a requisição for bem-sucedida
    } catch (error) {
      console.error('Erro ao buscar associações:', error);
      setError('Não foi possível carregar a lista de associações.');
    }
  };

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
        'http://localhost:3000/classToDiscipline',
        newAssociation,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 201) {
        console.log('Associação criada com sucesso:', response.data);
        setShowForm(false);
        setNewAssociation({ class: '', discipline: '' });
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
        `http://localhost:3000/editClassDiscipline/${editingAssociation._id}`,
        newAssociation,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        console.log('Associação atualizada com sucesso:', response.data);
        setEditingAssociation(null);
        setNewAssociation({ class: '', discipline: '' });
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
      const response = await axios.delete(`http://localhost:3000/deleteClassDiscipline/${associationId}`, {
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
    <div className="class-discipline-container">
      <h2>Gerenciamento de Turmas e Disciplinas</h2>
      <div className="button-container">
        <button onClick={() => { setShowForm(true); setEditingAssociation(null); }} className="toggle-button">
          {showForm ? 'Voltar para Lista' : 'Associar'}
        </button>
      </div>

      {showForm && !editingAssociation && (
        <form onSubmit={handleRegisterSubmit} className="association-form">
          <select
            value={newAssociation.class}
            onChange={(e) => setNewAssociation({ ...newAssociation, class: e.target.value })}
            required
          >
            <option value="">Selecione uma Turma</option>
            {classes.map(classItem => (
              <option key={classItem._id} value={classItem._id}>{classItem.name}</option>
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
        </form>
      )}

      {editingAssociation && (
        <form onSubmit={handleEditSubmit} className="association-form">
          <select
            value={newAssociation.class}
            onChange={(e) => setNewAssociation({ ...newAssociation, class: e.target.value })}
            required
          >
            <option value="">Selecione uma Turma</option>
            {classes.map(classItem => (
              <option key={classItem._id} value={classItem._id}>{classItem.name}</option>
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
        </form>
      )}

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        associations.length === 0 ? (
          <p>Nenhuma associação encontrada.</p>
        ) : (
          <table className="association-table">
            <thead>
              <tr>
                <th>Turma</th>
                <th>Disciplina</th>
                <th className='actions-column'>Ações</th>
              </tr>
            </thead>
            <tbody>
              {associations.map((association) => (
                <tr key={association._id}>
                  <td>{association.class.name}</td>
                  <td>{association.discipline.name}</td>
                  <td className='action-column'>
                    <FaEdit
                      onClick={() => {
                        setEditingAssociation(association);
                        setNewAssociation({ class: association.class._id, discipline: association.discipline._id });
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
        )
      )}
    </div>
  );
};

export default ClassDiscipline;