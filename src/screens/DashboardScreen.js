import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

export default function DashboardScreen({ navigation }) {
    const [categoriesCount, setCategoriesCount] = useState(0);
    const [productsCount, setProductsCount] = useState(0);
    const [lowInventoryCount, setLowInventoryCount] = useState(0);
    const [usersCount, setUsersCount] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    const fetchData = async () => {
        try {
            const categories = JSON.parse(await AsyncStorage.getItem('categories')) || [];
            const products = JSON.parse(await AsyncStorage.getItem('products')) || [];
            const users = JSON.parse(await AsyncStorage.getItem('users')) || [];

            setCategoriesCount(categories.length);
            setProductsCount(products.length);

            // Check for low inventory
            const lowInventoryProducts = products.filter(p => p.stock < 2);
            setLowInventoryCount(lowInventoryProducts.length);

            setUsersCount(users.length);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const renderInventoryStatus = (count) => {
        return count > 0 ? 'Low Inventory' : 'In Stock';
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userToken'); 
            navigation.navigate('Login');
        } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Logout Error', 'An error occurred while logging out.');
        }
    };

    const screenWidth = Dimensions.get("window").width;

    const chartConfig = {
        backgroundGradientFrom: "#DDA517",
        backgroundGradientFromOpacity: 1,
        backgroundGradientTo: "#B57A11",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(0,0,0,0.7)`,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false 
    };

    return (
        <View style={styles.container}>
            <View style={styles.chartContainer}>
                <LineChart
                    data={{
                        labels: ["Categories", "Products", "Users", "Inventory"],
                        datasets: [
                            {
                                data: [
                                   categoriesCount,
                                   productsCount,
                                   usersCount,
                                   lowInventoryCount
                                ]
                            }
                        ]
                    }}
                    width={screenWidth - 40} 
                    height={220}
                    yAxisInterval={1}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.navigate('Category')}
                >
                    <Text style={styles.buttonText}>Manage Categories</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.navigate('Product')}
                >
                    <Text style={styles.buttonText}>Manage Products</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.navigate('History')}
                >
                    <Text style={styles.buttonText}>View History</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.navigate('ProductListing')}
                >
                    <Text style={styles.buttonText}>Product Listing</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleLogout}
                >
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffff'
    },
    chartContainer: {
        width: '100%',
        alignItems: 'center',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16
    },
    buttonContainer: {
        marginTop: 20,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    button: {
        backgroundColor: '#DDA517',
        padding: 15,
        borderRadius: 8,
        marginVertical: 10,
        marginHorizontal: 5,
        alignItems: 'center',
        width: '30%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
