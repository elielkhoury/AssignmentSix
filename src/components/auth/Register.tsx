import React, {useState} from 'react';
import {Button, TextInput, View, Text} from 'react-native';
import {Snackbar} from 'react-native-paper';
import {
  container,
  form,
} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/components/style';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import auth from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/services/firebaseConfig';
import {
  doc,
  setDoc,
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

// Defined the type for navigation props to ensure type safety.
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Specifying the props types for this component.
type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

// Snackbar state to manage its visibility and message dynamically.
type SnackbarState = {
  boolSnack: boolean;
  message: string;
};

const db = getFirestore(); // Ensure you initialize Firestore like this in your firebaseConfig.ts or import the initialized instance.

export default function Register({navigation}: Props) {
  // Initializing state variables for form inputs and snackbar.
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isValid, setIsValid] = useState<SnackbarState>({
    boolSnack: false,
    message: '',
  });

  const onRegister = () => {
    if (!name || !username || !email || !password) {
      setIsValid({boolSnack: true, message: 'Please fill out all fields.'});
      return;
    }
    if (password.length < 6) {
      setIsValid({
        boolSnack: true,
        message: 'Password must be at least 6 characters.',
      });
      return;
    }

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    getDocs(q)
      .then(snapshot => {
        if (snapshot.empty) {
          auth()
            .createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
              setDoc(doc(db, 'users', userCredential.user.uid), {
                name,
                email,
                username,
                image: 'default',
                followingCount: 0,
                followersCount: 0,
              });
              navigation.navigate('Login');
            })
            .catch(error => {
              setIsValid({boolSnack: true, message: error.message});
            });
        } else {
          setIsValid({boolSnack: true, message: 'Username is already taken.'});
        }
      })
      .catch(error => {
        setIsValid({boolSnack: true, message: error.message});
      });
  };

  return (
    <View style={container.center}>
      <View style={container.formCenter}>
        {/* Text input fields for user registration details. */}
        <TextInput
          style={form.textInput}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={form.textInput}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={form.textInput}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={form.textInput}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <Button onPress={onRegister} title="Register" />
      </View>
      <View style={form.bottomButton}>
        <Text onPress={() => navigation.navigate('Login')}>
          Already have an account? Sign In.
        </Text>
      </View>
      {/* Snackbar for feedback on registration process. */}
      <Snackbar
        visible={isValid.boolSnack}
        duration={2000}
        onDismiss={() => setIsValid({...isValid, boolSnack: false})}>
        {isValid.message}
      </Snackbar>
    </View>
  );
}
