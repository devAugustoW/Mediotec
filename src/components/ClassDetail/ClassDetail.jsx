import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../authContext/AuthContext';
import './ClassDetail.css';

const ClassDetails = ({ classId, className, disciplines }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchStudents = async () => {
      if (!classId) {
        setError('ID da turma não fornecido');
        setLoading(false);
        return;
      }
    
      try {
        const response = await axios.get(`http://localhost:3000/teacher/class-students/${classId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        setError('Não foi possível carregar a lista de alunos.');
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classId, token]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="class-details">
      <h2>{className}</h2>
      <h3>Disciplinas:</h3>
      <ul className="disciplines-list">
        {disciplines.map((discipline) => (
          <li key={discipline.disciplineId}>{discipline.disciplineName}</li>
        ))}
      </ul>
      <h3>Alunos:</h3>
      {students.length === 0 ? (
        <p>Não há alunos cadastrados nesta turma.</p>
      ) : (
        <ul className="students-list">
          {students.map((student) => (
            <li key={student._id} className="student-item">
              <span className="student-name">{student.name}</span>
              <span className="student-email">{student.email}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClassDetails;