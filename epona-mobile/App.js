import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import React, { useState } from 'react';
import Login from './components/Login';
import FunctionSelection from './components/FunctionSelection';
import Agenda from './components/Agenda';
import DailyTasks from './components/DailyTasks';
import CustomList from './components/CustomList';
import Welcome from './components/Welcome'

function App() {
  const [user, setUser] = useState(null);
  const [currentFunction, setCurrentFunction] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Estado para controlar a exibição do modal de logout

  // Função que será passada para o componente Login
  const handleLogin = (username) => {
    setUser(username);
  };

  const handleFunctionSelect = (func) => {
    setCurrentFunction(func);
  };

  const handleGoBack = () => {
    if (showWelcome) {
      return;
    }
    if (!user) {
      setShowWelcome(true);
    } else if (!currentFunction) {
      setUser(null);
    } else {
      setCurrentFunction(null);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true); // Exibe o modal de logout
  };

  const handleConfirmLogout = () => {
    setUser(null);
    setCurrentFunction(null);
    setShowWelcome(true);
    setShowLogoutModal(false); // Fecha o modal de logout
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false); // Fecha o modal de logout
  };

  // Renderiza a página Welcome se showWelcome for verdadeiro
  if (showWelcome) {
    return (
      <Welcome onContinue={() => setShowWelcome(false)}>
        <TouchableOpacity onPress={handleGoBack}>
          <Text>Voltar</Text>
        </TouchableOpacity>
      </Welcome>
    );
  }

  // Exibe a página de login caso o usuário ainda não tenha feito login
  if (!user) {
    return (
      <Login onLogin={handleLogin} onGoBack={handleGoBack}>
        <TouchableOpacity onPress={handleGoBack}>
          <Text>Voltar</Text>
        </TouchableOpacity>
      </Login>
    );
  }

  // Exibe a seleção de funções caso nenhuma tenha sido escolhida
  if (!currentFunction) {
    return (
      <View style={styles.container}>
        <FunctionSelection onSelect={handleFunctionSelect} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showLogoutModal}
          onRequestClose={() => setShowLogoutModal(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Deseja sair?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={handleConfirmLogout}>
                <Text style={styles.modalButtonText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancelLogout}>
                <Text style={styles.modalButtonText}>Não</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Exibe o conteúdo da função selecionada
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bem-vindo, {user}</Text>
      {currentFunction === 'agenda' && <Agenda />}
      {currentFunction === 'dailyTasks' && <DailyTasks />}
      {currentFunction === 'customList' && <CustomList />}
      <TouchableOpacity onPress={() => setCurrentFunction(null)}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#badda8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#badda8',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba (0,0,0,0.5)',
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  modalButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default App;