import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importando ícones
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
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const Menu = ({ navigation }) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const handleMenuToggle = () => {
      setMenuVisible(!menuVisible);
    };

    return (
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={handleMenuToggle} style={styles.menuButton}>
          <Text style={styles.menuText}>☰</Text>
        </TouchableOpacity>
        {menuVisible && (
          <View style={styles.dropdown}>
            <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
              <Icon name="sign-out" size={20} color="#255140" style={styles.icon} />
              <Text style={styles.dropdownText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={toggleDarkMode}>
              <Icon
                name={isDarkMode ? 'sun-o' : 'moon-o'}
                size={20}
                color="#255140"
                style={styles.icon}
              />
              <Text style={styles.dropdownText}>
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Text>
            </TouchableOpacity>
            
          </View>
        )}
      </View>
    );
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
        <Login onLogin={handleLogin} />
      </Animated.View>
    );
  }

  return (
    <>
      <NavigationContainer>
      <Tab.Navigator
  screenOptions={({ route }) => ({
    headerShown: true,
    headerStyle: {
      backgroundColor: isDarkMode ? '#152b23' : '#b6d2aa',
    },
    headerTintColor: isDarkMode ? '#FFF8dd' : '#255140',
    tabBarStyle: { backgroundColor: isDarkMode ? '#152b23' : '#b6d2aa' },
    tabBarActiveTintColor: isDarkMode ? '#FFF8dd' : '#FFF8dd',
    tabBarInactiveTintColor: isDarkMode ? '#FFc5c7' : '#255140',
    headerRight: ({ navigation }) => <Menu navigation={navigation} />,
    tabBarIcon: ({ color, size }) => {
      let iconName;

      switch (route.name) {
        case 'Home':
          iconName = 'home';
          break;
        case 'Agenda':
          iconName = 'calendar';
          break;
        case 'Tarefas':
          iconName = 'check-square';
          break;
        case 'Listas':
          iconName = 'list';
          break;
        default:
          iconName = 'circle';
          break;
      }

      return <Icon name={iconName} size={size} color={color} />;
    },
  })}
>
  <Tab.Screen name="Home" component={() => <FunctionSelection isDarkMode={isDarkMode} />} />
  <Tab.Screen name="Agenda" component={() => <Agenda isDarkMode={isDarkMode} />} />
  <Tab.Screen name="Tarefas" component={() => <DailyTasks isDarkMode={isDarkMode} />} />
  <Tab.Screen name="Listas" component={() => <CustomList isDarkMode={isDarkMode} />} />
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
  menuContainer: {
    marginHorizontal: 10,
    position: 'relative',
  },
  menuButton: {
    padding: 10,
  },
  menuText: {
    fontSize: 24,
    color: '#FFF',
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#62a084',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1000,
    width: 300,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: '#255140',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
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