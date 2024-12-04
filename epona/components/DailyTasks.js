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
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function DailyTasks() {
  const [nomeItem, setNomeItem] = useState('');
  const [descItem, setDescItem] = useState('');
  const [Items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [isRead, setIsRead] = useState(false);
  const [xp, setXp] = useState(0);
  const [taskCompletionLog, setTaskCompletionLog] = useState({});
  const [showActions, setShowActions] = useState(null);  // Estado para mostrar ações

  const adicionarOuAtualizarItem = async () => {
    setLoading(true);
    try {
      if (editingItemId) {
        const ItemRef = doc(db, 'Tasks', editingItemId);
        await updateDoc(ItemRef, { nome: nomeItem, descricao: descItem, isRead });
        setEditingItemId(null);
      } else {
        await addDoc(collection(db, 'Tasks'), { nome: nomeItem, descricao: descItem, isRead });
      }
      setNomeItem('');
      setDescItem('');
      setIsRead(false);
      fetchItems();
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, 'Tasks'));
    const ItemsList = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));
    setItems(ItemsList);
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  };

  const handleTaskCompletion = async (item, valor) => {
    const today = new Date().toISOString().split('T')[0];
    const taskLog = taskCompletionLog[item.id] || {};

    if (valor && (!taskLog[today] || taskLog[today] === false)) {
      setXp(xp + 15);
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

    const ItemRef = doc(db, 'Tasks', item.id);
    await updateDoc(ItemRef, { isRead: valor });
    fetchItems();
  };

  const editarItem = item => {
    setNomeItem(item.nome);
    setDescItem(item.descricao);
    setIsRead(item.isRead);
    setEditingItemId(item.id);
  };

  const excluirItem = async itemId => {
    await deleteDoc(doc(db, 'Tasks', itemId));
    fetchItems();
  };

  const toggleActions = (itemId) => {
    setShowActions(showActions === itemId ? null : itemId);  // Alterna a visibilidade das ações
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tarefas Diárias</Text>
      <Text style={styles.xp}>XP: {xp}</Text>

      <Text style={styles.label}>Nome da Tarefa</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome da tarefa"
        value={nomeItem}
        onChangeText={setNomeItem}
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Digite a descrição da tarefa"
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

      <Text style={styles.sectionTitle}>Lista de Tarefas</Text>

      <Animated.View style={{ opacity: fadeAnim }}>
        <FlatList
          data={Items}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.nome}</Text>
                <Text style={styles.itemDesc}>{item.descricao}</Text>
                <Switch
                  value={item.isRead}
                  onValueChange={valor => handleTaskCompletion(item, valor)}
                  trackColor={{ false: '#dcdcdc', true: '#48D1CC' }}
                  thumbColor={item.isRead ? '#FFD700' : '#FFF'}
                  ios_backgroundColor="#c7e8fd"
                />
                <Text
                  style={[
                    styles.itemStatus,
                    { color: item.isRead ? '#32CD32' : '#FF4500' },
                  ]}
                >
                  {item.isRead ? 'Concluída' : 'Pendente'}
                </Text>
              </View>
              
              <View style={styles.itemActions}>
                <TouchableOpacity onPress={() => toggleActions(item.id)}>
                  <Icon name="ellipsis-v" size={20} color="#4169E1" />
                </TouchableOpacity>
                {showActions === item.id && ( // Exibe as ações apenas se o item corresponder
                  <View style={styles.actionsMenu}>
                    <TouchableOpacity onPress={() => editarItem(item)}>
                      <Icon name="edit" size={20} color="#4169E1" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => excluirItem(item.id)}>
                      <Icon name="trash" size={20} color="#FF4500" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
        />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8dd',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#162040',
    textAlign: 'center',
    marginBottom: 10,
  },
  xp: {
    fontSize: 18,
    color: '#162040',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#2f5911',
    marginBottom: 8,
  },
  input: {
    borderColor: '#e3dab6',
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
    height: 40,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#162040',
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#162040',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#C7E8FD',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#162040',
  },
  itemDesc: {
    fontSize: 14,
    color: '#547699',
    marginBottom: 5,
  },
  itemStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionsMenu: {
    backgroundColor: 'white',
    position: 'absolute',
    right: 0,
    top: 30,
    borderRadius: 5,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  
});
