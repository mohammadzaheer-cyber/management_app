import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ActionHistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    console.log(history);
  }, [history]);

  const fetchHistory = async () => {
    try {
      const storedHistory = JSON.parse(await AsyncStorage.getItem('actionHistory')) || [];
      setHistory(storedHistory);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text>{item.action}</Text>
            <Text>{formatTimestamp(item.timestamp)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  historyItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginBottom: 10,
  },
});
