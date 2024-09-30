import React, { useState } from 'react';
import { View, Text, Button, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
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
      <TouchableOpacity style={styles.button} onPress={() => setIsRegistering(false)}>
        <Text style={styles.buttonText}>Voltar para Login</Text>
      </TouchableOpacity>
    </>
  ) : (
    <>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ENTRAR</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setIsRegistering(true)}>
        <Text style={styles.buttonText}>CADASTRAR</Text>
      </TouchableOpacity>
    </>
  )}
</View>

      </View>


      {/* <Image source={require('../assets/planta2.png')} style={styles.leafTopLeft} />
      <Image source={require('../assets/planta.png')} style={styles.leafBottomRight} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#badda8",
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#162040',
    marginBottom: 30,
  },
  formContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    borderColor: "#c2be99",
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
    backgroundColor: '#162040', // Cor do botão conforme a paleta
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff', // Cor escura da paleta
    marginBottom: 10,
    marginTop: 5,
  },
  // leafTopLeft: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   width: 130,
  //   height: 130,
  // },
  // leafBottomRight: {
  //   position: 'absolute',
  //   bottom: 0,
  //   right: 0,
  //   width: 130,
  //   height: 130,
  //   marginRight: 30,
  // },
});

export default Login;
