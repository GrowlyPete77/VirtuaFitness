import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Alert, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';

export default function WorkoutScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { workout } = route.params;
    const [isPaused, setIsPaused] = useState(false);
    const [currentExercise, setCurrentExercise] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [workoutStarted, setWorkoutStarted] = useState(false);
    const [timerId, setTimerId] = useState(null);

    const [fontsLoaded] = useFonts({
        'PressStart2P-Regular': require('../assets/fonts/PressStart2P-Regular.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
    });

    const exercises = workout.exercises.map(ex => ({ ...ex, image: workout.image })) || [
        { name: 'Pushups', time: 30, image: workout.image },
        { name: 'Squats', time: 45, image: workout.image },
        { name: 'Planks', time: 60, image: workout.image },
    ];

    const totalTime = exercises.reduce((sum, ex) => sum + ex.time, 0);

    useEffect(() => {
        if (workoutStarted && currentExercise < exercises.length) {
            setTimeLeft(exercises[currentExercise].time);
        }
    }, [currentExercise, workoutStarted]);

    useEffect(() => {
        if (workoutStarted && !isPaused && timeLeft > 0) {
            const id = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        updateQuotaProgress(exercises[currentExercise].name);
                        if (currentExercise < exercises.length - 1) {
                            setCurrentExercise(curr => curr + 1);
                        } else {
                            handleCompleteWorkout();  // Auto-complete when last exercise finishes
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            setTimerId(id);
            return () => clearInterval(id);
        }
    }, [isPaused, timeLeft, currentExercise, workoutStarted]);

    const updateQuotaProgress = async (exerciseName) => {
        const quotaProgress = JSON.parse(await AsyncStorage.getItem('quotaProgress') || '[]');
        const quotaNames = ['Pushups', 'Squats', 'Burpees', 'Jumping Jacks', 'Planks', 'Lunges', 'Mountain Climbers', 'Crunches', 'Dips'];
        const index = quotaNames.indexOf(exerciseName);
        if (index !== -1) {
            quotaProgress[index] = Math.min((quotaProgress[index] || 0) + 1, [15, 20, 10, 30, 15, 20, 10, 25, 15][index]);
            await AsyncStorage.setItem('quotaProgress', JSON.stringify(quotaProgress));
        }
    };

    const handleStartWorkout = () => {
        setWorkoutStarted(true);
    };

    const handleCompleteWorkout = async () => {
        clearInterval(timerId);
        const currentPoints = await AsyncStorage.getItem('virtuaPoints');
        const workoutsDone = await AsyncStorage.getItem('workoutsDone');
        const totalMinutes = await AsyncStorage.getItem('totalMinutes');
        const caloriesLost = await AsyncStorage.getItem('caloriesLost');

        const newPoints = (parseInt(currentPoints) || 0) + workout.points;
        const newWorkouts = (parseInt(workoutsDone) || 0) + 1;
        const newMinutes = (parseInt(totalMinutes) || 0) + totalTime;
        const newCalories = (parseInt(caloriesLost) || 0) + 100;

        await AsyncStorage.setItem('virtuaPoints', newPoints.toString());
        await AsyncStorage.setItem('workoutsDone', newWorkouts.toString());
        await AsyncStorage.setItem('totalMinutes', newMinutes.toString());
        await AsyncStorage.setItem('caloriesLost', newCalories.toString());

        Alert.alert('Workout Completed!', `You earned ${workout.points} Virtua Points! Total: ${newPoints}`);
        navigation.goBack();  // Navigate back to previous screen
    };

    const handleCancelWorkout = () => {
        clearInterval(timerId);
        Alert.alert('Cancel Workout', 'Are you sure? You won\'t earn points.', [
            { text: 'No', style: 'cancel' },
            { text: 'Yes', onPress: () => navigation.goBack() },
        ]);
    };

    const handlePauseWorkout = () => {
        setIsPaused(!isPaused);
    };

    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    const nextExercise = currentExercise < exercises.length - 1 ? exercises[currentExercise + 1] : null;

    if (!workoutStarted) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{workout.name}</Text>
                <Text style={styles.totalTime}>Total Time: {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}</Text>
                <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
                    <Text style={styles.startButtonText}>Start Workout</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>{workout.name}</Text>
            <Text style={styles.totalTime}>Total Time: {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}</Text>

            <Text style={styles.sectionTitle}>Exercises</Text>
            <FlatList
                data={exercises}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={[styles.exerciseItem, index === currentExercise && styles.currentExercise]}>
                        <Image source={item.image} style={styles.exerciseImage} />
                        <View style={styles.exerciseDetails}>
                            <Text style={styles.exerciseName}>{item.name}</Text>
                            <Text style={styles.exerciseTime}>{Math.floor(item.time / 60)}:{(item.time % 60).toString().padStart(2, '0')}</Text>
                        </View>
                    </View>
                )}
            />

            {nextExercise && (
                <View style={styles.nextExerciseContainer}>
                    <Text style={styles.nextExerciseTitle}>Next Exercise:</Text>
                    <Text style={styles.nextExerciseName}>{nextExercise.name}</Text>
                    <Text style={styles.nextExerciseTime}>{Math.floor(nextExercise.time / 60)}:{(nextExercise.time % 60).toString().padStart(2, '0')}</Text>
                </View>
            )}

            {currentExercise < exercises.length && (
                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</Text>
                </View>
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.pauseButton} onPress={handlePauseWorkout}>
                    <Text style={styles.buttonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelWorkout}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
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
        paddingBottom: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'PressStart2P-Regular',
    },
    totalTime: {
        fontSize: 18,
        marginBottom: 20,
        fontFamily: 'Inter-Regular',
    },
    startButton: {
        backgroundColor: '#cc4070',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#2b2b2b',
    },
    startButtonText: {
        fontSize: 18,
        color: '#2b2b2b',
        textAlign: 'center',
        fontFamily: 'Inter-Regular',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'PressStart2P-Regular',
    },
    exerciseItem: {
        flexDirection: 'row',
        backgroundColor: 'rgba(248,140,80,0.71)',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#2b2b2b',
    },
    currentExercise: {
        backgroundColor: '#cc4070',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#2b2b2b',
    },
    exerciseImage: {
        width: 50,
        height: 50,
        marginRight: 15,
    },
    exerciseDetails: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'PressStart2P-Regular',
    },
    exerciseTime: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
    },
    nextExerciseContainer: {
        backgroundColor: 'rgba(248,140,80,0.71)',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#2b2b2b',
    },
    nextExerciseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'PressStart2P-Regular',
    },
    nextExerciseName: {
        fontSize: 16,
        fontFamily: 'PressStart2P-Regular',
    },
    nextExerciseTime: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
    },
    timerContainer: {
        marginBottom: 20,
    },
    timerText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Inter-Regular',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    pauseButton: {
        backgroundColor: '#FFA500',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    cancelButton: {
        backgroundColor: '#FF0000',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Inter-Regular',
    },
});
