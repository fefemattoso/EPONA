import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';

const Home = ({ onContinue }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
      {/* Logo ou imagem principal */}
      <Image
        source={require('../assets/NEW/Design sem nome (1).png')}
        style={styles.logo}
      />

      {/* Título e slogan */}
      <Text style={styles.title}>Bem-vindo ao Epona</Text>
      <Text style={styles.subtitle}>
        Organização, produtividade e serenidade no seu dia a dia.
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff8dd', // Fundo claro
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#162040', // Azul-escuro da paleta
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#547699', // Azul suave
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#8AC66D', // Verde da paleta
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default Home;
