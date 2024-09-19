import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Animated, Switch, ScrollView } from 'react-native';

export default function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [days, setDays] = useState([]);
  const [weekdays, setWeekdays] = useState(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);

  useEffect(() => {
    const getDaysInMonth = (month, year) => {
      const daysInMonth = [];
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);

      for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
        daysInMonth.push('');
      }

      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        daysInMonth.push(i);
      }

      return daysInMonth;
    };

    setDays(getDaysInMonth(currentMonth, currentYear));
  }, [currentMonth, currentYear]);

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.month}>{getMonthName(currentMonth)} {currentYear}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handlePreviousMonth}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextMonth}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.weekdaysContainer}>
        {weekdays.map((day, index) => (
          <Text key={index} style={styles.weekdayText}>{day}</Text>
        ))}
      </View>
      <FlatList
        data={days}
        renderItem={({ item, index }) => (
          <View style={styles.dayContainer}>
            {item ? (
              <Text style={styles.dayText}>{item}</Text>
            ) : (
              <View style={styles.emptyDay} />
            )}
          </View>
        )}
        numColumns={7}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const getMonthName = (month) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  month: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  weekdaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekdayText: {
    fontSize: 16,
    width: 30,
    textAlign: 'center',
  },
  dayContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  dayText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyDay: {
    width: 30,
    height: 30,
    backgroundColor: '#f0f0f0',
  },
});
