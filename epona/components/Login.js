import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../firebaseconfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

function Login({ onLogin }) {
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
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Cadastrar' : 'Login'} no Epona</Text>

      <View style={styles.formContainer}>
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
              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Cadastrar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setIsRegistering(false)}>
                <Text style={styles.secondaryButtonText}>Voltar para Login</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setIsRegistering(true)}>
                <Text style={styles.secondaryButtonText}>Cadastrar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#badda8',
    paddingVertical: 20,
  },
  title: {
    marginBottom: 20,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#162040',
  },
  formContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    borderColor: '#c2be99',
    borderWidth: 1,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#547699',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    width: '100%',
    fontSize: 16,
  },
  buttons: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    backgroundColor: '#162040',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  secondaryButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#547699',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Login;
