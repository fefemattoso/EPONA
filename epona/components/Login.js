import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
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
      <Text style={styles.title}>{isRegistering ? 'Cadastrar' : 'Login'} in Epona</Text>

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
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
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
    padding: 125,
    backgroundColor: '#fff8dd',
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    textAlign: 'center',
    color: '#1a3d32',
    marginBottom: 20,
  },
  formContainer: {
    width: 250,
    height: '55%',
    backgroundColor: '#ffc4c7',
    padding: 60,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderColor: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 25,
    padding: 8,
    paddingLeft: 10, // Espaço para o ícone
    marginVertical: 10,
    width: 190,
    backgroundColor: '#fefdf8',
  },
  buttons: {
    marginTop: 20,
    width: '100%',
  },
  button: {
    backgroundColor: '#5a8b78',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fefdf8',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1a3d32',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Login;
