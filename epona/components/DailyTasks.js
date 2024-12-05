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

export default function DailyTasks({ isDarkMode }) {
  const [nomeItem, setNomeItem] = useState('');
  const [descItem, setDescItem] = useState('');
  const [Items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [xp, setXp] = useState(0);

  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  const adicionarOuAtualizarItem = async () => {
    setLoading(true);
    try {
      if (editingItemId) {
        const ItemRef = doc(db, 'Tasks', editingItemId);
        await updateDoc(ItemRef, { nome: nomeItem, descricao: descItem });
        setEditingItemId(null);
      } else {
        await addDoc(collection(db, 'Tasks'), { nome: nomeItem, descricao: descItem });
      }
      setNomeItem('');
      setDescItem('');
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

  const editarItem = item => {
    setNomeItem(item.nome);
    setDescItem(item.descricao);
    setEditingItemId(item.id);
  };

  const excluirItem = async itemId => {
    await deleteDoc(doc(db, 'Tasks', itemId));
    fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <ScrollView style={themeStyles.container}>
      <Text style={themeStyles.title}>Tarefas Diárias</Text>
      <Text style={themeStyles.xp}>XP: {xp}</Text>

      <Text style={themeStyles.label}>Nome da Tarefa</Text>
      <TextInput
        style={themeStyles.input}
        placeholder="Digite o nome da tarefa"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        value={nomeItem}
        onChangeText={setNomeItem}
      />

      <Text style={themeStyles.label}>Descrição</Text>
      <TextInput
        style={[themeStyles.input, themeStyles.textArea]}
        placeholder="Digite a descrição da tarefa"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        value={descItem}
        onChangeText={setDescItem}
        multiline
      />

      <TouchableOpacity
        style={[themeStyles.button, loading && themeStyles.buttonDisabled]}
        onPress={adicionarOuAtualizarItem}
        disabled={loading}
      >
        <Text style={themeStyles.buttonText}>
          {loading ? 'Salvando...' : editingItemId ? 'Atualizar Tarefa' : 'Adicionar Tarefa'}
        </Text>
      </TouchableOpacity>

      <Text style={themeStyles.sectionTitle}>Lista de Tarefas</Text>

      <Animated.View style={{ opacity: fadeAnim }}>
        <FlatList
          data={Items}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={themeStyles.item}>
              <View style={themeStyles.itemContent}>
                <Text style={themeStyles.itemTitle}>{item.nome}</Text>
                <Text style={themeStyles.itemDesc}>{item.descricao}</Text>
                <TouchableOpacity
                  onPress={() => editarItem(item)}
                  style={themeStyles.editButton}
                >
                  <Text style={themeStyles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => excluirItem(item.id)}
                  style={themeStyles.deleteButton}
                >
                  <Text style={themeStyles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </Animated.View>
    </ScrollView>
  );
}

const lightStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff8dd', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#162040', textAlign: 'center' },
  xp: { fontSize: 18, color: '#162040', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, color: '#2f5911', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderColor: '#e3dab6', borderWidth: 1, borderRadius: 15, padding: 10, marginBottom: 15 },
  button: { backgroundColor: '#162040', borderRadius: 15, paddingVertical: 12, alignItems: 'center', marginBottom: 20 },
  buttonDisabled: { backgroundColor: '#666' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#162040', marginBottom: 10 },
  item: { backgroundColor: '#C7E8FD', padding: 15, borderRadius: 8, marginBottom: 10 },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 20, fontWeight: 'bold', color: '#162040' },
  itemDesc: { fontSize: 14, color: '#547699', marginBottom: 5 },
  editButton: { backgroundColor: '#62a084', padding: 5, borderRadius: 5 },
  deleteButton: { backgroundColor: '#d9534f', padding: 5, borderRadius: 5, marginTop: 5 },
  editButtonText: { color: '#fff', fontSize: 14 },
  deleteButtonText: { color: '#fff', fontSize: 14 },
});

const darkStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e3d31', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  xp: { fontSize: 18, color: '#aaa', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, color: '#aaa', marginBottom: 8 },
  input: { backgroundColor: '#333', borderColor: '#555', borderWidth: 1, borderRadius: 15, padding: 10, marginBottom: 15 },
  button: { backgroundColor: '#1e88e5', borderRadius: 15, paddingVertical: 12, alignItems: 'center', marginBottom: 20 },
  buttonDisabled: { backgroundColor: '#444' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  item: { backgroundColor: '#333', padding: 15, borderRadius: 8, marginBottom: 10 },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  itemDesc: { fontSize: 14, color: '#ccc', marginBottom: 5 },
  editButton: { backgroundColor: '#62a084', padding: 5, borderRadius: 5 },
  deleteButton: { backgroundColor: '#d9534f', padding: 5, borderRadius: 5, marginTop: 5 },
  editButtonText: { color: '#fff', fontSize: 14 },
  deleteButtonText: { color: '#fff', fontSize: 14 },
});
