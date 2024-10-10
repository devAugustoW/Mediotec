import React from 'react';
import './StudentGradeList.css';

const StudentGradeList = ({ students, disciplineName }) => {
  console.log('StudentGradeList renderizado:', { students, disciplineName });

  if (!students || students.length === 0) {
    return <p>Nenhum aluno encontrado para {disciplineName}.</p>;
  }

  return (
    <div className="student-grade-list">
      <h3>Alunos de {disciplineName}</h3>
      <ul>
        {students.map((student) => (
          <li key={student.studentId} className="student-grade-item">
            <span className="student-name">{student.studentName}</span>
            <span className="student-concept">Conceito: {student.concept || 'Não atribuído'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentGradeList;