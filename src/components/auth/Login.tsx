import React, {useState} from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import {container, form} from '../style';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import auth from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/services/firebaseConfig';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function Login({navigation}: Props) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onSignUp = () => {
    auth()
      .signInWithEmailAndPassword(email.trim(), password)
      .then((userCredential: {user: any}) => {
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
      <View style={form.bottomButton}>
        <Text onPress={() => navigation.navigate('Register')}>
          Don't have an account? Sign Up.
        </Text>
      </View>
    </View>
  );
}
