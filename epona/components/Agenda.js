import { LocaleConfig } from 'react-native-calendars';
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList 
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { db } from '../firebaseconfig';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

LocaleConfig.locales['br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui', 'Sex.', 'Sab.'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'br';

const App = ({ isDarkMode }) => {
  const [selected, setSelected] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [modalDescriptionVisible, setModalDescriptionVisible] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [selectedDateId, setSelectedDateId] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [monthlyEvents, setMonthlyEvents] = useState([]);

  useEffect(() => {
    fetchDatesFromFirebase();
  }, []);

  useEffect(() => {
    filterEventsByMonth();
  }, [currentMonth, markedDates]);

  const fetchDatesFromFirebase = async () => {
    try {
      const auth = getAuth();  // Get the current authenticated user
      const user = auth.currentUser;  // Get the logged-in user
  
      if (user) {
        const querySnapshot = await getDocs(collection(db, 'Dates'));
        const marked = {};
  
        querySnapshot.forEach(docSnapshot => {
          const { date, descricao, uid } = docSnapshot.data();
          
          // Only add events that belong to the current user
          if (uid === user.uid) {
            marked[date] = {
              marked: true,
              selected: false,
              customStyles: {
                container: { backgroundColor: isDarkMode ? '#62a084' : 'green' },
                text: { color: isDarkMode ? '#FFFFFF' : 'white' },
              },
              descricao,
              id: docSnapshot.id,
            };
          }
        });
  
        setMarkedDates(marked);
      } else {
        alert('Usuário não autenticado');
      }
    } catch (e) {
      console.error('Erro ao buscar as datas: ', e);
    }
  };
  

  const filterEventsByMonth = () => {
    const events = Object.keys(markedDates)
      .filter(date => new Date(date).getMonth() + 1 === currentMonth)
      .map(date => ({
        date,
        descricao: markedDates[date].descricao,
      }));
    setMonthlyEvents(events);
  };

  const handleDayPress = (day) => {
    const dayKey = day.dateString;

    if (markedDates[dayKey]) {
      setSelectedDescription(markedDates[dayKey].descricao);
      setSelectedDateId(markedDates[dayKey].id);
      setModalDescriptionVisible(true);
    } else {
      setSelected(dayKey);
      setModalVisible(true);
    }
  };

  const handleMonthChange = (month) => {
    setCurrentMonth(month.month);
  };

const saveDateToFirebase = async () => {
  try {
    const auth = getAuth();  // Get the current authenticated user
    const user = auth.currentUser;  // Get the logged-in user
    if (user) {
      const docRef = await addDoc(collection(db, 'Dates'), {
        date: selected,
        descricao,
        uid: user.uid,  // Save the user UID with the event
      });

      setMarkedDates({
        ...markedDates,
        [selected]: {
          marked: true,
          customStyles: {
            container: { backgroundColor: isDarkMode ? '#62a084' : 'green' },
            text: { color: isDarkMode ? '#FFFFFF' : 'white' },
          },
          descricao,
          id: docRef.id,
        },
      });

      alert('Data cadastrada com sucesso!');
      setModalVisible(false);
      setDescricao('');
    } else {
      alert('Usuário não autenticado');
    }
  } catch (e) {
    console.error('Erro ao salvar a data: ', e);
  }
};


  const updateDescriptionInFirebase = async () => {
    try {
      const docRef = doc(db, 'Dates', selectedDateId);
      await updateDoc(docRef, { descricao: selectedDescription });

      setMarkedDates({
        ...markedDates,
        [selected]: {
          ...markedDates[selected],
          descricao: selectedDescription,
        },
      });

      alert('Descrição atualizada com sucesso!');
      setModalDescriptionVisible(false);
    } catch (e) {
      console.error('Erro ao atualizar a descrição: ', e);
    }
    fetchDatesFromFirebase();
  };

  const deleteDateFromFirebase = async () => {
    try {
      const docRef = doc(db, 'Dates', selectedDateId);
      await deleteDoc(docRef);

      const updatedMarkedDates = { ...markedDates };
      delete updatedMarkedDates[selected];

      setMarkedDates(updatedMarkedDates);
      alert('Data excluída com sucesso!');
      setModalDescriptionVisible(false);
    } catch (e) {
      console.error('Erro ao excluir a data: ', e);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1e3d31' : '#fff8dd' }]}>
      <Calendar
        style={{
          borderWidth: 1,
          borderColor: isDarkMode ? '#121212' : '#ffc4c7',
          height: 350,
          borderRadius: 20,
        }}
        theme={{
          backgroundColor: isDarkMode ? '#121212' : '#ffffff',
          calendarBackground: isDarkMode ? '#1E1E1E' : '#ffc4c7',
          textSectionTitleColor: isDarkMode ? '#ffc4c7' : '#255140',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: isDarkMode ? '#62a084' : '#255140',
          dayTextColor: isDarkMode ? '#E0E0E0' : '#2d4150',
          textDisabledColor: 'gray',
        }}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
        markedDates={markedDates}
        markingType={'custom'}
      />

      <Text
        style={[
          styles.eventListTitle,
          { color: isDarkMode ? '#FFc5c7' : '#162040' },
        ]}
      >
        Eventos de {LocaleConfig.locales['br'].monthNames[currentMonth - 1]}:
      </Text>

      <FlatList
        data={monthlyEvents}
        keyExtractor={item => item.date}
        renderItem={({ item }) => (
          <View
            style={[
              styles.eventItem,
              { backgroundColor: isDarkMode ? 'gray' : '#b6d2aa' },
            ]}
          >
            <Text style={styles.eventDate}>{item.date}</Text>
            <Text
              style={[
                styles.eventDescription,
                { color: isDarkMode ? '#E0E0E0' : '#000000' },
              ]}
            >
              {item.descricao}
            </Text>
          </View>
        )}
      />
      {/* Modal para adicionar descrição */}
<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => {
    setModalVisible(!modalVisible);
  }}
>
  <View
    style={[
      styles.centeredView,
      { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)' },
    ]}
  >
    <View
      style={[
        styles.modalView,
        { backgroundColor: isDarkMode ? '#333' : '#fff' },
      ]}
    >
      <Text
        style={[
          styles.modalText,
          { color: isDarkMode ? '#e0e0e0' : '#000' },
        ]}
      >
        Cadastrar Data
      </Text>
      <Text
        style={[
          styles.label,
          { color: isDarkMode ? '#c0c0c0' : '#333' },
        ]}
      >
        Data Selecionada: {selected}
      </Text>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: isDarkMode ? '#444' : '#fff', color: isDarkMode ? '#e0e0e0' : '#000' },
        ]}
        placeholder="Digite a descrição"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        value={descricao}
        onChangeText={setDescricao}
      />

      <TouchableOpacity
        style={[
          styles.buttonSave,
          { backgroundColor: isDarkMode ? '#48D1CC' : '#b6d2aa' },
        ]}
        onPress={saveDateToFirebase}
      >
        <Text
          style={[
            styles.textStyle,
            { color: isDarkMode ? '#000' : '#fff' },
          ]}
        >
          Salvar Data
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.buttonClose,
          { backgroundColor: isDarkMode ? '#555' : '#ddd' },
        ]}
        onPress={() => setModalVisible(false)}
      >
        <Text
          style={[
            styles.textStyle,
            { color: isDarkMode ? '#e0e0e0' : '#000' },
          ]}
        >
          Fechar
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/* Modal para exibir e editar a descrição da data cadastrada */}
<Modal
  animationType="slide"
  transparent={true}
  visible={modalDescriptionVisible}
  onRequestClose={() => {
    setModalDescriptionVisible(!modalDescriptionVisible);
  }}
