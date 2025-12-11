import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

export default function DiscoverScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const navigation = useNavigation();

    const [fontsLoaded] = useFonts({
        'PressStart2P-Regular': require('../assets/fonts/PressStart2P-Regular.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
    });

    const workouts = [
        { id: '1', name: 'Full Body Blast', category: 'Beginners', bodyPart: 'Full Body', points: 15, totalTime: 30, exercises: [{ name: 'Pushups', time: 30 }, { name: 'Squats', time: 45 }], image: require('../assets/Full Body Blast.jpg') },
        { id: '2', name: 'Upper Body Strength', category: 'Advanced', bodyPart: 'Upper Body', points: 25, totalTime: 45, exercises: [{ name: 'Pushups', time: 30 }, { name: 'Planks', time: 60 }], image: require('../assets/Starting Arms.jpg') },
        { id: '3', name: 'Cardio Kickstart', category: 'Pros', bodyPart: 'Full Body', points: 30, totalTime: 60, exercises: [{ name: 'Jumping Jacks', time: 30 }, { name: 'Burpees', time: 45 }], image: require('../assets/Cardio Kickstart.jpg') },
    ];

    const filteredWorkouts = workouts.filter(workout =>
        (filter === 'All' || workout.bodyPart === filter) &&
        workout.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories = ['Beginners', 'Advanced', 'Pros'];
    const bodyParts = ['All', 'Full Body', 'Upper Body', 'Lower Body', 'Arms', 'Chest'];

    const handleWorkoutPress = (workout) => {
        navigation.navigate('WorkoutScreen', { workout });
    };

    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search workouts"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <View style={styles.filterContainer}>
                <Text style={styles.sectionTitle}>Filter by Body Part</Text>
                <FlatList
                    data={bodyParts}
                    horizontal
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.filterButton, filter === item && styles.activeFilter]}
                            onPress={() => setFilter(item)}
                        >
                            <Text style={[styles.filterText, filter === item && styles.activeFilterText]}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {categories.map(category => (
                <View key={category}>
                    <Text style={styles.sectionTitle}>{category}</Text>
                    <FlatList
                        data={filteredWorkouts.filter(w => w.category === category)}
                        keyExtractor={(item) => item.id}
                        horizontal
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.workoutItem} onPress={() => handleWorkoutPress(item)}>
                                <ImageBackground source={item.image} style={styles.workoutBackground} imageStyle={styles.workoutImageStyle}>
                                    <View style={styles.overlay} />
                                    <View style={styles.workoutContent}>
                                        <Text style={styles.workoutName}>{item.name}</Text>
                                        <Text style={styles.workoutDetails}>{item.bodyPart} - {item.points} Points</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            ))}
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
    searchBar: {
        height: 40,
        borderColor: '#2b2b2b',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontFamily: 'Inter-Regular',
    },
    filterContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'PressStart2P-Regular',
        color: '#2b2b2b',
    },
    filterButton: {
        backgroundColor: 'rgba(248,140,80,0.71)',
        padding: 10,
        marginRight: 10,
        borderRadius: 8,
        minWidth: 80,
        maxWidth: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeFilter: {
        backgroundColor: '#cc4070',
        borderWidth: 2,
        borderColor: '#2b2b2b',
    },
    filterText: {
        fontFamily: 'Inter-Regular',
        textAlign: 'center',
        fontSize: 12,
    },
    activeFilterText: {
        fontWeight: 'bold',
        color: '#2b2b2b',
    },
    workoutItem: {
        marginRight: 10,
        borderRadius: 8,
        width: 200,
        height: 150,
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
        padding: 10,
    },
    workoutName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'PressStart2P-Regular',
    },
    workoutDetails: {
        fontSize: 12,
        color: '#fff',
        fontFamily: 'Inter-Regular',
    },
});
