import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { getAuth, signInAnonymously } from 'firebase/auth'; // Importa autenticação anônima do Firebase

const Welcome = ({ onContinue, onVisitorAccess }) => {
  // Função para autenticação anônima
  const handleVisitorAccess = () => {
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        // Login anônimo bem-sucedido, chama o onVisitorAccess para ir direto para a tela de funções
        onVisitorAccess();
      })
      .catch((error) => {
        console.error("Erro ao entrar como visitante: ", error);
      });
  };

  return (
    <View style={styles.welcomeContainer}>
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
        
        {/* Botão para acessar como visitante */}
        <Button
          style={styles.button}
          color='#162040'
          title="Acessar como visitante"
          onPress={handleVisitorAccess} // Chama a função de login anônimo
        />
      </View>

      {/* Folhas decorativas */}
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
    color: '#162040',
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
