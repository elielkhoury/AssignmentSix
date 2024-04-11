import React, {useState} from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import {
  container,
  form,
} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/components/style';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {auth} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/services/firebaseConfig';
import {signInWithEmailAndPassword} from 'firebase/auth';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function Login({navigation}: Props) {
  // Using local state to handle user inputs for email and password.
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Function to handle the sign-in process using Firebase Authentication.
  const onSignUp = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        console.log('Logged in with:', user.email);
        navigation.navigate('Home');
      })
      .catch(error => {
        const errorMessage = error.message;
        console.error('Failed to sign in:', errorMessage);
      });
  };

  return (
    <View style={container.center}>
      <View style={container.formCenter}>
        <TextInput
          style={form.textInput}
          placeholder="email"
          onChangeText={setEmail}
        />
        <TextInput
          style={form.textInput}
          placeholder="password"
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        <Button onPress={onSignUp} title="Sign In" />
      </View>
      {/* Option for users to navigate to the registration screen if they don't have an account. */}
      <View style={form.bottomButton}>
        <Text onPress={() => navigation.navigate('Register')}>
          Don't have an account? SignUp.
        </Text>
      </View>
    </View>
  );
}
