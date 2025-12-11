import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GettingStartedScreen from './screens/GettingStartedScreen';
import HomeScreen from './screens/HomeScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import RankingsScreen from './screens/RankingsScreen';
import SettingsScreen from './screens/SettingsScreen';
import WorkoutScreen from './screens/WorkoutScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function PointsDisplay() {
    const [points, setPoints] = useState(0);

    useEffect(() => {
        const loadPoints = async () => {
            const storedPoints = await AsyncStorage.getItem('virtuaPoints');
            if (storedPoints) {
                setPoints(parseInt(storedPoints));
            }
        };
        loadPoints();
    }, []);

    return (
        <View style={styles.pointsContainer}>
            <Image source={require('./assets/VP.png')} style={styles.pointsIcon} />
            <Text style={styles.pointsText}>{points} Virtua Points</Text>
        </View>
    );
}

function MainTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerRight: () => <PointsDisplay />,
                }}
            />
            <Tab.Screen
                name="Discover"
                component={DiscoverScreen}
                options={{
                    headerRight: () => <PointsDisplay />,
                }}
            />
            <Tab.Screen
                name="Statistics"
                component={StatisticsScreen}
                options={{
                    headerRight: () => <PointsDisplay />,
                }}
            />
            <Tab.Screen
                name="Rankings"
                component={RankingsScreen}
                options={{
                    headerRight: () => <PointsDisplay />,
                }}
            />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="GettingStarted">
                <Stack.Screen name="GettingStarted" component={GettingStartedScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
                <Stack.Screen name="WorkoutScreen" component={WorkoutScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    pointsIcon: {
        width: 35,
        height: 20,
        marginRight: 5,
    },
    pointsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2b2b2b',
        fontFamily: 'PressStart2P-Regular',
    },
});