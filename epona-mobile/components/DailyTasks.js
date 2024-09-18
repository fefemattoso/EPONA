import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Animated, Switch, ScrollView } from 'react-native';
import { db, storage } from '../firebaseconfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';

export default function App() {
  const [nomeItem, setnomeItem] = useState('');
  const [descItem, setDescItem] = useState('');
  const [Items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [isRead, setIsRead] = useState(false);


  const adicionarOuAtualizarItem = async () => {
    try {
      setLoading(true);

      if (editingItemId) {
        const ItemRef = doc(db, 'Tasks', editingItemId);
        await updateDoc(ItemRef, {
          nome: nomeItem,
          descricao: descItem,
          isRead: isRead,
        });
        alert('Item atualizado com sucesso!');
        setEditingItemId(null);
      } else {
        await addDoc(collection(db, 'Tasks'), {
          nome: nomeItem,
          descricao: descItem,
          isRead: isRead,
        });
        alert('Item adicionado com sucesso!');
      }

      setnomeItem('');
      setDescItem('');
      setIsRead(false);
      fetchItems();
    } catch (e) {
      console.error("Erro ao salvar Item: ", e);
    } finally {
      setLoading(false);
    }
  };


  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Tasks'));
      const ItemsList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setItems(ItemsList);
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
    } catch (e) {
      console.error("Erro ao buscar Items: ", e);
    }
  };

  const editarItem = (Item) => {
    setnomeItem(Item.nome);
    setDescItem(Item.descricao);
    setIsRead(Item.isRead); // Update the isRead state
    setEditingItemId(Item.id);
  };
  const excluirItem = async (ItemId) => {
    try {
      await deleteDoc(doc(db, 'Tasks', ItemId));
      alert('Item excluído com sucesso!');
      fetchItems();
    } catch (e) {
      console.error("Erro ao excluir Item: ", e);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lista</Text>

      <Text style={styles.label}>Nome do Item</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do Item"
        value={nomeItem}
        onChangeText={setnomeItem}
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a Descrição da Atividader"
        value={descItem}
        onChangeText={setDescItem}
      />

      <Button
        title={loading ? "Salvando..." : editingItemId ? "Atualizar Item" : "Adicionar Item"}
        onPress={adicionarOuAtualizarItem}
        color="#9370db"
      />

      <Text style={styles.sectionTitle}>Lista</Text>

      <Animated.View style={{ opacity: fadeAnim }}>
        <FlatList
          data={Items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemItem}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.nome}</Text>
                <Text style={styles.itemDesc}>{item.descricao}</Text>
                <Switch
                  value={item.isRead} onValueChange={(valor) => {
                    const ItemRef = doc(db, 'Tasks', item.id);
                    updateDoc(ItemRef, { isRead: valor });
                    fetchItems();
                  }}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={item.isRead ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                />
                <Text style={[styles.itemStatus, { color: item.isRead ? '#4CAF50' : '#F44336' }]}>
                  {item.isRead ? "Check" : "Uncheck"}
                </Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => editarItem(item)} style={styles.actionButton}>
                  <Icon name="edit" size={25} color="#8a2be2" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => excluirItem(item.id)} style={styles.actionButton}>
                  <Icon name="trash" size={25} color="#ff6347" />
                </TouchableOpacity>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  itemItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDesc: {
    fontSize: 14,
    color: '#666',
  },
  itemStatus: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 10,
  },
});

