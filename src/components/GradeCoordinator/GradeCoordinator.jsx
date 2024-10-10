import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../authContext/AuthContext';
import StudentGradeList from '../StudentGradeList/StudentGradeList';
import './GradeCoordinator.css';

const GradeCoordinator = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [studentsWithConcepts, setStudentsWithConcepts] = useState([]);

  const { token } = useAuth();

  useEffect(() => {
    const fetchClassesWithDisciplines = async () => {
      try {
        const response = await axios.get('http://localhost:3000/classes-with-disciplines', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClasses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar turmas e disciplinas:', error);
        setError('Não foi possível carregar as turmas e disciplinas.');
        setLoading(false);
      }
    };

    fetchClassesWithDisciplines();
  }, [token]);

  const handleDisciplineClick = async (discipline) => {
    console.log('Disciplina clicada:', discipline);
    setSelectedDiscipline(discipline);
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:3000/discipline-students-concepts/${discipline._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Resposta do servidor:', response.data);
      setStudentsWithConcepts(response.data);
    } catch (error) {
      console.error('Erro ao buscar alunos e conceitos:', error);
      setError('Não foi possível carregar os alunos e conceitos.');
    } finally {
      setLoading(false);
    }
  };

  console.log('Estado atual:', { selectedDiscipline, studentsWithConcepts, loading, error });

  return (
    <div className="grade-coordinator">
      <h2>Turmas e Disciplinas</h2>
      <div className="class-card-container">
        {classes.map((classItem) => (
          <div key={classItem._id} className="class-card">
            <h3>{classItem.name}</h3>
            <p>Ano: {classItem.year}, Semestre: {classItem.semester}</p>
            <h4>Disciplinas:</h4>
            <ul>
              {classItem.disciplines.map((discipline) => (
                <li key={discipline._id}>
                  <span 
                    className="discipline-link"
                    onClick={() => handleDisciplineClick(discipline)}
                  >
                    {discipline.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {loading && <p>Carregando...</p>}
      {error && <div className="error-message">{error}</div>}
      {selectedDiscipline && !loading && studentsWithConcepts.length > 0 && (
        <StudentGradeList 
          students={studentsWithConcepts} 
          disciplineName={selectedDiscipline.name}
        />
      )}
      {selectedDiscipline && !loading && studentsWithConcepts.length === 0 && (
        <p>Nenhum aluno encontrado para {selectedDiscipline.name}.</p>
      )}
    </div>
  );
};

export default GradeCoordinator;