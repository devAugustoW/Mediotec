import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../authContext/AuthContext';
import './';

const ClassDetails = ({ classId, className }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (!className) {
      setLoading(false);
      setError('Nome da turma não fornecido');
      return;
    }

    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/teacher/class-students/${encodeURIComponent(className)}`, {
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
  }, [className, token]);

  if (!className) return null;
  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="class-details">
      <h2>{className}</h2>
      {students.length === 0 ? (
        <p>Não há alunos cadastrados nesta turma.</p>
      ) : (
        <ul className="students-list">
          {students.map((student) => (
            <li key={student._id} className="student-item">
              <span className="student-name">{student.name}</span>
              <span className="student-grade">{student.grade || 'N/A'}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClassDetails;