import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import { useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DIMENSIONS } from './app/styles/dimensions';

import { config } from "./config";
import { AuthContext } from './contexts/authContext';
import { UserContext } from './contexts/userContext';
import MainContainer from './navigation/MainContainer';

const Stack = createStackNavigator();

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: DIMENSIONS.fontSize * 2,
  },
  label: {
    marginTop: 20,
    marginLeft: 5,
  },
  button: {
    marginTop: 20,
    color: 'white',
    height: 40,
    backgroundColor: '#ec5990',
    borderRadius: 4,
    marginLeft: 5,
    marginRight: 5,
  },
  container: {
    flex: 1,
    padding: 8,
  },
  input: {
    borderRadius: DIMENSIONS.inputBorderRadius,
    height: DIMENSIONS.height + 5,
    marginTop: 5,
    marginRight: 5,
    marginLeft: 5,
    padding: 0,
    backgroundColor: '#fff',
  },
  multiline: {
    height: DIMENSIONS.height + 20,
    textAlignVertical: 'top',
  },
  error: {
    backgroundColor: '#ffb0b7',
    width: '100%',
    height: 20,
    borderRadius: DIMENSIONS.inputBorderRadius,
    justifyContent: 'center',
    padding: 5,
    marginLeft: 5,
    marginRight: 5
  },
  errorText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

function SignInScreen() {
  const { signIn } = useContext(AuthContext);
  const { register, setError, setValue, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              label="Email"
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
              value={value}
            />
          )}
          name="email"
          rules={{ required: true }}
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              label="Password"
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
              value={value}
              secureTextEntry
            />
          )}
          name="password"
          rules={{ required: true }}
        />

        <View style={styles.button}>
          <Button
            style={styles.buttonInner}
            color
            title="Login"
            onPress={handleSubmit(signIn)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default function App({ navigation }) {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            authToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            authToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            authToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      authToken: null,
    }
  );

  const [user, setUser] = useState({});

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let authToken = await AsyncStorage.getItem('auth-token');
      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: authToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (data) => {
        let authToken: string;
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token
        axios.post(config.api_url + "/mytoken", {
          'username': data.email,
          'password': data.password
        }).then(async (response) => {
          authToken = response.data;
          await AsyncStorage.setItem('auth-token', authToken);
          await AsyncStorage.setItem('isWatching', 'False');

          //this.setState({ message: 'User successfully authenticated!' });
        }).catch(err => {
          if (err.response.status === 401) {
            //setMessage('Authentication failed! Please check your credentials and try again.');
            // setError("test", { type: "focus" }, { shouldFocus: true });
          }
        }).finally(() => {
          dispatch({ type: 'SIGN_IN', token: authToken });
        });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'auth-token' });
      },
    }),
    []
  )

  return (
    <AuthContext.Provider value={authContext}>
      <UserContext.Provider value={{ user, setUser }}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{
            headerShown: false
          }}>
            {state.isLoading ? (
              // We haven't finished checking for the token yet
              <Stack.Screen name="Splash" component={SplashScreen} />
            ) : state.authToken == null ? (
              // No token found, user isn't signed in
              <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                //component={AuthenticationForm}
                options={{
                  title: 'Sign in',
                  // When logging out, a pop animation feels intuitive
                  animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                }}
              />
            ) : (
              // User is signed in
              <Stack.Screen name="Main" component={MainContainer} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}