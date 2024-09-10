import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import './Welcome.css';

const Welcome = ({ onContinue }) => {
  return (
    <View style={styles.welcomeContainer}>
      <Text style={styles.title}>Bem-vindo ao Epona</Text>
      <Image source={require('../assets/icon.png')} style={styles.icon} />
      <Text style={styles.subtitle}>Seu assistente pessoal para gerenciar tarefas e lembretes</Text>

      <View style={styles.buttonContainer}>
        <Button style={styles.button} title="Login" onPress={onContinue} />
        <Button style={styles.button} title="Acessar como visitante" onPress={onContinue} />
      </View>

      {/* Folhas transparentes no canto */}
      <Image source={require('../assets/planta2.png')} style={styles.leafTopLeft} />
      <Image source={require('../assets/planta.png')} style={styles.leafBottomRight} />
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#badda8',
  },
  title: {
    fontSize: 36,
    fontWeight: '"Comfortaa", sans-serif',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    alignItems: 'center',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    backgroundColor: '#162040',
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
  icon: {
    width: 150,
    height: 150,
  }
});

export default Welcome;
