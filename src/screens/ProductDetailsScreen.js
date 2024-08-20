import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');
const sliderHeight = 300;

export default function ProductDetailsScreen({ route, navigation }) {
    const { productId } = route.params;
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetchProductDetails();
    }, []);

    const fetchProductDetails = async () => {
        try {
            const products = JSON.parse(await AsyncStorage.getItem('products')) || [];
            const selectedProduct = products.find(p => p.id === productId);
            setProduct(selectedProduct);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    if (!product) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    const renderImage = ({ item }) => (
        <Image source={{ uri: item }} style={styles.productImage} />
    );

    return (
        <View style={styles.container}>
            {product.images && product.images.length > 0 ? (
                <FlatList
                    data={product.images}
                    renderItem={renderImage}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    decelerationRate="fast"
                    snapToAlignment="center"
                    contentContainerStyle={styles.sliderContentContainer} 
                />
            ) : (
                <View style={styles.productImagePlaceholder}>
                    <Text>No Image</Text>
                </View>
            )}
            <View style={styles.detailsContainer}>
                <Text style={styles.productTitle}>{product.name}</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
                <Text style={styles.productWeight}>Weight: {product.weight}</Text>
                <Text style={styles.productSKU}>SKU: {product.sku}</Text>
                <Text style={styles.productAdditionalInfo}>Additional Info: {product.additionalInfo || 'N/A'}</Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>Back to List</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    productImage: {
        width: screenWidth,
        height: sliderHeight,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    productImagePlaceholder: {
        width: screenWidth,
        height: sliderHeight,
        borderRadius: 10,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderContentContainer: {
        alignItems: 'center',
    },
    detailsContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    productTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    productDescription: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    productWeight: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    productSKU: {
        fontSize: 16,
        color: '#555',
        marginBottom: 15,
    },
    productAdditionalInfo: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
