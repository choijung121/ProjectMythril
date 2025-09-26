import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import supabase from '../config/supabaseClient';

const HomeScreen: React.FC = () => {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mythril Gallery</Text>
      <Text style={styles.subtitle}>Welcome, Admin!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#666',
  },
});

export default HomeScreen;