import React, { useContext, useEffect } from 'react';
import {
    Image, StyleSheet,
    Text, View, Alert, Button
} from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DIMENSIONS } from '../../app/styles/dimensions';
import { config } from "../../config";
import { UserContext } from '../../contexts/userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
    let { user, setUser } = useContext(UserContext);

    const deleteTracking = async () => {
        let authToken = await AsyncStorage.getItem('auth-token');
        await axios.delete(config.api_url + '/location?', {
            headers: {
                "Authorization": "Bearer " + authToken,
            }
        }).catch(error => {
            console.log(error);
        });

    }
    const showAlert = () =>
        Alert.alert(
            "Delete Tracking",
            "Are you sure you want to delete your tracking?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                { text: "Confirme", onPress: deleteTracking },
            ],
        );

    useEffect(() => {
    }, []);

    return (

        <SafeAreaView style={styles.SafeAreaView}>
            <View>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        {console.log(user)}
                        <Image style={styles.avatar} source={{ uri: `${config.img_url}/${user?.picture}` }} />
                    </View>
                </View>

                <View style={styles.body}>
                    <View style={styles.item}>
                        <Ionicons style={styles.icon} name="man" size={30} />
                        <Text style={styles.info}>{user?.name ? user?.name : 'No name available'}</Text>
                    </View>
                    <View style={styles.item}>
                        <Ionicons style={styles.icon} name="mail" size={30} />
                        <Text style={styles.info}>{user?.email ? user?.email : 'No mail available'}</Text>
                    </View>
                    <View style={styles.item}>
                        <Ionicons style={styles.icon} name="phone-portrait-outline" size={30} />
                        <Text style={styles.info}>{user?.phone ? user?.phone : 'No phone number available'}</Text>
                    </View>
                    <View style={styles.button}>
                        <Button
                            title="Delete Tracking"
                            onPress={showAlert}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    SafeAreaView: {
        flex: 1,
    },
    header: {
        backgroundColor: "#DCDCDC",
    },
    headerContent: {
        padding: 30,
        alignItems: 'center',
    },
    editButton: {
        marginRight: 10,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "#e3755e",
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        color: "#000000",
        fontWeight: '600',
    },
    userInfo: {
        fontSize: 16,
        color: "#778899",
        fontWeight: '600',
    },
    body: {
        backgroundColor: "#e3755e",
        height: '100%',
        width: '100%',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingLeft: '5%',
        left: 0,
    },
    infoContent: {
        flex: 1,
        alignItems: 'flex-start',
        paddingLeft: 5,
    },
    iconContent: {
        flex: 1,
        alignItems: 'flex-end',
        paddingRight: 5,
    },
    icon: {
        width: DIMENSIONS.iconSize,
        height: DIMENSIONS.iconSize,
        marginTop: 20,
        marginRight: 10
    },
    info: {
        fontSize: 18,
        marginTop: 20,
        color: "#FFFFFF",
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: DIMENSIONS.fontSize * 2,
    },
    input: {
        height: DIMENSIONS.height,
        margin: DIMENSIONS.margin,
        borderWidth: 1,
        borderRadius: DIMENSIONS.inputBorderRadius,
        padding: 10,
        fontSize: DIMENSIONS.fontSize,
        backgroundColor: '#fff',
        width: '100%',
    },
    label: {
        fontSize: DIMENSIONS.fontSize,
        margin: DIMENSIONS.margin,
    },
    button: {
        marginTop: 20,
        color: 'white',
        height: 40,
        backgroundColor: '#e15638',
        borderRadius: DIMENSIONS.inputBorderRadius,
        marginLeft: 5,
        marginRight: 5,
    },
    form: {
        width: '80%',
        padding: 10,
        flex: 1,
        flexDirection: 'column',
        marginRight: '30%',
    },
    text: {
        color: 'white',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        with: '100%',
    },
    message: {
        height: DIMENSIONS.height,
    }
});