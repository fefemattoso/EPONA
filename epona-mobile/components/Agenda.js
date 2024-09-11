import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

function Agenda() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editEventIndex, setEditEventIndex] = useState(null);

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setNewEvent('');
    setIsEditing(false);
  };

  const handleAddOrEditEvent = () => {
    const dateKey = selectedDate.toDateString();

    if (isEditing && editEventIndex !== null) {
      const updatedEvents = { ...events };
      updatedEvents[dateKey][editEventIndex] = newEvent;
      setEvents(updatedEvents);
      setIsEditing(false);
      setNewEvent('');
    } else {
      if (newEvent) {
        setEvents((prevEvents) => ({
          ...prevEvents,
          [dateKey]: [...(prevEvents[dateKey] || []), newEvent],
        }));
        setNewEvent('');
      }
    }
  };

  const handleEditEvent = (index) => {
    const dateKey = selectedDate.toDateString();
    setNewEvent(events[dateKey][index]);
    setIsEditing(true);
    setEditEventIndex(index);
  };

  const handleDeleteEvent = (index) => {
    const dateKey = selectedDate.toDateString();
    const updatedEvents = { ...events };
    updatedEvents[dateKey].splice(index, 1);
    if (updatedEvents[dateKey].length === 0) {
      delete updatedEvents[dateKey];
    }
    setEvents(updatedEvents);
  };

  const renderCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInCurrentMonth = daysInMonth(month, year);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const calendarDays = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<View key={`empty-${i}`} style={styles.day}></View>);
    }

    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const isSelected = selectedDate.getDate() === day;
      const date = new Date(year, month, day);

      calendarDays.push(
        <TouchableOpacity
          key={day}
          style={[styles.day, isSelected && styles.selectedDay]}
          onPress={() => handleDateChange(date)}
        >
          <Text style={styles.dayText}>{day}</Text>
        </TouchableOpacity>
      );
    }

    return <View style={styles.calendarGrid}>{calendarDays}</View>;
  };

  const dateKey = selectedDate.toDateString();
  const dayEvents = events[dateKey] || [];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Agenda</Text>

      {/* Calendário customizado */}
      {renderCalendar()}

      {/* Campo para adicionar/editar eventos */}
      <View style={styles.eventForm}>
        <TextInput
          style={styles.input}
          placeholder={isEditing ? "Editar evento" : "Adicionar evento/lembrete"}
          value={newEvent}
          onChangeText={setNewEvent}
        />
        <Button
          title={isEditing ? 'Salvar' : 'Adicionar'}
          onPress={handleAddOrEditEvent}
          color="#162040"
        />
      </View>

      {/* Lista de eventos para o dia selecionado */}
      <Text style={styles.subheader}>Eventos para {dateKey}:</Text>
      {dayEvents.length > 0 ? (
        <FlatList
          data={dayEvents}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.eventItem}>
              <Text>{item}</Text>
              <View style={styles.eventButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditEvent(index)}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteEvent(index)}
                >
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <Text>Nenhum evento para este dia.</Text>
      )}
    </View>
  );
}

export default Agenda;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#badda8',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#162040',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
    color: '#ffffff',
    borderRadius: 20,
  },
  day: {
    width: '14.28%', // 7 columns (100% divided by 7)
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  selectedDay: {
    backgroundColor: '#83917c',
  },
  dayText: {
    fontSize: 16,
  },
  eventForm: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  subheader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#83917c',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  eventButtons: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 4,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#FF4D4D',
    padding: 5,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
  },
});
