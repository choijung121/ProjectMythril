import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import supabase from '../config/supabaseClient';
import { decode } from 'base64-arraybuffer';

const ImageUploader: React.FC = () => {
    const [loading, setLoading] = useState(false);


    const pickAndUploadImage = async () => {
        // 1. Ask for permission to access media library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need permission to access your media library to upload images.');
            return;
        }

        // 2. Open image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            base64: true // Ask for the image data in base64 format
        });

        if (result.canceled || !result.assets || result.assets.length === 0) {
            return; // user cancelled the picker
        }

        // 3. Upload the selected image
        setLoading(true);
        const image = result.assets[0];
        const fileName = image.uri.split('.').pop()?.toLowerCase() ?? 'jpg';
        const filePath = `${Date.now()}.${fileName}`;

        if (!image.base64) {
            Alert.alert('Upload Failed', 'Could not retrieve image data.');
            setLoading(false);
            return;
        }

        const { error } = await supabase.storage
            .from('photos')
            .upload(filePath, decode(image.base64), {
                contentType: `image/${fileName}`,
            });

        if (error) {
            Alert.alert('Upload Error', error.message);
        } else {
            Alert.alert('Success!', 'Your photo has been uploaded.');
            // Here, we would typically refresh the list of photos, which we'll do in the next step.
        }
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={pickAndUploadImage}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                {loading ? 'Uploading...' : 'Upload a Photo'}
                </Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
      width: '100%',
      alignItems: 'center',
      marginVertical: 20,
    },
    button: {
      backgroundColor: '#007bff',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

export default ImageUploader;