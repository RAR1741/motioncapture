import * as React from 'react';
import { StyleSheet, Button, View, Text, TouchableHighlight, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SingleSender } from './SingleSender';
import { TimedSender } from './TimedSender';


function HomeScreen(
    {
        navigation,
        training_server_url = ""
    }
) {
    return (
        <View>
            <Text style={styles.main}>Choose a Pose Training Mode</Text>
            <Text> </Text>
            <ScrollView style={styles.scrollView}>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('SingleSender', { training_server: training_server_url })} >
                        <Text style={styles.boxContent}>Single Sender</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('TimedSender', { training_server: training_server_url })} >
                        <Text style={styles.boxContent}>Timed Sender</Text>
                    </TouchableOpacity>
                </View>
                {/* <View style={styles.row}>
                    <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('SingleSender', { training_server: training_server_url })} >
                        <Text style={styles.boxContent}>Single Sender</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('BurstSender', { training_server: training_server_url })} >
                        <Text style={styles.boxContent}>Burst Sender</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('DynamicSender', { training_server: training_server_url })} >
                        <Text style={styles.boxContent}>Dynamic Sender</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('TimedSender', { training_server: training_server_url })} >
                        <Text style={styles.boxContent}>Timed Sender</Text>
                    </TouchableOpacity>
                </View> */}
            </ScrollView>
        </View>
    );
}

const Stack = createNativeStackNavigator();

export default function PoseTrainer(
    {
        //Setting Default parameters for components
        training_server_url = ""
    }
) {
    return (

        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#2832C2',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}>
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Pose Trainer' }} />
                {(props) => <HomeScreen training_server_url={training_server_url} />}
                <Stack.Screen name="SingleSender" getComponent={() => require('./SingleSender').default} options={{ title: 'Single Frame Sender', }} />
                {/* <Stack.Screen name="BurstSender" getComponent={() => require('./BurstSender').default} options={{ title: 'Burst Frame Sender', }} />
                <Stack.Screen name="DynamicSender" getComponent={() => require('./DynamicSender').default} options={{ title: 'Dynamic Frame Sender', }} /> */}
                <Stack.Screen name="TimedSender" getComponent={() => require('./TimedSender').default} options={{ title: 'Timed Frame Sender', }} />
            </Stack.Navigator>
        </NavigationContainer>
    );

}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    box: {
        flex: 1,
        margin: 10,
        height: 150,
        width: '30%',
        borderRadius: 20,
        backgroundColor: "#2832C2",
    },

    head: {
        textAlign: "center",
    },

    boxContent: {
        alignContent: "center",
        paddingTop: "50%",
        color: "white",
        textAlign: "center",
        fontSize: 20,
    },

    row: {
        flexDirection: "row",
        flexWrap: "wrap",
    }


})