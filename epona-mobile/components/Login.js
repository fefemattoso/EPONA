import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import { auth } from '../firebaseconfig'; // Certifique-se de configurar corretamente o auth no firebaseconfig.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Estado para alternar entre cadastro e login

  const handleLogin = async () => {
    if (email && password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onLogin(userCredential.user); // Login bem-sucedido
      } catch (error) {
        alert("Erro ao realizar login: " + error.message);
      }
    } else {
      alert("Por favor, insira suas credenciais.");
    }
  };

  const handleRegister = async () => {
    if (email && password) {
      if (password.length < 6) {
        alert("A senha deve ter no mínimo 6 caracteres.");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        onLogin(userCredential.user); // Cadastro bem-sucedido e login automático
      } catch (error) {
        alert("Erro ao cadastrar!");
      }
    } else {
      alert("Por favor, insira um email e senha válidos.");
    }
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.title}>{isRegistering ? "Cadastrar" : "Login"} no Epona</Text>
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
        <Button style={styles.button} color='#162040' title="Entrar como Visitante" onPress={() => onLogin('guest')} />
      </View>
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
