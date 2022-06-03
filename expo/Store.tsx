import * as SecureStore from 'expo-secure-store';

export default class Store {
    async save(key: string, value: any) {
        await SecureStore.setItemAsync(key, value);
    }

    async get(key: string) {
        return await SecureStore.getItemAsync(key);
    }
    async remove(key: string) {
        return await SecureStore.deleteItemAsync(key);
    }
}