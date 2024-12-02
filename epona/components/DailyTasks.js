import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Animated, Switch, ScrollView } from 'react-native';
import { db } from '../firebaseconfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function DailyTasks() {
  const [nomeItem, setNomeItem] = useState('');
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
        alert('Tarefa atualizada com sucesso!');
        setEditingItemId(null);
      } else {
        await addDoc(collection(db, 'Tasks'), {
          nome: nomeItem,
          descricao: descItem,
          isRead: isRead,
        });
        alert('Tarefa adicionada com sucesso!');
      }

      setNomeItem('');
      setDescItem('');
      setIsRead(false);
      fetchItems();
    } catch (e) {
      console.error("Erro ao salvar Tarefa: ", e);
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
      console.error("Erro ao buscar Tarefas: ", e);
    }
  };

  const editarItem = (Item) => {
    setNomeItem(Item.nome);
    setDescItem(Item.descricao);
    setIsRead(Item.isRead);
    setEditingItemId(Item.id);
  };

  const excluirItem = async (ItemId) => {
    try {
      await deleteDoc(doc(db, 'Tasks', ItemId));
      alert('Tarefa excluída com sucesso!');
      fetchItems();
    } catch (e) {
      console.error("Erro ao excluir Tarefa: ", e);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tarefas Diárias</Text>

      <Text style={styles.label}>Nome da Tarefa</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome da tarefa"
        value={nomeItem}
        onChangeText={setNomeItem}
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a descrição da tarefa"
        value={descItem}
        onChangeText={setDescItem}
        multiline={true}
        numberOfLines={4}
      />

      <Button
        title={loading ? "Salvando..." : editingItemId ? "Atualizar Tarefa" : "Adicionar Tarefa"}
        onPress={adicionarOuAtualizarItem}
        color="#162040"
      />

      <Text style={styles.sectionTitle}>Lista de Tarefas</Text>

      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
  <FlatList
    data={Items}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View style={styles.itemTask}>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.nome}</Text>
          <Text style={styles.itemDesc}>{item.descricao}</Text>
          <Switch
            value={item.isRead}
            onValueChange={(valor) => {
              const ItemRef = doc(db, 'Tasks', item.id);
              updateDoc(ItemRef, { isRead: valor });
              fetchItems();
            }}
            trackColor={{ false: "#C0C0C0", true: "#48D1CC" }}
            thumbColor={item.isRead ? "#FFD700" : "#FFF"}
            ios_backgroundColor="#c7e8fd"
          />
          <Text style={[styles.itemStatus, { color: item.isRead ? '#32CD32' : '#FF4500' }]}>
            {item.isRead ? "Concluída" : "Pendente"}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => editarItem(item)} style={styles.actionButton}>
            <Icon name="edit" size={25} color="#4169E1" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => excluirItem(item.id)} style={styles.actionButton}>
            <Icon name="trash" size={25} color="#FF4500" />
          </TouchableOpacity>
        </View>
      </View>
    )}
    // Adicionando um Footer para garantir espaço extra no final
    ListFooterComponent={<View style={{ height: 30 }} />}
    contentContainerStyle={{ paddingBottom: 30 }} // Garantir que o último item não seja cortado
  />
</Animated.View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#badda8',
    padding: 40,
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
    color: '#2f5911',
    marginBottom: 8,
  },
  input: {
    borderColor: '#4682B4',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#162040',
    marginBottom: 12,
  },
  itemTask: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C7E8FD', // Cor de fundo alterada
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderColor: '#547699', // Cor da borda alterada
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#162040', // Cor do texto mais escura
  },
  itemDesc: {
    fontSize: 16,
    color: '#547699', // Cor da descrição mais suave
    marginBottom: 8,
  },
  itemStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    marginHorizontal: 8,
  },
});
