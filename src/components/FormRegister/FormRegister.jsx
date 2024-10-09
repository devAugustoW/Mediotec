import React, { useState, useEffect } from 'react';
import './FormRegister.css';

// componente Formulário
const FormRegister = ({ onSubmit, userType = 'aluno', initialData = null }) => {
  
	// Definindo estados para nome e email
	const [name, setName] = useState('');
  const [email, setEmail] = useState('');

	// atualizar os estados quando initialData mudar
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setEmail(initialData.email || '');
    } else {
      setName('');
      setEmail('');
    }
  }, [initialData]);

	// Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      ...initialData, // Manter outros dados do aluno se existirem
      name,
      email,
      userType,
      password: initialData ? initialData.password : '12345' // Senha padrão ou existente
    };
    onSubmit(userData);  // Chamar a função onSubmit passada como prop
    setName('');
    setEmail('');
  };

  return (
    <div className="register-container">
      <h2 className='register-title'>
        {initialData ? `Atualizar ${userType.charAt(0).toUpperCase() + userType.slice(1)}` : `Cadastrar ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
      </h2>
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
        <p className="password-info">
          {initialData ? 'A senha atual será mantida.' : 'A senha padrão "12345" será atribuída ao aluno.'}
        </p>
        <div className="register-button-group">
          <button type="submit" className="btn-register-send">
            {initialData ? 'Atualizar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormRegister;