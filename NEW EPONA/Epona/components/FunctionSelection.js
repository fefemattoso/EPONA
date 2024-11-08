import React from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';

function FunctionSelection({ onSelect }) {
  return (
    <View style={styles.functionSelection}>
      <Text style={styles.title}>Selecione uma Função</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => onSelect('agenda')}>
          <Text style={styles.buttonText}>AGENDA</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.button} onPress={() => onSelect('dailyTasks')}>
        <Text style={styles.buttonText}>TAREFAS DIÁRIAS</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.button} onPress={() => onSelect('customList')}>
        <Text style={styles.buttonText}>LISTA PERSONALIZADA</Text>
      </TouchableOpacity>
</View>


      {/* Adicionando as folhinhas */}
      <Image source={require('../assets/planta2.png')} style={styles.leafTopLeft} />
      <Image source={require('../assets/planta.png')} style={styles.leafBottomRight} />
    </View>
  );
}

export default FunctionSelection;

const styles = StyleSheet.create({
  functionSelection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#badda8', // Cor da paleta
    position: 'relative',
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#162040',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '85%',
    maxWidth: 400,
    flexDirection: 'column',
    gap: 15,
    marginBottom: 30,
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
  leafTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 150,
    height: 150,
    transform: [{ rotate: '45deg' }],  // Gira a imagem 45 graus
  },
  leafBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 150,
    height: 150,
    transform: [{ rotate: '-40deg' }],  // Gira a imagem -45 graus
    marginRight: 60,
  },  
});
