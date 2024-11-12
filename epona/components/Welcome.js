import React from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getAuth, signInAnonymously } from 'firebase/auth';

const Welcome = ({ onContinue, onVisitorAccess }) => {
  // Função para autenticação anônima
  const handleVisitorAccess = () => {
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        onVisitorAccess();
      })
      .catch((error) => {
        console.error("Erro ao entrar como visitante: ", error);
      });
  };

  return (
    <View style={styles.welcomeContainer}>
      {/* <Image source={require('../assets/planta2.png')} style={styles.leafTopLeft} /> */}
      <Text style={styles.title}>Welcome to</Text>
      <Image source={require('../assets/NEW/logotipo2.png')} style={styles.epona} />
      <Image source={require('../assets/logo.png')} style={styles.icon} />
      <Text style={styles.subtitle}>Seu assistente pessoal para gerenciar tarefas e lembretes</Text>

    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={onContinue}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
    </View>


      {/* Folha decorativa na parte inferior */}
      {/* <Image source={require('../assets/planta.png')} style={styles.leafBottomRight} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff8dd', // Cor da paleta
    position: 'relative',
    textAlign: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#255140', // Cor escura da paleta
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#255140', // Azul da paleta
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    
  },
  buttonContainer: {
    marginBottom: 30,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#255140', // Cor do botão conforme a paleta
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff', // Cor escura da paleta
    marginBottom: 10,
    marginTop: 5,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  epona: {
    width: 290,
    height: 100,
    marginBottom: 0,
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
  // },
});

export default Welcome;
