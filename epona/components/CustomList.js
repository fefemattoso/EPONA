import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Animated, Switch, ScrollView } from 'react-native';
import { db } from '../firebaseconfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function CustomList() {
  const [nomeItem, setnomeItem] = useState('');
  const [Items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [isRead, setIsRead] = useState(false);

  const adicionarOuAtualizarItem = async () => {
    try {
      setLoading(true);

      if (editingItemId) {
        const ItemRef = doc(db, 'Items', editingItemId);
        await updateDoc(ItemRef, {
          nome: nomeItem,
          isRead: isRead,
        });
        alert('Item atualizado com sucesso!');
        setEditingItemId(null);
      } else {
        await addDoc(collection(db, 'Items'), {
          nome: nomeItem,
          isRead: isRead,
        });
        alert('Item adicionado com sucesso!');
      }

      setnomeItem('');
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
      const querySnapshot = await getDocs(collection(db, 'Items'));
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
    setIsRead(Item.isRead); 
    setEditingItemId(Item.id);
  };

  const excluirItem = async (ItemId) => {
    try {
      await deleteDoc(doc(db, 'Items', ItemId));
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
      <Text style={styles.title}>Lista Personalizada</Text>

      <Text style={styles.label}>Nome do Item</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do Item"
        value={nomeItem}
        onChangeText={setnomeItem}
      />

      <Button
        title={loading ? "Salvando..." : editingItemId ? "Atualizar Item" : "Adicionar Item"}
        onPress={adicionarOuAtualizarItem}
        color="#162040"
      />

      <Text style={styles.sectionTitle}>Itens</Text>

      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
  <FlatList
    data={Items}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View style={styles.itemContainer}>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.nome}</Text>
          <Switch
            value={item.isRead}
            onValueChange={(valor) => {
              const ItemRef = doc(db, 'Items', item.id);
              updateDoc(ItemRef, { isRead: valor });
              fetchItems();
            }}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={item.isRead ? "#4CAF50" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
          />
          <Text style={[styles.itemStatus, { color: item.isRead ? '#4CAF50' : '#F44336' }]}>
            {item.isRead ? "Concluído" : "Pendente"}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => editarItem(item)} style={styles.actionButton}>
            <Icon name="edit" size={25} color="#547699" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => excluirItem(item.id)} style={styles.actionButton}>
            <Icon name="trash" size={25} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
    )}
    // Adicionando um Footer para criar espaço no final
    ListFooterComponent={<View style={{ height: 30 }} />} 
    contentContainerStyle={{ paddingBottom: 20 }} // Espaço adicional para garantir visibilidade
  />
</Animated.View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#badda8',
    padding: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#162040',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#2F5911',
    marginBottom: 10,
  },
  input: {
    borderColor: '#547699',
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#162040',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#162040',
  },
  itemStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    marginHorizontal: 5,
  },
});
