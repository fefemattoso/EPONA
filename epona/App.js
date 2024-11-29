import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './components/Login';
import FunctionSelection from './components/FunctionSelection';
import Agenda from './components/Agenda';
import DailyTasks from './components/DailyTasks';
import CustomList from './components/CustomList';
import Welcome from './components/Welcome';

const Tab = createBottomTabNavigator();

function App() {
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Controle de animação

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setUser(null);
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

  // if (!user) {
  //   return (
  //     <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
  //       <Login onLogin={handleLogin} />
  //     </Animated.View>
  //   );
  // }

  return (
    <>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: '#162040' },
            tabBarActiveTintColor: '#8AC66D',
            tabBarInactiveTintColor: '#C7E8FD',
          }}
        >
          <Tab.Screen
            name="Seleção de Função"
            component={() => (
              <FunctionSelection onLogout={handleLogout} />
            )}
          />
          <Tab.Screen name="Agenda" component={Agenda} />
          <Tab.Screen name="Tarefas Diárias" component={DailyTasks} />
          <Tab.Screen name="Lista Personalizada" component={CustomList} />
        </Tab.Navigator>
      </NavigationContainer>

      {/* Modal de Logout */}
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff8dd',
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
    backgroundColor: '#8AC66D',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 18,
    color: '#162040',
  },
});

export default App;
