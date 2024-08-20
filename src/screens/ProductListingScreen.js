import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProductListingScreen({ navigation }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const storedProducts = JSON.parse(await AsyncStorage.getItem('products')) || [];
        setProducts(storedProducts);
    };

    const renderItem = ({ item }) => (
        <View style={styles.productContainer}>
            {item.images && item.images.length > 0 ? (
                <Image source={{ uri: item.images[0] }} style={styles.productImage} />
            ) : (
                <View style={styles.productImagePlaceholder}>
                    <Text style={styles.placeholderText}>No Image</Text>
                </View>
            )}
            <View style={styles.productDetails}>
                <View style={styles.textContainer}>
                    <Text style={styles.productTitle}>{item.name}</Text>
                    <Text style={styles.productDescription}>
                        {item.description.length > 20 ? item.description.slice(0, 20) + '...' : item.description}
                    </Text>
                    <Text style={styles.productWeight}>Weight: {item.weight}</Text>
                    <Text style={styles.productSKU}>SKU: {item.sku}</Text>
                </View>
                <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
                >
                    <Text style={styles.detailsButtonText}>View Details</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    productContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff',
        marginBottom: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: 80,
        height: 80,
        marginRight: 15,
        borderRadius: 10,
    },
    productImagePlaceholder: {
        width: 80,
        height: 80,
        marginRight: 15,
        borderRadius: 10,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#555',
        fontSize: 12,
    },
    productDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    textContainer: {
        flex: 1,
    },
    productTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: "#000",
    },
    productDescription: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    productWeight: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
    },
    productSKU: {
        fontSize: 14,
        color: '#777',
        marginBottom: 10,
    },
    detailsButton: {
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    detailsButtonText: {
        color: '#fff',
        fontSize: 14,
    },
});
