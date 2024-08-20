import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker'; 
import trackAction from '../utils/trackAction'; 

export default function CategoryScreen() {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [mainImage, setMainImage] = useState('');
    const [additionalImages, setAdditionalImages] = useState([]);
    const [categoryDescription, setCategoryDescription] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const storedCategories = JSON.parse(await AsyncStorage.getItem('categories')) || [];
            setCategories(storedCategories);
        } catch (error) {
            console.error('Error fetching categories: ', error);
        }
    };

    const addCategory = async () => {
        try {
            if (editingCategoryId) {
                const updatedCategories = categories.map((category) =>
                    category.id === editingCategoryId
                        ? { id: editingCategoryId, name: categoryName, image: mainImage, description: categoryDescription, additionalImages }
                        : category
                );
                setCategories(updatedCategories);
                await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));

               
                await trackAction(
                    { id: 'user123', name: 'John Doe' },
                    `Updated Category: ${categoryName}`
                );

                setEditingCategoryId(null);
            } else {
                const newCategory = {
                    id: Date.now().toString(),
                    name: categoryName,
                    image: mainImage,
                    description: categoryDescription,
                    additionalImages
                };
                const updatedCategories = [...categories, newCategory];
                setCategories(updatedCategories);
                await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));

                
                await trackAction(
                    { id: 'user123', name: 'John Doe' }, 
                    `Added Category: ${categoryName}`
                );
            }
            setCategoryName('');
            setMainImage('');
            setCategoryDescription('');
            setAdditionalImages([]);
        } catch (error) {
            console.error('Error adding/updating category: ', error);
        }
    };

    const deleteCategory = async (id) => {
        try {
            const updatedCategories = categories.filter((category) => category.id !== id);
            setCategories(updatedCategories);
            await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));

          
            await trackAction(
                { id: 'user123', name: 'John Doe' }, 
                `Deleted Category ID: ${id}`
            );
        } catch (error) {
            console.error('Error deleting category: ', error);
        }
    };

    const pickImages = () => {
        ImagePicker.openPicker({
            multiple: true,
            mediaType: 'photo',
            cropping: true,
        })
        .then(images => {
            const uris = images.map(image => image.path);
            setMainImage(uris[0]); 
            setAdditionalImages(uris.slice(1)); 
        })
        .catch(error => {
            console.error('ImagePicker Error: ', error);
        });
    };

    const takePhotos = () => {
        ImagePicker.openCamera({
            cropping: true,
        })
        .then(image => {
            const uri = image.path;
            setMainImage(uri);
            setAdditionalImages([uri]); 
        })
        .catch(error => {
            console.error('Camera Error: ', error);
        });
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Category Name"
                value={categoryName}
                onChangeText={setCategoryName}
                style={styles.input}
            />
            <TextInput
                placeholder="Description"
                value={categoryDescription}
                onChangeText={setCategoryDescription}
                style={styles.input}
            />
            <View style={styles.imagePickerContainer}>
                <TouchableOpacity onPress={pickImages} style={styles.imagePickerButton}>
                    <Text style={styles.imagePickerButtonText}>Pick Images from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={takePhotos} style={styles.imagePickerButton}>
                    <Text style={styles.imagePickerButtonText}>Take Photos</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.imagePicker}>
                {mainImage ? (
                    <Image source={{ uri: mainImage }} style={styles.image} />
                ) : (
                    <Text>No Main Image Selected</Text>
                )}
            </View>
            <TouchableOpacity 
                style={styles.addButton} 
                onPress={addCategory}
            >
                <Text style={styles.addButtonText}>{editingCategoryId ? 'Update Category' : 'Add Category'}</Text>
            </TouchableOpacity>

            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.categoryContainer}>
                        <Image source={{ uri: item.image }} style={styles.categoryImage} />
                        <View style={styles.categoryDetails}>
                            <View>
                                <Text style={styles.categoryName}>{item.name}</Text>
                                <Text style={styles.categoryDescription}>
                                    {item.description.length > 20 ? item.description.slice(0, 20) + '...' : item.description}
                                </Text>
                            </View>
                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => {
                                        setCategoryName(item.name);
                                        setCategoryDescription(item.description);
                                        setMainImage(item.image);
                                        setAdditionalImages(item.additionalImages || []);
                                        setEditingCategoryId(item.id);
                                    }}
                                >
                                    <Text style={styles.actionButtonText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.actionButton}
                                    onPress={() => deleteCategory(item.id)}
                                >
                                    <Text style={styles.actionButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
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
    input: {
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    imagePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    imagePickerButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%',
        backgroundColor: '#fff',
    },
    imagePickerButtonText: {
        color: '#DDA517',
        fontSize: 16,
    },
    imagePicker: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        alignItems: 'center',
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    addButton: {
        backgroundColor: '#DDA517',
        padding: 15,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    categoryContainer: {
        flexDirection: 'row',
        padding: 10,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    categoryImage: {
        width: 60,
        height: 60,
        marginRight: 10,
        borderRadius: 8,
    },
    categoryDetails: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    categoryName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    categoryDescription: {
        fontSize: 14,
        color: '#555',
        maxWidth: 200, 
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
    },
});
