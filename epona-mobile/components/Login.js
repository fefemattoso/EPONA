// components/Login.js
import React, { useState } from 'react';
import { View, Text, Button, TextInput, Image, StyleSheet } from 'react-native';
import { auth } from '../firebaseconfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

function Login({ onLogin, onGoBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = () => {
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log('Usuário logado com sucesso');
          onLogin(email);
        })
        .catch((error) => {
          console.error('Erro ao fazer login: ', error);
          alert('Falha no login, verifique suas credenciais.');
        });
    } else {
      alert('Por favor, insira suas credenciais.');
    }
  };

  const handleRegister = () => {
    if (email && password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log('Usuário cadastrado com sucesso');
          alert('Usuário cadastrado com sucesso!');
          setIsRegistering(false);  // Volta para tela de login após cadastro
        })
        .catch((error) => {
          console.error('Erro ao fazer cadastro: ', error);
          alert('Falha no cadastro, verifique suas informações.');
        });
    } else {
      alert('Por favor, insira suas credenciais.');
    }
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.title}>{isRegistering ? 'Cadastrar' : 'Login'} no Epona</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttons}>
        {isRegistering ? (
          <>
            <Button style={styles.button} color='#162040' title="Cadastrar" onPress={handleRegister} />
            <Button style={styles.button} color='#162040' title="Voltar para Login" onPress={() => setIsRegistering(false)} />
          </>
        ) : (
          <>
            <Button style={styles.button} color='#162040' title="Entrar" onPress={handleLogin} />
            <Button style={styles.button} color='#162040' title="Cadastrar" onPress={() => setIsRegistering(true)} />
          </>
        )}
      </View>

      <Button style={styles.button} color='#162040' title="Voltar" onPress={onGoBack} />

      <Image source={require('../assets/planta2.png')} style={styles.leafTopLeft} />
      <Image source={require('../assets/planta.png')} style={styles.leafBottomRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#badda8',
    padding: 20,
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
    flexDirection: 'column',
    gap: 20,
    marginBottom: 20,
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