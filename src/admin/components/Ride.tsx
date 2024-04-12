import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';

type ProfileScreenRouteProp = RouteProp<{params: {userId: string}}, 'params'>;

function Ride() {
  const [user, setUser] = useState<any | null>(null);
  const [banReason, setBanReason] = useState('');
  const navigation = useNavigation();
  const route = useRoute<ProfileScreenRouteProp>();
  const {userId} = route.params;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot(snapshot => {
        if (snapshot.exists) {
          setUser(snapshot.data());
        } else {
          setUser(null);
        }
      });
    return () => unsubscribe();
  }, [userId]);

  const banUser = () => {
    firestore()
      .collection('users')
      .doc(userId)
      .update({
        banned: true,
        banDetails: {
          banReason,
          date: firestore.FieldValue.serverTimestamp(),
        },
      })
      .then(() => {
        Alert.alert('User banned');
        navigation.goBack();
      })
      .catch(error => {
        Alert.alert('Error banning user', error.message);
      });
  };

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userSection}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text>{user?.username}</Text>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setBanReason}
        value={banReason}
        placeholder="Ban Reason"
        multiline
      />
      <Button title="Ban User" onPress={banUser} color="#FF0000" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  userSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default Ride;
