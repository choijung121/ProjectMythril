import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Session } from '@supabase/supabase-js';

import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import supabase from '../config/supabaseClient';

// Define the shape of our navigation stack's parameters
export type RootStackParamList = {
    Auth: undefined; // No paramters for Auth screen
    Home: undefined; // No paramters for Home screen
}

// Create the stack navigator instance
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    // State to hold the current user session
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        // check for an existing session when the app starts
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // Listen for changes to the authentication state (sign in / sign out)
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        // Cleanup the listener when component unmounts
        return () => {
            authListener.subscription.unsubscribe();
        }
    }, [])

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {session && session.user ? (
                    // If a session exists, show the HomeScreen
                    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Gallery' }} />
                ) : (
                    // Otherwise, show the AuthScreen
                    <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator