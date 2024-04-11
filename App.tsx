import React, {useEffect, useState} from 'react';
import {Image, LogBox} from 'react-native';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';
import rootReducer from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/redux/reducers';
import LoginScreen from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/components/auth/Login';
import RegisterScreen from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/components/auth/Register';
import MainScreen from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/components/Main';
import {container} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/components/style';
import {configureStore} from '@reduxjs/toolkit';
import {auth} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/services/firebaseConfig';

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
        source={require('/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/assets/img/logo.png')}
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

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={({route}) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';
              return {
                headerTitle: routeName,
              };
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
