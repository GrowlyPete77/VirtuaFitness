import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';

export default function RankingsScreen() {
    const [userName, setUserName] = useState('You');
    const [userRank, setUserRank] = useState('Beginner');
    const [userPoints, setUserPoints] = useState(0);
    const [newName, setNewName] = useState('');

    const [fontsLoaded] = useFonts({
        'PressStart2P-Regular': require('../assets/fonts/PressStart2P-Regular.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
    });

    useEffect(() => {
        const loadUserData = async () => {
            const name = await AsyncStorage.getItem('userName') || 'You';
            const points = await AsyncStorage.getItem('virtuaPoints') || '0';
            setUserName(name);
            setUserPoints(parseInt(points));
            setNewName(name);
            // Simple rank logic based on points
            if (parseInt(points) > 100) setUserRank('Pro');
            else if (parseInt(points) > 50) setUserRank('Advanced');
            else setUserRank('Beginner');
        };
        loadUserData();
    }, []);

    const handleChangeName = async () => {
        if (newName.trim()) {
            await AsyncStorage.setItem('userName', newName.trim());
            setUserName(newName.trim());
            Alert.alert('Name Changed', 'Your name has been updated.');
        } else {
            Alert.alert('Error', 'Please enter a valid name.');
        }
    };

    const topUsers = [
        { id: '1', name: 'Alex Champion', points: 150 },
        { id: '2', name: 'Sarah Fit', points: 140 },
        { id: '3', name: 'Mike Strong', points: 130 },
        { id: '4', name: 'Emma Power', points: 120 },
        { id: '5', name: 'John Flex', points: 110 },
        { id: '6', name: 'Lisa Tone', points: 100 },
        { id: '7', name: 'Tom Bulk', points: 90 },
        { id: '8', name: 'Anna Sweat', points: 80 },
        { id: '9', name: 'David Pump', points: 70 },
        { id: '10', name: 'Bella Burn', points: 60 },
    ];

    // Insert user into rankings based on points
    const userEntry = { id: 'user', name: userName, points: userPoints };
    const allUsers = [...topUsers, userEntry].sort((a, b) => b.points - a.points).slice(0, 10);

    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.profileContainer}>
                <View style={styles.profileDetails}>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.userRank}>Rank: {userRank}</Text>
                    <Text style={styles.userPoints}>{userPoints} Points</Text>
                    <TextInput
                        style={styles.nameInput}
                        placeholder="Change your name"
                        value={newName}
                        onChangeText={setNewName}
                    />
                    <TouchableOpacity style={styles.changeNameButton} onPress={handleChangeName}>
                        <Text style={styles.changeNameText}>Change Name</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Top 10 Rankings</Text>
            <FlatList
                data={allUsers}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <View style={[styles.rankingItem, item.id === 'user' && styles.userHighlight]}>
                        <Text style={styles.rankNumber}>{index + 1}.</Text>
                        <Text style={styles.rankUserName}>{item.name}</Text>
                        <Text style={styles.rankUserPoints}>{item.points} Points</Text>
                    </View>
                )}
            />
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
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(248,140,80,0.71)',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#2b2b2b',
    },
    profilePic: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    profileDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'PressStart2P-Regular',
    },
    userRank: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
    },
    userPoints: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
    },
    nameInput: {
        height: 40,
        borderColor: '#2b2b2b',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginTop: 10,
        fontFamily: 'Inter-Regular',
    },
    changeNameButton: {
        backgroundColor: '#cc4070',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#2b2b2b',
    },
    changeNameText: {
        color: '#2b2b2b',
        textAlign: 'center',
        fontFamily: 'Inter-Regular',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'PressStart2P-Regular',
    },
    rankingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff7e37',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#2b2b2b',
    },
    userHighlight: {
        backgroundColor: '#d3ad50',
        borderWidth: 2,
        borderColor: '#2b2b2b',
    },
    rankNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
        fontFamily: 'PressStart2P-Regular',
    },
    rankUserName: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'PressStart2P-Regular',
    },
    rankUserPoints: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        fontWeight: 'bold',
    },
});
