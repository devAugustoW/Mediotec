import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../authContext/AuthContext';
import ClassDetails from '../ClassDetail/ClassDetail';
import './TeacherClasses.css';

const TeacherClasses = () => {
  const [classesAndDisciplines, setClassesAndDisciplines] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const { token } = useAuth();

  console.log('Token:', token); // Log do token para depuração

  useEffect(() => {
    const fetchTeacherClassesAndDisciplines = async () => {
      if (!token) {
        setError('Token de autenticação não encontrado.');
        setLoading(false);
        return;
      }

      try {
        console.log('Enviando requisição com token:', token);
        const response = await axios.get('http://localhost:3000/teacher/classes-and-disciplines', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Dados recebidos:', response.data);
        setClassesAndDisciplines(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar turmas e disciplinas:', error);
        if (error.response) {
          console.error('Resposta do servidor:', error.response.data);
          console.error('Status do erro:', error.response.status);
        }
        setError('Não foi possível carregar as turmas e disciplinas.');
        setLoading(false);
      }
    };

    fetchTeacherClassesAndDisciplines();
  }, [token]);

  const handleClassClick = (classItem) => {
    if (classItem.classId) {
      setSelectedClass(classItem);
      console.log('Classe selecionada:', classItem);
    } else {
      console.error('classId não encontrado para a classe:', classItem);
      alert('classId não encontrado para a classe. Verifique os dados retornados pela API.');
    }
  };

  const handleBackClick = () => {
    setSelectedClass(null);
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  if (selectedClass) {
    return (
      <div>
        <button onClick={handleBackClick} className="back-button">Voltar para a lista de turmas</button>
				<ClassDetails 
					classId={selectedClass.classId}
					className={selectedClass.className}
					disciplines={selectedClass.disciplines}
				/>
      </div>
    );
  }

  return (
    <div className="teacher-classes-container">
      <h2>Minhas Turmas e Disciplinas</h2>
      {classesAndDisciplines.length === 0 ? (
        <p>Você não está associado a nenhuma turma ou disciplina no momento.</p>
      ) : (
        <div className="classes-list">
          {classesAndDisciplines.map((classItem) => (
            <div 
              key={classItem.classId} 
              className="class-card"
              onClick={() => handleClassClick(classItem)}
            >
              <h3 className="class-name">{classItem.className}</h3>
              <ul className="disciplines-list">
                {classItem.disciplines.map((discipline) => (
                  <li 
                    key={discipline.disciplineId} 
                    className="discipline-item"
                  >
                    {discipline.disciplineName}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherClasses;