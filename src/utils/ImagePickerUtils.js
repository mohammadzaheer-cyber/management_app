import ImagePicker from 'react-native-image-picker';

export const pickImage = (setImage) => {
  ImagePicker.showImagePicker({}, (response) => {
    if (response.uri) {
      setImage(response.uri);
    }
  });
};
