import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AuthenticationForm from './screens/AuthenticationForm';
import Header from './components/Header';
import Store from './expo/Store';
import axios from 'axios';
import config from './config.json';
import UserContext from "./context/UserContext";
interface IMyState {
  user: {
    username: string,
    isLoggedIn: boolean
  }
}
class App extends Component<any, IMyState> {
  store: Store;

  state: IMyState = {
    user: { username: '', isLoggedIn: false },
  }
  constructor(props: any) {
    super(props);
    this.store = new Store();
    this.setIsLogguedIn = this.setIsLogguedIn.bind(this);
    this.checkIfLoggedIn();
  }
  setIsLogguedIn(isLoggedIn: boolean) {
    this.setState({
      user: {
        username: 'bonjour',
        isLoggedIn: isLoggedIn
      }
    });
  }
  /**
  * @description: This function checks if the user is logged in.
  */
  async checkIfLoggedIn() {
    const token = await this.store.get('token');
    console.log(token);
    axios.get(config.apiUrlCheckToken, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response: { data: any; }) => {
      this.setIsLogguedIn(true);
    }).catch((error: any) => {
      this.setIsLogguedIn(false);
    });
  };
  render() {
    return (

      <View style={styles.container} >
        <UserContext.Provider value={{ user: this.state.user, setIsLogguedIn: this.setIsLogguedIn }}></UserContext.Provider>
        <Header> Connexion </Header>
        <AuthenticationForm store={this.store}></AuthenticationForm>
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