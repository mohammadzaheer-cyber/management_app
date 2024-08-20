import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import { Picker } from '@react-native-picker/picker';
import trackAction from '../utils/trackAction'; 

export default function ProductScreen() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productSKU, setProductSKU] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [productWeight, setProductWeight] = useState('');
    const [productDimensions, setProductDimensions] = useState('');
    const [productImages, setProductImages] = useState([]);
    const [productCategory, setProductCategory] = useState('');
    const [editingProductId, setEditingProductId] = useState(null);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const fetchCategories = async () => {
        const storedCategories = JSON.parse(await AsyncStorage.getItem('categories')) || [];
        setCategories(storedCategories);
    };

    const fetchProducts = async () => {
        const storedProducts = JSON.parse(await AsyncStorage.getItem('products')) || [];
        setProducts(storedProducts);
    };

    const validateFields = () => {
        if (!productName || !productDescription || !productSKU || !productQuantity || !productWeight || !productDimensions || !productCategory) {
            Alert.alert('Validation Error', 'Please fill in all required fields.');
            return false;
        }
        return true;
    };

    const addProduct = async () => {
        if (!validateFields()) return;

        if (editingProductId) {
            const updatedProducts = products.map((product) =>
                product.id === editingProductId
                    ? {
                        id: editingProductId,
                        name: productName,
                        description: productDescription,
                        sku: productSKU,
                        quantity: productQuantity,
                        weight: productWeight,
                        dimensions: productDimensions,
                        images: productImages,
                        category: productCategory,
                    }
                    : product
            );
            setProducts(updatedProducts);
            await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
            trackAction('Updated Product: ' + productName); 
            setEditingProductId(null);
        } else {
            const newProduct = {
                id: Date.now().toString(),
                name: productName,
                description: productDescription,
                sku: productSKU,
                quantity: productQuantity,
                weight: productWeight,
                dimensions: productDimensions,
                images: productImages,
                category: productCategory,
            };
            const updatedProducts = [...products, newProduct];
            setProducts(updatedProducts);
            await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
            trackAction('Added Product: ' + productName); 
        }
        resetForm();
    };

    const deleteProduct = async (id) => {
        const updatedProducts = products.filter((product) => product.id !== id);
        setProducts(updatedProducts);
        await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
        trackAction('Deleted Product with ID: ' + id); 
    };

    const pickImage = () => {
        Alert.alert(
            'Select Images',
            'Choose from gallery or take photos',
            [
                {
                    text: 'Choose from Gallery',
                    onPress: () => {
                        ImagePicker.openPicker({
                            multiple: true,
                            mediaType: 'photo',
                            cropping: true,
                            cropperToolbarTitle: 'Edit Image', 
                            cropperActiveWidgetColor: '#ff0000', 
                            cropperStatusBarColor: '#000000', 
                            cropperToolbarColor: '#ffffff',
                        }).then(images => {
                            if (Array.isArray(images)) {
                                const uris = images.map(image => image.path);
                                setProductImages(prevImages => [...prevImages, ...uris]);
                                trackAction('Picked images from gallery');
                            } else {
                                const uri = images.path;
                                setProductImages(prevImages => [...prevImages, uri]);
                                trackAction('Picked a single image from gallery');
                            }
                        }).catch(error => {
                            if (error.code !== 'E_PICKER_CANCELLED') {
                                console.error('Image selection error: ', error);
                            }
                        });
                    }
                },
                {
                    text: 'Take Photos',
                    onPress: () => {
                        ImagePicker.openCamera({
                            multiple: true,
                            mediaType: 'photo',
                            cropping: true,
                            cropperToolbarTitle: 'Edit Image',
                            cropperActiveWidgetColor: '#ff0000',
                            cropperStatusBarColor: '#000000',
                            cropperToolbarColor: '#ffffff',
                        }).then(images => {
                            if (Array.isArray(images)) {
                                const uris = images.map(image => image.path);
                                setProductImages(prevImages => [...prevImages, ...uris]);
                                trackAction('Took multiple photos');
                            } else {
                                const uri = images.path;
                                setProductImages(prevImages => [...prevImages, uri]);
                                trackAction('Took a single photo');
                            }
                        }).catch(error => {
                            if (error.code !== 'E_PICKER_CANCELLED') {
                                console.error('Camera error: ', error);
                            }
                        });
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ],
            { cancelable: true }
        );
    };

    const resetForm = () => {
        setProductName('');
        setProductDescription('');
        setProductSKU('');
        setProductQuantity('');
        setProductWeight('');
        setProductDimensions('');
        setProductImages([]);
        setProductCategory('');
    };

    return (
        <ScrollView style={styles.container}>
            <TextInput
                placeholder="Product Name"
                value={productName}
                onChangeText={setProductName}
                style={styles.input}
            />
            <TextInput
                placeholder="Description"
                value={productDescription}
                onChangeText={setProductDescription}
                style={styles.input}
            />
            <TextInput
                placeholder="SKU"
                value={productSKU}
                onChangeText={setProductSKU}
                style={styles.input}
            />
            <TextInput
                placeholder="Quantity"
                value={productQuantity}
                onChangeText={setProductQuantity}
                style={styles.input}
                keyboardType="numeric"
            />
            <TextInput
                placeholder="Weight"
                value={productWeight}
                onChangeText={setProductWeight}
                style={styles.input}
                keyboardType="numeric"
            />
            <TextInput
                placeholder="Dimensions"
                value={productDimensions}
                onChangeText={setProductDimensions}
                style={styles.input}
            />
            <Picker
                selectedValue={productCategory}
                onValueChange={(itemValue) => setProductCategory(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select Category" value="" />
                {categories.map((category) => (
                    <Picker.Item key={category.id} label={category.name} value={category.id} />
                ))}
            </Picker>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                {productImages.length > 0 ? (
                    <ScrollView horizontal>
                        {productImages.map((uri, index) => (
                            <Image key={index} source={{ uri }} style={styles.image} />
                        ))}
                    </ScrollView>
                ) : (
                    <Text style={styles.imagePickerText}>Pick Images</Text>
                )}
            </TouchableOpacity>
            <Button title={editingProductId ? 'Update Product' : 'Add Product'} onPress={addProduct} color="#DDA517" />

            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.productContainer}>
                        <ScrollView horizontal style={styles.imageScrollContainer}>
                            {item.images.length > 0 && (
                                <Image source={{ uri: item.images[0] }} style={styles.productImage} />
                            )}
                        </ScrollView>
                        <View style={styles.productDetails}>
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text>{item.description}</Text>
                            <Text>SKU: {item.sku}</Text>
                            <Text>Quantity: {item.quantity}</Text>
                            <Text>Weight: {item.weight}</Text>
                            <Text>Dimensions: {item.dimensions}</Text>
                            <Text>Category: {categories.find(cat => cat.id === item.category)?.name}</Text>
                            <View style={styles.actions}>
                                <Button title="Edit" onPress={() => {
                                    setProductName(item.name);
                                    setProductDescription(item.description);
                                    setProductSKU(item.sku);
                                    setProductQuantity(item.quantity);
                                    setProductWeight(item.weight);
                                    setProductDimensions(item.dimensions);
                                    setProductImages(item.images);
                                    setProductCategory(item.category);
                                    setEditingProductId(item.id);
                                }} color="#1E90FF" />
                                <Button title="Delete" onPress={() => deleteProduct(item.id)} color="#FF6347" />
                            </View>
                        </View>
                    </View>
                )}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#ffffff',
        borderRadius: 5,
    },
    picker: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#ffffff',
        borderRadius: 5,
    },
    imagePicker: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#ffffff',
        borderRadius: 5,
    },
    imagePickerText: {
        color: '#007BFF',
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    productContainer: {
        flexDirection: 'row',
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#ffffff',
        borderRadius: 5,
    },
    imageScrollContainer: {
        width: 80,
        marginRight: 10,
    },
    productImage: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    productDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});