>
  <View
    style={[
      styles.centeredView,
      { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)' },
    ]}
  >
    <View
      style={[
        styles.modalView,
        { backgroundColor: isDarkMode ? '#333' : '#fff' },
      ]}
    >
      <Text
        style={[
          styles.modalText,
          { color: isDarkMode ? '#e0e0e0' : '#000' },
        ]}
      >
        Descrição da Data
      </Text>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: isDarkMode ? '#444' : '#fff', color: isDarkMode ? '#e0e0e0' : '#000' },
        ]}
        placeholder="Edite a descrição"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        value={selectedDescription}
        onChangeText={setSelectedDescription}
      />

      <TouchableOpacity
        style={[
          styles.buttonSave,
          { backgroundColor: isDarkMode ? '#48D1CC' : '#b6d2aa' },
        ]}
        onPress={updateDescriptionInFirebase}
      >
        <Text
          style={[
            styles.textStyle,
            { color: isDarkMode ? '#000' : '#fff' },
          ]}
        >
          Atualizar Descrição
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.buttonDelete,
          { backgroundColor: isDarkMode ? '#d9534f' : '#f5c6cb' },
        ]}
        onPress={deleteDateFromFirebase}
      >
        <Text
          style={[
            styles.textStyle,
            { color: isDarkMode ? '#fff' : '#000' },
          ]}
        >
          Excluir Data
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.buttonClose,
          { backgroundColor: isDarkMode ? '#555' : '#ddd' },
        ]}
        onPress={() => setModalDescriptionVisible(false)}
      >
        <Text
          style={[
            styles.textStyle,
            { color: isDarkMode ? '#e0e0e0' : '#000' },
          ]}
        >
          Fechar
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </View>
  );
  
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    backgroundColor: '#fff8dd', // Fundo suave
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#addaff', // Escurece o fundo quando o modal está aberto
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff8dd',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    width: '90%',
  },
  input: {
    height: 50,
    borderColor: '#547699', // Azul intermediário
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginVertical: 15,
    width: '100%',
    backgroundColor: '#F7F7F7',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#162040', // Azul escuro
  },
  label: {
    fontSize: 18,
    color: '#162040', // Azul escuro
  },
  buttonSave: {
    backgroundColor: '#62a084', // Verde claro
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonDelete: {
    backgroundColor: '#255140', // Verde escuro
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#fec3c7', // Azul claro
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  textStyle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  eventListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#162040',
    marginVertical: 15,
  },
  eventItem: {
    padding: 10,
    backgroundColor: '#b6d2aa',
    borderRadius: 10,
    marginVertical: 5,
  },
  eventDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDescription: {
    fontSize: 14,
  },
});

export default App;
