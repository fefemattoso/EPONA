import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Login from './components/Login';
import FunctionSelection from './components/FunctionSelection';
import Agenda from './components/Agenda';
import DailyTasks from './components/DailyTasks';
import CustomList from './components/CustomList';
import Welcome from './components/Welcome'; // Importando o componente Welcome

function App() {
  const [user, setUser] = useState(null);
  const [currentFunction, setCurrentFunction] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true); // Estado para controlar a exibição da página Welcome

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleFunctionSelect = (func) => {
    setCurrentFunction(func);
  };

  // Renderiza a página Welcome se showWelcome for verdadeiro
  if (showWelcome) {
    return <Welcome onContinue={() => setShowWelcome(false)} />;
  }

  // Exibe a página de login caso o usuário ainda não tenha feito login
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Exibe a seleção de funções caso nenhuma tenha sido escolhida
  if (!currentFunction) {
    return <FunctionSelection onSelect={handleFunctionSelect} />;
  }

  // Exibe o conteúdo da função selecionada
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bem-vindo, {user}</Text>
      {currentFunction === 'agenda' && <Agenda />}
      {currentFunction === 'dailyTasks' && <DailyTasks />}
      {currentFunction === 'customList' && <CustomList />}
      <button onClick={() => setCurrentFunction(null)}>Voltar</button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App;
