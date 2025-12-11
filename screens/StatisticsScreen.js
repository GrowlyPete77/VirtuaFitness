import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';

export default function StatisticsScreen() {
    const [workoutsDone, setWorkoutsDone] = useState(0);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [caloriesLost, setCaloriesLost] = useState(0);
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [personalBestStreak, setPersonalBestStreak] = useState(0);
    const [weightData, setWeightData] = useState([{ date: '2023-01-01', weight: 70 }]);
    const [currentWeight, setCurrentWeight] = useState('');
    const [weightUnit, setWeightUnit] = useState('kg');
    const [bmi, setBmi] = useState('');
    const [height, setHeight] = useState('');
    const [heightUnit, setHeightUnit] = useState('cm');

    const [fontsLoaded] = useFonts({
        'PressStart2P-Regular': require('../assets/fonts/PressStart2P-Regular.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const workouts = await AsyncStorage.getItem('workoutsDone') || '0';
                const minutes = await AsyncStorage.getItem('totalMinutes') || '0';
                const calories = await AsyncStorage.getItem('caloriesLost') || '0';
                const history = await AsyncStorage.getItem('workoutHistory') || '[]';
                const weight = await AsyncStorage.getItem('weightData') || '[]';
                const streak = await AsyncStorage.getItem('currentStreak') || '0';
                const bestStreak = await AsyncStorage.getItem('personalBestStreak') || '0';

                setWorkoutsDone(parseInt(workouts));
                setTotalMinutes(parseInt(minutes));
                setCaloriesLost(parseInt(calories));
                setWorkoutHistory(JSON.parse(history));
                setWeightData(JSON.parse(weight));
                setCurrentStreak(parseInt(streak));
                setPersonalBestStreak(parseInt(bestStreak));
            } catch (error) {
                console.error('Error loading data:', error);
                Alert.alert('Error', 'Failed to load statistics.');
            }
        };
        loadData();
    }, []);

    const addWeight = async () => {
        if (currentWeight) {
            const newWeight = { date: new Date().toISOString().split('T')[0], weight: parseFloat(currentWeight) };
            const updatedWeight = [...weightData, newWeight];
            setWeightData(updatedWeight);
            await AsyncStorage.setItem('weightData', JSON.stringify(updatedWeight));
            setCurrentWeight('');
        }
    };

    const calculateBMI = () => {
        if (height && currentWeight) {
            let heightInMeters;
            if (heightUnit === 'cm') {
                heightInMeters = parseFloat(height) / 100;
            } else {
                const [feet, inches] = height.split(',');
                heightInMeters = (parseFloat(feet) * 0.3048) + (parseFloat(inches) * 0.0254);
            }
            let weightInKg = weightUnit === 'lbs' ? parseFloat(currentWeight) * 0.453592 : parseFloat(currentWeight);
            const bmiValue = weightInKg / (heightInMeters * heightInMeters);
            setBmi(bmiValue.toFixed(2));
        } else {
            Alert.alert('Error', 'Please enter both height and weight.');
        }
    };

    const getBMICategory = (bmi) => {
        if (bmi < 18.5) return 'Underweight';
        if (bmi >= 18.5 && bmi < 25) return 'Normal';
        return 'Overweight';
    };

    const getBMIColor = (bmi) => {
        if (bmi < 18.5 || bmi >= 25) return '#FF0000';
        return '#4CAF50';
    };

    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.statsContainer}>
                <Text style={styles.stat}>Workouts Done: {workoutsDone}</Text>
                <Text style={styles.stat}>Total Minutes: {totalMinutes}</Text>
                <Text style={styles.stat}>Calories Lost: {caloriesLost}</Text>
            </View>

            <Text style={styles.sectionTitle}>History</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarContainer}>
                {Array.from({ length: 30 }, (_, i) => new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]).map(date => (
                    <View key={date} style={[styles.calendarDay, workoutHistory.includes(date) && styles.workoutDay]}>
                        <Text style={styles.dayText}>{new Date(date).getDate()}</Text>
                    </View>
                ))}
            </ScrollView>
            <Text style={styles.streak}>Current Streak: {currentStreak} days</Text>
            <Text style={styles.streak}>Personal Best: {personalBestStreak} days</Text>

            <Text style={styles.sectionTitle}>Weight Graph</Text>
            <Text style={styles.placeholder}>Chart temporarily removed for debugging. Weight data: {weightData.map(d => `${d.date}: ${d.weight}`).join(', ')}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter weight"
                    value={currentWeight}
                    onChangeText={setCurrentWeight}
                    keyboardType="numeric"
                />
                <TouchableOpacity onPress={() => setWeightUnit(weightUnit === 'kg' ? 'lbs' : 'kg')}>
                    <Text style={styles.unitText}>{weightUnit}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={addWeight} style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add Weight</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>BMI Calculator</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter height"
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                />
                <TouchableOpacity onPress={() => setHeightUnit(heightUnit === 'cm' ? 'ft,in' : 'cm')}>
                    <Text style={styles.unitText}>{heightUnit}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={calculateBMI} style={styles.addButton}>
                    <Text style={styles.addButtonText}>Calculate BMI</Text>
                </TouchableOpacity>
            </View>
            {bmi && (
                <View style={styles.bmiContainer}>
                    <Text style={styles.bmiText}>Your BMI: {bmi} ({getBMICategory(parseFloat(bmi))})</Text>
                    <View style={styles.bmiBar}>
                        <Text style={styles.bmiLabel}>Underweight &lt;18.5</Text>
                        <View style={styles.bmiScale}>
                            <View style={[styles.bmiIndicator, { left: `${Math.min(Math.max((parseFloat(bmi) - 18.5) / (30 - 18.5) * 100, 0), 100)}%`, backgroundColor: getBMIColor(parseFloat(bmi)) }]} />
                            <Text style={[styles.bmiMidLabel, { color: getBMIColor(parseFloat(bmi)) }]}>Normal 18.5-24.9</Text>
                        </View>
                        <Text style={styles.bmiLabel}>Overweight &gt;25</Text>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ff7e37',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    statsContainer: {
        backgroundColor: 'rgba(248,140,80,0.71)',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#2b2b2b',
    },
    stat: {
        fontSize: 16,
        marginBottom: 5,
        fontFamily: 'PressStart2P-Regular',
        color: '#2b2b2b',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'PressStart2P-Regular',
    },
    calendarContainer: {
        marginBottom: 10,
    },
    calendarDay: {

        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
        backgroundColor: 'rgba(248,140,80,0.71)',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#2b2b2b',

    },
    workoutDay: {
        backgroundColor: '#00ccbb',
    },
    dayText: {
        fontWeight: 'bold',
        fontSize: 14,
        fontFamily: 'Inter-Regular',
    },
    streak: {
        fontSize: 16,
        marginBottom: 5,
        fontFamily: 'Inter-Regular',
    },
    placeholder: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: 'Inter-Regular',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#2b2b2b',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontFamily: 'Inter-Regular',
    },
    unitText: {
        marginLeft: 10,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
    },
    addButton: {
        marginLeft: 10,
        backgroundColor: '#00ccbb',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#2b2b2b',
    },
    addButtonText: {
        fontWeight: 'bold',
        color: '#2b2b2b',
        fontFamily: 'Inter-Regular',
    },
    bmiContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    bmiText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'PressStart2P-Regular',
        marginBottom: 10,
    },
    bmiBar: {
        width: '100%',
        alignItems: 'center',
    },
    bmiLabel: {
        fontSize: 12,
        fontFamily: 'Inter-Regular',
        marginBottom: 5,
    },
    bmiScale: {
        width: '80%',
        height: 20,
        backgroundColor: '#ccc',
        borderRadius: 10,
        position: 'relative',
        marginBottom: 5,
    },
    bmiIndicator: {
        position: 'absolute',
        top: -5,
        width: 10,
        height: 30,
        borderRadius: 5,
    },
    bmiMidLabel: {
        position: 'absolute',
        top: -25,
        left: '50%',
        transform: [{ translateX: -50 }],
        fontSize: 10,
        fontFamily: 'Inter-Regular',
    },
});
