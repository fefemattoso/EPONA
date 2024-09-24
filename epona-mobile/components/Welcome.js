import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
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
      <Image source={require('../assets/planta2.png')} style={styles.leafTopLeft} />
      <Text style={styles.title}>Bem-vindo ao Epona</Text>
      <Image source={require('../assets/icon.png')} style={styles.icon} />
      <Text style={styles.subtitle}>Seu assistente pessoal para gerenciar tarefas e lembretes</Text>

      <View style={styles.buttonContainer}>
        {/* Botão para ir à tela de login */}
        <Button
          style={styles.button}
          color='#162040'
          title="Login"
          onPress={onContinue}
        />
      </View>

      {/* Folha decorativa na parte inferior */}
      <Image source={require('../assets/planta.png')} style={styles.leafBottomRight} />
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#badda8', // Cor da paleta
    position: 'relative',
    textAlign: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#162040', // Cor escura da paleta
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#547699', // Azul da paleta
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginBottom: 30,
    width: '60%',
  },
  button: {
    backgroundColor: '#162040', // Cor do botão conforme a paleta
    padding: 10,
    borderRadius: 5,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 20,
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

export default Welcome;
