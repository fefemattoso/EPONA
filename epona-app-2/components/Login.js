import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
// import './Login.css';


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
    <View style={styles.loginContainer}>
      <Text style={styles.title}>Login no Epona</Text>
      <input style={styles.input}
        type="text" 
        placeholder="Usuário" 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input style={styles.input}
        type="password" 
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <View style={styles.buttons}>
        <Button style={styles.button} title="Entrar" onPress={handleLogin} />
        <Button style={styles.button} title="Entrar como Visitante" onPress={() => onLogin('guest')} />
        <Button style={styles.button} title="Cadastrar" onPress={() => alert('Cadastro ainda não disponível!')} />
      </View>
      <Image source={require('../assets/planta2.png')} style={styles.leafTopLeft} />
      <Image source={require('../assets/planta.png')} style={styles.leafBottomRight} />
    </View>
  );
  
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1, // Faz o contêiner ocupar toda a tela
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center', // Centraliza horizontalmente
    backgroundColor: '#badda8', // Mantém a cor de fundo
    padding: 20, // Adiciona o padding para espaçamento interno
    borderRadius: 8,
  },
  title: {
    color: '#162040',
    marginBottom: 20,
    fontSize: 24,
  },
  input: {
    padding: 10,
    marginVertical: 10,
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 5,
    width: '70%',
    maxWidth: 400,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    backgroundColor: '#162040',
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  leafTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 150,
    height: 150,
  },
  leafBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 150,
    height: 150,
  },
});



export default Login;
