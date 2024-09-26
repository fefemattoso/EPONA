import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

function FunctionSelection({ onSelect }) {
  return (
    <View style={styles.functionSelection}>
      <Text style={styles.title}>Selecione uma Função</Text>
      <View style={styles.buttonContainer}>
        <Button color='#162040' title="Agenda" onPress={() => onSelect('agenda')} />
        <Button color='#162040' title="Lista de Tarefas Diárias" onPress={() => onSelect('dailyTasks')} />
        <Button color='#162040' title="Lista Personalizada" onPress={() => onSelect('customList')} />
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
    backgroundColor: '#badda8',
    position: 'relative',
    padding: 0,
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
    backgroundColor: '#162040',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
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
    transform: [{ rotate: '-90deg' }],  // Gira a imagem -45 graus
  },  
});
