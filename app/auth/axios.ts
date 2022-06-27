import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../../config';
import axios from 'axios';

let authToken = async () => {
    try {
        const result = await AsyncStorage.getItem('auth-token')
        if (result !== null) {
            return result;
        }
    } catch (err) {
        console.error(err);
    }
};

let conf: any = {
    method: 'post',
    url: config.api_url,
    headers: {
        "Access-Control-Allow-Origin": "*",
        'Accept': 'application/json',
        'Authorization': `Bearer ${async() => {await authToken()}}`,
    },
};

let authenticatedRequest = (data, url: null) => {
    conf.url = url ?? url;
    conf.data = data;
    console.log(conf);
    return axios(conf);
};

export { authenticatedRequest };