import './FormRegister.css';
import { useState } from 'react';


const FormRegister = () => {

	return (
		<div className="register-container">
			<h1 className='register-title'>Mediotec - Cadastro</h1>
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
				<label htmlFor="password">Senha</label>
				<input
					type="password"
					id="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<label htmlFor="userType">Tipo de usuário</label>
				<input
					type="text"
					id="userType"
					value={userType}
					onChange={(e) => setUserType(e.target.value)}
					required
				/>

				<div className="register-button-group">
					<Link to="/">Já tem uma conta? Faça login</Link>
					<button type="submit" className="btn-register-send">Cadastrar</button>
				</div>
			</form>
		</div>
	);
}

export default Register;