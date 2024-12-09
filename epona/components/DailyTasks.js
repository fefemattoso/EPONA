import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Animated,
  Switch,
  ScrollView,
  Modal,
} from 'react-native';
import { db } from '../firebaseconfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Importar autenticação
import Icon from 'react-native-vector-icons/FontAwesome';

export default function DailyTasks({ isDarkMode }) {
  const [nomeItem, setNomeItem] = useState('');
  const [descItem, setDescItem] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [isRead, setIsRead] = useState(false);
  const [xp, setXp] = useState(0);
  const [taskCompletionLog, setTaskCompletionLog] = useState({});
  const [showActions, setShowActions] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const auth = getAuth(); // Instância da autenticação
  const user = auth.currentUser; // Usuário autenticado

  // Adicionar ou atualizar tarefa
  const adicionarOuAtualizarItem = async () => {
    if (!nomeItem.trim() || !descItem.trim()) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (!user) {
      alert('Usuário não autenticado.');
      return;
    }

    setLoading(true);
    try {
      if (editingItemId) {
        const itemRef = doc(db, 'Tasks', editingItemId);
        await updateDoc(itemRef, {
          nome: nomeItem,
          descricao: descItem,
          isRead,
          uid: user.uid,
        });
        setEditingItemId(null);
      } else {
        await addDoc(collection(db, 'Tasks'), {
          nome: nomeItem,
          descricao: descItem,
          isRead,
          uid: user.uid,
        });
      }
      setNomeItem('');
      setDescItem('');
      setIsRead(false);
      fetchItems();
    } finally {
      setLoading(false);
    }
  };

  // Buscar tarefas do banco de dados
  const fetchItems = async () => {
    if (!user) {
      alert('Usuário não autenticado.');
      return;
    }

    setLoading(true);
    try {
      const q = query(collection(db, 'Tasks'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const itemsList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      setItems(itemsList);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } finally {
      setLoading(false);
    }
  };

  // Atualizar estado da tarefa
  const handleTaskCompletion = async (item, valor) => {
    const today = new Date().toISOString().split('T')[0];
    const taskLog = taskCompletionLog[item.id] || {};

    if (valor && (!taskLog[today] || !taskLog[today])) {
      setXp(prevXp => prevXp + 15);
      setTaskCompletionLog({
        ...taskCompletionLog,
        [item.id]: { ...taskLog, [today]: true },
      });
    } else if (!valor) {
      setTaskCompletionLog({
        ...taskCompletionLog,
        [item.id]: { ...taskLog, [today]: false },
      });
    }

    const itemRef = doc(db, 'Tasks', item.id);
    await updateDoc(itemRef, { isRead: valor });
    fetchItems();
  };

  // Editar tarefa
  const editarItem = item => {
    setNomeItem(item.nome);
    setDescItem(item.descricao);
    setIsRead(item.isRead);
    setEditingItemId(item.id);
  };

  // Confirmar exclusão
  const confirmarExclusao = itemId => {
    setItemToDelete(itemId);
    setModalVisible(true);
  };

  // Excluir tarefa
  const excluirItem = async () => {
    if (!user) {
      alert('Usuário não autenticado.');
      return;
    }

    if (itemToDelete) {
      const itemRef = doc(db, 'Tasks', itemToDelete);
      await deleteDoc(itemRef);
      fetchItems();
    }
    setModalVisible(false);
    setItemToDelete(null);
  };

  // Alternar visibilidade do menu de ações
  const toggleActions = itemId => {
    setShowActions(showActions === itemId ? null : itemId);
  };

  // Buscar tarefas ao carregar o componente
  useEffect(() => {
    fetchItems();
  }, []);
  // Cores para tema claro e escuro
  const colors = isDarkMode
    ? {
        background: '#1e3d31',
        text: '#FFFFFF',
        card: '#1E1E1E',
        border: '#333333',
        button: '#ffc4c7',
        buttonText: '#000000',
        switchTrack: '#666666',
        switchThumb: '#ffc4c7',
        modalBackground: '#1E1E1E',
        modalText: '#FFFFFF',
      }
    : {
        background: '#fff8dd',
        text: '#1e3d31',
        card: '#addaff',
        border: '#e3dab6',
        button: '#255140',
        buttonText: '#FFFFFF',
        switchTrack: '#dcdcdc',
        switchThumb: '#FFD700',
        modalBackground: '#FFFFFF',
        modalText: '#000000',
      };

  const styles = getStyles(colors);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tarefas Diárias</Text>
      <Text style={styles.xp}>XP: {xp}</Text>

      {/* Inputs */}
      <Text style={styles.label}>Nome da Tarefa</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome da tarefa"
        placeholderTextColor={colors.text}
        value={nomeItem}
        onChangeText={setNomeItem}
      />
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Digite a descrição da tarefa"
        placeholderTextColor={colors.text}
        value={descItem}
        onChangeText={setDescItem}
        multiline
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={adicionarOuAtualizarItem}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Salvando...' : editingItemId ? 'Atualizar Tarefa' : 'Adicionar Tarefa'}
        </Text>
      </TouchableOpacity>

      {/* Lista de Tarefas */}
      <Text style={styles.sectionTitle}>Lista de Tarefas</Text>
      <Animated.View style={{ opacity: fadeAnim }}>
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.nome}</Text>
                <Text style={styles.itemDesc}>{item.descricao}</Text>
                <Switch
                  value={item.isRead}
                  onValueChange={valor => handleTaskCompletion(item, valor)}
                  trackColor={{ false: colors.switchTrack, true: colors.switchThumb }}
                  thumbColor={item.isRead ? colors.switchThumb : colors.text}
                  ios_backgroundColor={colors.border}
                />
                <Text style={styles.itemStatus}>
                  {item.isRead ? 'Concluída' : 'Pendente'}
                </Text>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity onPress={() => toggleActions(item.id)}>
                  <Icon name="ellipsis-v" size={20} color={colors.text} />
                </TouchableOpacity>
                {showActions === item.id && (
                  <View style={styles.actionsMenu}>
                    <TouchableOpacity onPress={() => editarItem(item)}>
                      <Icon name="edit" size={20} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => confirmarExclusao(item.id)}>
                      <Icon name="trash" size={20} color="#FF4500" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
        />
      </Animated.View>

      {/* Modal de Confirmação */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Tem certeza que deseja excluir esta tarefa?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={excluirItem}
              >
                <Text style={styles.modalButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const getStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
    },
    xp: {
      textAlign: 'center',
      fontSize: 18,
      color: colors.text,
    },
    label: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 15,
      padding: 10,
      backgroundColor: 'white',
      marginBottom: 15,
      height: 40,
      color: colors.text,
    },
    button: {
      backgroundColor: colors.button,
      borderRadius: 15,
      paddingVertical: 12,
      alignItems: 'center',
      marginBottom: 10,
    },
    buttonText: {
      color: colors.buttonText,
      fontWeight: 'bold',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 10,
    },
    item: {
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemContent: {
      flex: 1,
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    itemDesc: {
      fontSize: 14,
      color: colors.text,
      marginTop: 5,
    },
    itemStatus: {
      fontSize: 12,
      color: colors.text,
      marginTop: 5,
    },
    itemActions: {
      marginLeft: 10,
      alignItems: 'flex-end',
    },
    actionsMenu: {
      marginTop: 10,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: colors.modalBackground,
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    modalText: {
      color: colors.modalText,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    modalButton: {
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    modalButtonCancel: {
      backgroundColor: '#B0B0B0',
    },
    modalButtonConfirm: {
      backgroundColor: '#FF4500',
    },
    modalButtonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
  });
