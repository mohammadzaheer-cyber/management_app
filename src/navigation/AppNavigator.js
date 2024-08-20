import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CategoryScreen from '../screens/CategoryScreen';
import ProductScreen from '../screens/ProductScreen';
import ActionHistoryScreen from '../screens/ActionHistoryScreen';
import ProductListingScreen from '../screens/ProductListingScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedInUser = await AsyncStorage.getItem('loggedInUser');
      if (loggedInUser) {
        setIsLoggedIn(true);
      }
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return <View style={styles.loader}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Dashboard' : 'Login'}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="Product" component={ProductScreen} />
        <Stack.Screen name="History" component={ActionHistoryScreen} />
        <Stack.Screen name="ProductListing" component={ProductListingScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
