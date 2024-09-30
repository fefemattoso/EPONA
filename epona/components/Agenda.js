import {LocaleConfig} from 'react-native-calendars';
import React, {useState, useEffect} from 'react';
import {Calendar} from 'react-native-calendars';
import {
  View, 
  Text, 
  Modal, 
  Button, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity
} from 'react-native';
import {db} from '../firebaseconfig';
import {collection, addDoc, getDocs, doc, updateDoc, deleteDoc} from 'firebase/firestore';

LocaleConfig.locales['br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui', 'Sex.', 'Sab.'],
  today: 'Hoje'
};

LocaleConfig.defaultLocale = 'br';

const App = () => {
  const [selected, setSelected] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [modalDescriptionVisible, setModalDescriptionVisible] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [selectedDateId, setSelectedDateId] = useState(null); // Para armazenar o ID do documento no Firebase

  useEffect(() => {
    fetchDatesFromFirebase();
  }, []);

  const fetchDatesFromFirebase = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Dates'));
      const marked = {};
      querySnapshot.forEach(docSnapshot => {
        const {date, descricao} = docSnapshot.data();
        marked[date] = {
          marked: true, 
          selected: false, 
          customStyles: {
            container: {backgroundColor: 'green'}, 
            text: {color: 'white'}
          }, 
          descricao,
          id: docSnapshot.id // Armazena o ID do documento do Firebase
        };
      });
      setMarkedDates(marked);
    } catch (e) {
      console.error('Erro ao buscar as datas: ', e);
    }
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

  const saveDateToFirebase = async () => {
    try {
      const docRef = await addDoc(collection(db, 'Dates'), {
        date: selected,
        descricao: descricao
      });

      setMarkedDates({
        ...markedDates,
        [selected]: {
          marked: true, 
          customStyles: {container: {backgroundColor: 'green'}, text: {color: 'white'}}, 
          descricao,
          id: docRef.id 
        }
      });

      alert('Data cadastrada com sucesso!');
      setModalVisible(false);
      setDescricao('');
    } catch (e) {
      console.error("Erro ao salvar a data: ", e);
    }
  };

  const updateDescriptionInFirebase = async () => {
    try {
      const docRef = doc(db, 'Dates', selectedDateId);
      await updateDoc(docRef, {
        descricao: selectedDescription
      });

      setMarkedDates({
        ...markedDates,
        [selected]: {
          ...markedDates[selected],
          descricao: selectedDescription
        }
      });

      alert('Descrição atualizada com sucesso!');
      setModalDescriptionVisible(false);
    } catch (e) {
      console.error("Erro ao atualizar a descrição: ", e);
    }
    fetchDatesFromFirebase();
  };

  const deleteDateFromFirebase = async () => {
    try {
      const docRef = doc(db, 'Dates', selectedDateId);
      await deleteDoc(docRef);

      const updatedMarkedDates = {...markedDates};
      delete updatedMarkedDates[selected]; 

      setMarkedDates(updatedMarkedDates);
      alert('Data excluída com sucesso!');
      setModalDescriptionVisible(false);
    } catch (e) {
      console.error("Erro ao excluir a data: ", e);
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          height: 350,
          borderRadius: 20,
        }}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8'
        }}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        markingType={'custom'}
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
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Cadastrar Data</Text>
            <Text style={styles.label}>Data Selecionada: {selected}</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite a descrição"
              value={descricao}
              onChangeText={setDescricao}
            />

            <TouchableOpacity
              style={styles.buttonSave}
              onPress={saveDateToFirebase}
            >
              <Text style={styles.textStyle}>Salvar Data</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.buttonClose}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Fechar</Text>
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
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Descrição da Data</Text>

            <TextInput
              style={styles.input}
              placeholder="Edite a descrição"
              value={selectedDescription}
              onChangeText={setSelectedDescription}
            />

            <TouchableOpacity
              style={styles.buttonSave}
              onPress={updateDescriptionInFirebase}
            >
              <Text style={styles.textStyle}>Atualizar Descrição</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonDelete}
              onPress={deleteDateFromFirebase}
            >
              <Text style={styles.textStyle}>Excluir Data</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonClose}
              onPress={() => setModalDescriptionVisible(false)}
            >
              <Text style={styles.textStyle}>Fechar</Text>
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
    padding: 20,
    backgroundColor: '#badda8', // Fundo suave
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#badda8', // Escurece o fundo quando o modal está aberto
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff',
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
    backgroundColor: '#8AC66D', // Verde claro
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonDelete: {
    backgroundColor: '#2F5911', // Verde escuro
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#C7E8FD', // Azul claro
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
});

export default App;
