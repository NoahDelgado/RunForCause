import React, { useContext, useEffect, useState } from 'react';
import {
    Image, StyleSheet,
    Text, View,
    Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DIMENSIONS } from '../../app/styles/dimensions';
import { Dimensions } from 'react-native';
import { config } from "../../config";
import { UserContext } from '../../contexts/userContext';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LocationComponent() {

  const [location, setLocation] = useState<Location.LocationObject>();
  const [isWatching, setIsWatching] = useState(false);

    let { user, setUser } = useContext(UserContext);
    useEffect(() => {
      toggleWatching();
      watchPosition();
    }, []);

    const sendLocation = async (location: Location.LocationObject) => {
      if (await AsyncStorage.getItem('isWatching') === 'false') return;
      console.log(config.api_url + '/location?');
      let authToken = await AsyncStorage.getItem('auth-token');
      await axios.post(config.api_url + '/location?',
          {
              lat: location.coords.latitude,
              long: location.coords.longitude,
          }, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization": "Bearer " + authToken,
            }
        }).catch(error => {
          console.log(error);
      });
  }

  const watchPosition = async () => {
      Location.getForegroundPermissionsAsync().then(async (perm) => {
          if (!perm.granted) {
              await Location.requestForegroundPermissionsAsync().catch(console.error);
          }
          const options: Location.LocationOptions = {
              accuracy: Location.Accuracy.BestForNavigation,
              timeInterval: 1000 * 5,
          };
          Location.watchPositionAsync(options, async (location) => {
              setLocation(location);
              console.log('Location: ' + location.coords.latitude + ' ' + location.coords.longitude);
              await sendLocation(location);
          });
      });
  }

  const saveWatchingState = async (isWatching: string) => {
    await AsyncStorage.setItem('isWatching', isWatching);
  }

  const toggleWatching = async () => {
      setIsWatching((await AsyncStorage.getItem('isWatching') === 'true'));
  }

    return (
      <View style={styles.container}>
      <MapView
          style={styles.map}
          region={{
              latitudeDelta: 0.0922, // Default value
              longitudeDelta: 0.0421, // Default value
              latitude: location?.coords.latitude ?? 0,
              longitude: location?.coords.longitude ?? 0,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          showsUserLocation={true}
          showsCompass={false}
          loadingEnabled={true}
      />
      <Pressable style={styles.button} onPress={async () => {
          await saveWatchingState(`${!(await AsyncStorage.getItem('isWatching') === 'true')}`);
          toggleWatching();
      }}>
          <Text style={styles.text}>{isWatching ? "Arréter" : "Démarrer"}</Text>
      </Pressable>
  </View>
    );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
  },
  map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
  },
  button: {
      position: 'absolute',
      bottom: 20,
      paddingVertical: 5,
      width: '90%',
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      backgroundColor: '#e15638',
  },
  text: {
      fontSize: 15,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
      textTransform: 'uppercase',
  },
});