import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GettingStartedScreen() {
    const [userName, setUserName] = useState('You');
    const navigation = useNavigation();

    const [fontsLoaded] = useFonts({
        'PressStart2P-Regular': require('../assets/fonts/PressStart2P-Regular.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
    });

    useEffect(() => {
        const loadUserName = async () => {
            const name = await AsyncStorage.getItem('userName') || 'You';
            setUserName(name);
        };
        loadUserName();
    }, []);

    const handleGetStarted = () => {
        navigation.navigate('Main');
    };

    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
        <LinearGradient
            colors={['#efa357', '#ff7e37','#e574a0','#cc4070']}
            style={styles.container}
        >
            <Image source={require('../assets/VF_Icon-removebg-preview.png')} style={styles.logo} />
            <Text style={styles.title}>Welcome {userName}, are you ready to gain PEAK FITNESS!!!</Text>
            <Text style={styles.subtitle}>Get ready to start your fitness journey.</Text>
            <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 300,
        height: 300,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'PressStart2P-Regular',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        fontFamily: 'Inter-Regular',
    },
    button: {
        backgroundColor: '#ff2d75',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 15,
        borderStyle:'solid',
        borderWidth: 3,
        borderColor:'#2b2b2b',
    },
    buttonText: {
        fontSize: 18,
        color: '#2b2b2b',
        textAlign: 'center',
        fontFamily: 'Inter-Regular',
    },
});
