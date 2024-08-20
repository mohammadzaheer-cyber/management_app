import AsyncStorage from '@react-native-async-storage/async-storage';

const trackAction = async (user, action) => {
  try {
    const existingHistory = JSON.parse(await AsyncStorage.getItem('actionHistory')) || [];
    
    const newAction = {
      id: Date.now().toString(),
      userId: user.id, 
      userName: user.name,
      action,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...existingHistory, newAction];
    
    await AsyncStorage.setItem('actionHistory', JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error tracking action:', error);
  }
};

export default trackAction;
