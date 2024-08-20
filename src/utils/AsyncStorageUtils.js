import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveActionHistory = async (action) => {
  const history = JSON.parse(await AsyncStorage.getItem('actionHistory')) || [];
  history.push({ id: Date.now().toString(), action, timestamp: new Date().toISOString() });
  await AsyncStorage.setItem('actionHistory', JSON.stringify(history));
};
