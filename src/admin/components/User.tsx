import {firebase} from '@react-native-firebase/messaging';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native'; // Import React Native components

interface UserProps {
  match: {
    params: {
      id: string;
    };
  };
}

interface UserData {
  uid: string;
  name?: string;
  username?: string;
  email?: string;
  image?: string;
}

export default function User(props: UserProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeUser = firebase
      .firestore()
      .collection('users')
      .doc(props.match.params.id)
      .onSnapshot(snapshot => {
        if (snapshot.exists) {
          const userData = snapshot.data() as UserData;
          setUser({...userData, uid: snapshot.id});
          setLoading(false);
        } else {
          setUser(null);
          setLoading(false);
        }
      });

    return () => unsubscribeUser();
  }, [props.match.params.id]);

  if (loading) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  if (!user) {
    return <Text>No user data available.</Text>;
  }

  return (
    <View style={styles.container}>
      {user.image && (
        <Image
          source={{uri: user.image}}
          style={styles.image}
          alt={user.name || 'User Image'}
        />
      )}
      <Text style={styles.name}>{user.name}</Text>
      <Text>Username: {user.username}</Text>
      <Text>Email: {user.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  loading: {
    textAlign: 'center',
    marginTop: 50,
  },
});
