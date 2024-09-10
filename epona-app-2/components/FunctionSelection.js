import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

function FunctionSelection({ onSelect }) {
  return (
    <View style={styles.functionSelection}>
      <Text style={styles.title}>Selecione uma Função</Text>
      <View style={styles.buttonContainer}>
        <Button style={styles.button} color='#162040' title="Agenda" onPress={() => onSelect('agenda')} />
        <Button style={styles.button} color='#162040' title="Lista de Tarefas Diárias" onPress={() => onSelect('dailyTasks')} />
        <Button style={styles.button} color='#162040' title="Lista Personalizada" onPress={() => onSelect('customList')} />
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
    padding: 20,
    backgroundColor: '#badda8',
    borderRadius: 8,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    color: '#162040',
    marginBottom: 20,
    fontSize: 24,
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
