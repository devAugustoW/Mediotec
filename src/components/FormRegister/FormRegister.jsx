import React, { useState } from 'react';
import './FormRegister.css';

const FormRegister = ({ onSubmit, userType = 'aluno' }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      name,
      email,
      userType,
      password: '12345' // Senha padrão para alunos
    };
    onSubmit(userData);
    // Limpar os campos após o envio
    setName('');
    setEmail('');
  };

  return (
    <div className="register-container">
      <h2 className='register-title'>Cadastro de Aluno</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nome</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="userType">Tipo de usuário</label>
        <input
          type="text"
          id="userType"
          value={userType}
          readOnly
          className="readonly-input"
        />
        <p className="password-info">A senha padrão '12345' será atribuída ao aluno.</p>
        <div className="register-button-group">
          <button type="submit" className="btn-register-send">Cadastrar</button>
        </div>
      </form>
    </div>
  );
}

export default FormRegister;