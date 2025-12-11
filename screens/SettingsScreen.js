import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';

export default function SettingsScreen() {
    const [feedback, setFeedback] = useState('');

    const [fontsLoaded] = useFonts({
        'PressStart2P-Regular': require('../assets/fonts/PressStart2P-Regular.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
    });

    const handleResetProgress = async () => {
        Alert.alert('Reset Progress', 'Are you sure? This will reset all your data.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Reset', onPress: async () => {
                    await AsyncStorage.multiRemove([
                        'virtuaPoints', 'workoutsDone', 'totalMinutes', 'caloriesLost',
                        'currentStreak', 'personalBestStreak', 'workoutHistory', 'weightData', 'quotaProgress', 'userName'
                    ]);
                    Alert.alert('Progress Reset', 'All progress has been reset.');
                }},
        ]);
    };

    const handleSubmitFeedback = () => {
        if (feedback.trim()) {
            Alert.alert('Feedback Submitted', 'Thank you for your feedback!');
            setFeedback('');
        } else {
            Alert.alert('Error', 'Please enter feedback.');
        }
    };

    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.option} onPress={handleResetProgress}>
                <Text style={styles.optionText}>Reset Progress</Text>
            </TouchableOpacity>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact Us</Text>
                <Text style={styles.contactText}>Email: support@virtuaapp.com</Text>
                <Text style={styles.contactText}>Phone: +1-123-456-7890</Text>
                <TextInput
                    style={styles.feedbackInput}
                    placeholder="Enter your feedback"
                    value={feedback}
                    onChangeText={setFeedback}
                    multiline
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmitFeedback}>
                    <Text style={styles.submitButtonText}>Submit Feedback</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About Us</Text>
                <Text style={styles.aboutText}>• Virtua Fitness is an innovative fitness app that combines the excitement of gaming with the benefits of physical exercise.</Text>
                <Text style={styles.aboutText}>• Operating within the health and wellness industry, our platform offers a unique blend of gamified workouts, personalized fitness  plans, and a vibrant community to support users on their fitness journeys.</Text>
                <Text style={styles.aboutText}>• Our primary offerings include a variety of engaging workout routines that cater to different levels and preferences, from strength training to cardio and flexibility exercises..</Text>
                <Text style={styles.aboutText}>• Users can earn rewards, level up, and participate in challenges that a foster a sense of achievement and community.</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ff7e37',
    },
    option: {
        backgroundColor: 'rgba(248,140,80,0.71)',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#2b2b2b',
    },
    optionText: {
        fontSize: 18,
        fontFamily: 'PressStart2P-Regular',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'PressStart2P-Regular',
        color: '#2b2b2b',
    },
    contactText: {
        fontSize: 16,
        marginBottom: 5,
        fontFamily: 'Inter-Regular',
        color:'#2b2b2b',
    },
    feedbackInput: {
        height: 100,
        borderColor: '#2b2b2b',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontFamily: 'Inter-Regular',
    },
    submitButton: {
        backgroundColor: '#cc4070',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#2b2b2b',
    },
    submitButtonText: {
        fontSize: 16,
        color: '#2b2b2b',
        textAlign: 'center',
        fontFamily: 'Inter-Regular',
        fontWeight: 'bold',
    },
    aboutText: {
        fontSize: 14,
        marginBottom: 5,
        fontFamily: 'Inter-Regular',
        color: '#2b2b2b',
    },
});
