import React, { useState } from 'react';
import './Login.css';


function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = () => {
    if (username && password) {
      onLogin(username);
    } else {
      alert("Por favor, insira suas credenciais.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login no Epona</h2>
      <input 
        type="text" 
        placeholder="Usuário" 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input 
        type="password" 
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className='buttons'>
        <button onClick={handleLogin}>Entrar</button> 
        <button onClick={() => onLogin('guest')}>Entrar como Visitante</button>
        <button onClick={() => alert('Cadastro ainda não disponível!')}>Cadastrar</button>
      </div>
    </div>
  );
}

export default Login;
