import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ImageBackground, Image } from 'react-native';

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
      <ImageBackground
        source={require('../assets/NEW/borrao.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Conteúdo da página */}
        <View style={styles.content}>
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
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8dd', // Fundo claro
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 800,
    width: 420,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default Home;
