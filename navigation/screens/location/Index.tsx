import { Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { config } from "../../../config";
import { UserContext } from '../../../contexts/userContext';
import Location from '../../../components/location/location';

export default function locationScreen() {
    let { user, setUser } = useContext(UserContext);

    async function fetchAuthenticatedUser() {
        let authToken = await AsyncStorage.getItem('auth-token');
        let r = await axios.get(config.api_url + "/me", {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization": "Bearer " + authToken,
            }
        });

        setUser(r.data);
    }

    useEffect(() => {
        fetchAuthenticatedUser();
    }, []);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Location></Location>
        </View>
    );
}