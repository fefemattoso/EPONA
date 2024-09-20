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

  // Função para buscar datas salvas no Firebase e marcar no calendário
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
      // Exibir o modal com a descrição da data cadastrada
      setSelectedDescription(markedDates[dayKey].descricao);
      setSelectedDateId(markedDates[dayKey].id); // Armazena o ID do documento
      setModalDescriptionVisible(true);
    } else {
      // Abrir modal para adicionar nova descrição
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

      // Atualizar a data marcada com cor diferenciada
      setMarkedDates({
        ...markedDates,
        [selected]: {
          marked: true, 
          customStyles: {container: {backgroundColor: 'green'}, text: {color: 'white'}}, 
          descricao,
          id: docRef.id // Salva o ID do documento no estado
        }
      });

      alert('Data cadastrada com sucesso!');
      setModalVisible(false);
      setDescricao('');
    } catch (e) {
      console.error("Erro ao salvar a data: ", e);
    }
  };

  // Função para editar a descrição da data no Firebase
  const updateDescriptionInFirebase = async () => {
    try {
      const docRef = doc(db, 'Dates', selectedDateId);
      await updateDoc(docRef, {
        descricao: selectedDescription
      });

      // Atualizar a descrição no estado
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

  // Função para excluir a data do Firebase e do calendário
  const deleteDateFromFirebase = async () => {
    try {
      const docRef = doc(db, 'Dates', selectedDateId);
      await deleteDoc(docRef);

      const updatedMarkedDates = {...markedDates};
      delete updatedMarkedDates[selected]; // Remove a data do estado local

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

            <Button
              title="Salvar Data"
              onPress={saveDateToFirebase}
              color="#9370db"
            />
            
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
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

            {/* Campo para editar a descrição */}
            <TextInput
              style={styles.input}
              placeholder="Edite a descrição"
              value={selectedDescription}
              onChangeText={setSelectedDescription}
            />

            {/* Botão para salvar a nova descrição */}
            <Button
              title="Atualizar Descrição"
              onPress={updateDescriptionInFirebase}
              color="#9370db"
            />

            {/* Botão para excluir a data */}
            <Button
              title="Excluir Data"
              onPress={deleteDateFromFirebase}
              color="#ff6347"
            />

            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
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
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: 200,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  buttonClose: {
    backgroundColor: '#ff6347',
    marginTop: 10,
  },
  textStyle: {
    color: 'white',
    padding: 10,
  }
});

export default App;
