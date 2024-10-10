import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../authContext/AuthContext';
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ConceptModal from './ConceptModal';
import './ClassDetail.css';

const ClassDetails = ({ classId, className, disciplines }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const { token } = useAuth();

  useEffect(() => {
    fetchStudentsAndConcepts();
  }, [classId, token]);

  const fetchStudentsAndConcepts = async () => {
    if (!classId) {
      setError('ID da turma não fornecido');
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:3000/teacher/class-students-concepts/${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar alunos e conceitos:', error);
      setError('Não foi possível carregar a lista de alunos e conceitos.');
      setLoading(false);
    }
  };

  const handleConceptAction = (student, mode) => {
    setSelectedStudent(student);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleSubmitConcept = async (concept) => {
    try {
      const url = modalMode === 'edit'
        ? `http://localhost:3000/teacher/edit-concept/${selectedStudent._id}`
        : `http://localhost:3000/teacher/add-concept`;
      
      const method = modalMode === 'edit' ? 'put' : 'post';

      const response = await axios[method](url, {
        studentId: selectedStudent._id,
        classId,
        disciplineId: disciplines[0].disciplineId,
        concept
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(`Conceito ${modalMode === 'edit' ? 'editado' : 'adicionado'} com sucesso:`, response.data);
      await fetchStudentsAndConcepts();
      handleCloseModal();
    } catch (error) {
      console.error(`Erro ao ${modalMode === 'edit' ? 'editar' : 'adicionar'} conceito:`, error.response?.data || error.message);
      setError(`Não foi possível ${modalMode === 'edit' ? 'editar' : 'adicionar'} o conceito. Por favor, tente novamente.`);
    }
  };

  const handleDeleteConcept = async (student) => {
    if (window.confirm(`Tem certeza que deseja deletar o conceito de ${student.name}?`)) {
      try {
        await axios.delete(`http://localhost:3000/teacher/delete-concept/${student._id}/${disciplines[0].disciplineId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Conceito deletado com sucesso');
        await fetchStudentsAndConcepts();
      } catch (error) {
        console.error('Erro ao deletar conceito:', error.response?.data || error.message);
        setError('Não foi possível deletar o conceito. Por favor, tente novamente.');
      }
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="class-details">
      <h2>{className}</h2>
      {error && <div className="error-message">{error}</div>}
      <h3>Disciplinas:</h3>
      <ul className="disciplines-list">
        {disciplines.map((discipline) => (
          <li key={discipline.disciplineId}>{discipline.disciplineName}</li>
        ))}
      </ul>
      <h3>Alunos e Conceitos:</h3>
      {students.length === 0 ? (
        <p>Não há alunos cadastrados nesta turma.</p>
      ) : (
        <ul className="students-list">
          {students.map((student) => (
            <li key={student._id} className="student-item">
              <span className="student-name">{student.name}</span>
              <span className="student-concept">{student.concept || 'S/N'}</span>
              <div className="concept-actions">
                <button onClick={() => handleConceptAction(student, 'add')} className="icon-button">
                  <FaPlus />
                </button>
                <button onClick={() => handleConceptAction(student, 'edit')} className="icon-button">
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteConcept(student)} className="icon-button">
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {selectedStudent && (
        <ConceptModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          student={selectedStudent}
          disciplineName={disciplines[0]?.disciplineName}
          onSubmit={handleSubmitConcept}
          mode={modalMode}
        />
      )}
    </div>
  );
};

export default ClassDetails;