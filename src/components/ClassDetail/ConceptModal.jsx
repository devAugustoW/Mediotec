import React, { useState, useEffect } from 'react';
import './ConceptModal.css';

const CONCEPT_OPTIONS = ['Excelente', 'Muito bom', 'Bom', 'Regular', 'Insuficiente'];

const ConceptModal = ({ isOpen, onClose, student, disciplineName, onSubmit, mode }) => {
  const [concept, setConcept] = useState('');

  useEffect(() => {
    if (student && mode === 'edit') {
      setConcept(student.concept || '');
    } else {
      setConcept('');
    }
  }, [student, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(concept);
  };

  if (!isOpen || !student) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{mode === 'edit' ? 'Editar' : 'Adicionar'} Conceito</h2>
        <p>Aluno: {student.name}</p>
        <p>Disciplina: {disciplineName}</p>
        {mode === 'edit' && <p>Conceito atual: {student.concept || 'S/N'}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="concept">Novo Conceito:</label>
          <select
            id="concept"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            required
          >
            <option value="">Selecione um conceito</option>
            {CONCEPT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="modal-actions">
            <button type="submit">{mode === 'edit' ? 'Salvar Alterações' : 'Adicionar Conceito'}</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConceptModal;