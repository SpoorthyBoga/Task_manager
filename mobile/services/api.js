import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ REPLACE WITH YOUR LAPTOP'S LOCAL IP ADDRESS (Do not use localhost)
const API_URL = 'http://192.168.0.7:5000/api'; 

const api = axios.create({
    baseURL: API_URL,
});

// Intercept requests to add the auth token automatically
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;