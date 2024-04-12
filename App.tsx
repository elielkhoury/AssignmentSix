import React, {useEffect, useState} from 'react';
import {Image, LogBox} from 'react-native';
import {
  NavigationContainer,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';
import rootReducer from './src/redux/reducers';
import LoginScreen from './src/components/auth/Login';
import RegisterScreen from './src/components/auth/Register';
import MainScreen from './src/components/Main';
import {container} from './src/components/style';
import {configureStore} from '@reduxjs/toolkit';
import {auth} from './src/services/firebaseConfig';

// Initialize Firebase outside of the component, this will run as the module is imported
import './src/services/firebaseConfig';

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

LogBox.ignoreLogs(['Setting a timer']);

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // No need to initialize Firebase here, it's done in firebaseConfig.ts
    const unsubscribe = auth.onAuthStateChanged(user => {
      setLoaded(true);
      setLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (!loaded) {
    return (
      <Image
        style={container.splash}
        source={require('./src/assets/img/logo.png')}
      />
    );
  }

  if (!loggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  function getFocusedRouteNameFromRoute(
    _route: RouteProp<ParamListBase, 'Main'>,
  ):
    | string
    | ((props: {
        children: string;
        tintColor?: string | undefined;
      }) => React.ReactNode)
    | undefined {
    throw new Error('Function not implemented.');
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={({route}) => ({
              headerTitle: getFocusedRouteNameFromRoute(route) ?? 'Feed',
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
