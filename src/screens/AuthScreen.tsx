import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import supabase from '../config/supabaseClient';

const AuthScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // state to manage loading status to prevent double-clicks

    // --- Sign In Function ---
    const handleSignIn = async () => {
        if (loading) return; // Don't do anything while processing
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            Alert.alert('Sorry, incorrect password or email address', error.message);
        } 
        setLoading(false);
    }

    // --- Sign Up Function ---
    const handleSignUp = async () => {
        if (loading) return;
        setLoading(true);
    
        const { error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });
    
        if (error) {
          Alert.alert('Error Signing Up', error.message);
        } else {
          // Supabase sends a confirmation email by default.
          Alert.alert('Success!', 'Please check your email to confirm your account.');
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Project Mythril</Text>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry // Hides the password characters
            />
            <TouchableOpacity
                style={[styles.button, styles.signInButton]}
                onPress={handleSignIn}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.signUpButton]}
                onPress={handleSignUp}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        fontSize: 30,
        marginBottom: 20,
        textAlign: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    button: {
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
      },
      signInButton: {
        backgroundColor: '#007bff',
      },
      signUpButton: {
        backgroundColor: '#28a745',
      },
      buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
});

export default AuthScreen;