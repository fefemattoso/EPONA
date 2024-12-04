import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground, Image } from 'react-native';

const Home = ({ onContinue, isDarkMode }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#1e3d31' : '#fff8dd' }, // Fundo ajustado para o modo escuro
        { opacity: fadeAnim },
      ]}
    >
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
          <Text
            style={[
              styles.title,
              { color: isDarkMode ? '#FFF8dd' : '#162040' }, // Título ajustado para o modo escuro
            ]}
          >
            Bem-vindo ao Epona
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: isDarkMode ? '#BBBBBB' : '#547699' }, // Subtítulo ajustado para o modo escuro
            ]}
          >
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
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
});

export default Home;
