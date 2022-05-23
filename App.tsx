import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AuthenticationForm from './screens/AuthenticationForm';
import Header from './components/Header';

class App extends Component {
  render() {
    return (
      <View style={styles.container} >
        <Header> Connexion </Header>
        <AuthenticationForm></AuthenticationForm>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;