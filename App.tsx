/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Chat from './src/screens/Chat/Chat';
import {NavigationContainer} from '@react-navigation/native';
import Login from './src/screens/Login/Login';
import SignUp from './src/screens/Signup/Signup';
import Home from './src/screens/Home/Home';
import useUsersCollection from './src/hooks/useUsersCollection';
import auth from '@react-native-firebase/auth';
import {AppState} from 'react-native';

const stack = createStackNavigator();

const ChatStack = () => {
  return (
    <stack.Navigator>
      <stack.Screen
        name="login"
        component={Login}
        options={{headerShown: false}}
      />

      <stack.Screen
        name="signup"
        component={SignUp}
        options={{headerShown: false}}
      />

      <stack.Screen name="chat" component={Chat} />
      <stack.Screen
        name="home"
        component={Home}
        options={{title: 'Contacts List'}}
      />
    </stack.Navigator>
  );
};

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <ChatStack />
    </NavigationContainer>
  );
};

const App = () => {
  const {updateUser} = useUsersCollection();
  const [appState, setAppState] = useState(AppState.currentState);
  AppState.addEventListener('change', nextAppState => {
    setAppState(nextAppState);
  });
  useEffect(() => {
    if (auth().currentUser) {
      if (appState === 'active') updateUser({status: 'online'});
      else updateUser({status: 'offline'});
    }
  }, [appState]);
  return <RootNavigator />;
};

export default App;
