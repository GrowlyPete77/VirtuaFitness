import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Dimensions, Image, ImageBackground, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [quotaBatch, setQuotaBatch] = useState(0);
    const [quotaProgress, setQuotaProgress] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const navigation = useNavigation();

    const [fontsLoaded] = useFonts({
        'PressStart2P-Regular': require('../assets/fonts/PressStart2P-Regular.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
    });

    const loadQuotaProgress = async () => {
        const progress = JSON.parse(await AsyncStorage.getItem('quotaProgress') || '[]');
        setQuotaProgress(progress.length ? progress : [0, 0, 0, 0, 0, 0, 0, 0, 0]);
    };

    useEffect(() => {
        loadQuotaProgress();
    }, []);

    const popularWorkouts = [
        { id: '1', name: 'Starting Arms', description: 'Beginner arm workout', difficulty: 'Easy', duration: '15 min', exerciseCount: 5, points: 15, totalTime: 15, exercises: [{ name: 'Pushups', time: 30 }], image: require('../assets/Starting Arms.jpg') },
        { id: '2', name: 'Full Body Blast', description: 'Complete body routine', difficulty: 'Medium', duration: '30 min', exerciseCount: 10, points: 20, totalTime: 30, exercises: [{ name: 'Squats', time: 45 }], image: require('../assets/Full Body Blast.jpg') },
        { id: '3', name: 'Cardio Kickstart', description: 'High-energy cardio', difficulty: 'Hard', duration: '20 min', exerciseCount: 8, points: 25, totalTime: 20, exercises: [{ name: 'Jumping Jacks', time: 30 }], image: require('../assets/Cardio Kickstart.jpg') },
    ];

    const todayQuota = [
        { name: 'Pushups', total: 15, image: require('../assets/Pushups.jpg') },
        { name: 'Squats', total: 20, image: require('../assets/Squats.jpg') },
        { name: 'Burpees', total: 10, image: require('../assets/Burpees.jpg') },
        { name: 'Jumping Jacks', total: 30, image: require('../assets/Jumping Jacks.jpg') },
        { name: 'Planks', total: 15, image: require('../assets/Planks.jpg') },
        { name: 'Lunges', total: 20, image: require('../assets/Lunges.jpg') },
        { name: 'Mountain Climbers', total: 10, image: require('../assets/Mountain Climbers.jpg') },
        { name: 'Sit-ups', total: 25, image: require('../assets/Sit-ups.jpg') },
        { name: 'Dips', total: 15, image: require('../assets/Dips.jpg') },
    ];

    const itemsPerBatch = 3;
    const totalBatches = Math.ceil(todayQuota.length / itemsPerBatch);
    const currentQuota = todayQuota.slice(quotaBatch * itemsPerBatch, (quotaBatch + 1) * itemsPerBatch);

    const handleWorkoutPress = (workout) => {
        navigation.navigate('WorkoutScreen', { workout });
    };

    const filteredWorkouts = popularWorkouts.filter(workout =>
        workout.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const nextBatch = () => {
        if (quotaBatch < totalBatches - 1) setQuotaBatch(quotaBatch + 1);
    };

    const prevBatch = () => {
        if (quotaBatch > 0) setQuotaBatch(quotaBatch - 1);
    };

    const handleRefresh = () => {
        loadQuotaProgress();  // Reload quota progress
    };

    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search workouts"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
                    <Text style={styles.refreshText}>Refresh</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Popular Workouts</Text>
            <FlatList
                data={filteredWorkouts}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.workoutItem} onPress={() => handleWorkoutPress(item)}>
                        <ImageBackground source={item.image} style={styles.workoutBackground} imageStyle={styles.workoutImageStyle}>
                            <View style={styles.overlay} />
                            <View style={styles.workoutContent}>
                                <Text style={styles.workoutName}>{item.name}</Text>
                                <Text style={styles.workoutDescription}>{item.description}</Text>
                                <Text style={styles.workoutDetails}>Difficulty: {item.difficulty}</Text>
                                <Text style={styles.workoutDetails}>Duration: {item.duration}</Text>
                                <Text style={styles.workoutDetails}>Exercises: {item.exerciseCount}</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                )}
            />

            <View style={styles.quotaHeader}>
                <Text style={styles.sectionTitle}>Today's Quota</Text>
                <View style={styles.arrowContainer}>
                    <TouchableOpacity onPress={prevBatch} style={styles.arrowButton}>
                        <Text style={styles.arrowText}>&lt;</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={nextBatch} style={styles.arrowButton}>
                        <Text style={styles.arrowText}>&gt;</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={currentQuota}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    const globalIndex = quotaBatch * itemsPerBatch + index;
                    return (
                        <View style={styles.quotaItem}>
                            <Image source={item.image} style={styles.quotaImage} />
                            <View style={styles.quotaDetails}>
                                <Text style={styles.quotaName}>{item.name}</Text>
                                <Text style={styles.quotaProgress}>{quotaProgress[globalIndex]}/{item.total}</Text>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressFill, { width: `${(quotaProgress[globalIndex] / item.total) * 100}%` }]} />
                                </View>
                            </View>
                        </View>
                    );
                }}
            />

            <Text style={styles.batchIndicator}>{quotaBatch + 1}/{totalBatches}</Text>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchBar: {
        flex: 1,
        height: 40,
        borderColor: '#2b2b2b',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontFamily: 'Inter-Regular',
    },
    refreshButton: {
        marginLeft: 10,
        backgroundColor: '#d3ad50',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 3,
        borderColor: '#2b2b2b',
    },
    refreshText: {
        color: '#2b2b2b',
        fontFamily: 'Inter-Regular',
    },
    sectionTitle: {
        color:'#2b2b2b',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'PressStart2P-Regular',
    },
    workoutItem: {
        marginRight: 10,
        borderRadius: 8,
        width: Dimensions.get('window').width * 0.7,
        height: 200,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        overflow: 'hidden',
    },
    workoutBackground: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    workoutImageStyle: {
        borderRadius: 8,
        resizeMode: 'cover',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 8,
    },
    workoutContent: {
        padding: 15,
    },
    workoutName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'PressStart2P-Regular',
    },
    workoutDescription: {
        fontSize: 14,
        color: '#fff',
        fontFamily: 'Inter-Regular',
    },
    workoutDetails: {
        fontSize: 12,
        color: '#fff',
        fontFamily: 'Inter-Regular',
    },
    quotaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    arrowContainer: {
        flexDirection: 'row',
    },
    arrowButton: {
        padding: 10,
    },
    arrowText: {
        color:'#2b2b2b',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'PressStart2P-Regular',
    },
    quotaItem: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    quotaImage: {
        width: 50,
        height: 50,
        marginRight: 15,
    },
    quotaDetails: {
        flex: 1,
    },
    quotaName: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'PressStart2P-Regular',
        color:'#fff',
    },
    quotaProgress: {
        fontSize: 14,
        color: '#eee',
        fontFamily: 'Inter-Regular',
    },
    progressBar: {
        height: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 2,
        borderColor: '#00ccbb',
        borderRadius: 5,
        marginTop: 5,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#00ccbb',
        borderRadius: 5,
    },
    batchIndicator: {
        textAlign: 'center',
        fontSize: 14,
        color: '#666',
        fontFamily: 'Inter-Regular',
    },
});