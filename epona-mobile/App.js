import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Login from './components/Login';
import FunctionSelection from './components/FunctionSelection';
import Agenda from './components/Agenda';
import DailyTasks from './components/DailyTasks';
import CustomList from './components/CustomList';
import Welcome from './components/Welcome';

function App() {
  const [user, setUser] = useState(null);
  const [currentFunction, setCurrentFunction] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Controle de animação

  useEffect(() => {
    // Animação de fade-in quando o componente é montado
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleFunctionSelect = (func) => {
    setCurrentFunction(func);
  };

  const handleGoBack = () => {
    if (showWelcome) return;
    if (!user) {
      setShowWelcome(true);
    } else if (!currentFunction) {
      setUser(null);
    } else {
      setCurrentFunction(null);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setUser(null);
    setCurrentFunction(null);
    setShowWelcome(true);
    setShowLogoutModal(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  if (showWelcome) {
    return (
      <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
        <Welcome onContinue={() => setShowWelcome(false)} />
      </Animated.View>
    );
  }

  if (!user) {
    return (
      <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
        <Login onLogin={handleLogin} onGoBack={handleGoBack} />
        <TouchableOpacity onPress={handleGoBack}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (!currentFunction) {
    return (
      <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
        <FunctionSelection onSelect={handleFunctionSelect} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={showLogoutModal}
          onRequestClose={() => setShowLogoutModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Deseja sair?</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.modalButton} onPress={handleConfirmLogout}>
                  <Text style={styles.modalButtonText}>Sim</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleCancelLogout}>
                  <Text style={styles.modalButtonText}>Não</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
      <Text style={styles.header}>Bem-vindo, {user}</Text>
      {currentFunction === 'agenda' && <Agenda />}
      {currentFunction === 'dailyTasks' && <DailyTasks />}
      {currentFunction === 'customList' && <CustomList />}
      <TouchableOpacity onPress={() => setCurrentFunction(null)}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    backgroundColor: '#badda8', // cor de fundo da paleta
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#162040', // cor escura da paleta
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 0,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    backgroundColor: '#8ac66d', // verde medio
    padding: 10,
    borderRadius: 5,
  },
  logoutButton: { // verde escuro da paleta
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#547699',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    color: '#C7E8FD',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#8AC66D', // verde claro da paleta
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 18,
    color: '#162040', // cor de texto escura da paleta
  },
});

export default App;
