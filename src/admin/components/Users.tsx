import React, {useEffect, useState} from 'react';
import {View, Text, Button, FlatList, StyleSheet} from 'react-native';
import firebase from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

// Define types for the user data
interface User {
  id: string;
  name?: string;
  username?: string;
  email?: string;
}

// Define types for the navigation parameters
type RootStackParamList = {
  navigate(arg0: string, arg1: {userId: string}): void;
  Home: undefined;
  UserDetail: {userId: string};
};

// Component definition
const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigation = useNavigation<RootStackParamList>();

  useEffect(() => {
    const unsubscribe = firebase()
      .collection('users')
      .onSnapshot(snapshot => {
        const usersArray: User[] = snapshot.docs.map(doc => ({
          ...(doc.data() as User),
          id: doc.id, // Ensuring 'id' from 'doc.id' is used
        }));
        setUsers(usersArray);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({item}: {item: User}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.text}>
        {item.name} ({item.username})
      </Text>
      <Button
        title="View"
        onPress={() => navigation.navigate('UserDetail', {userId: item.id})}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

// Styles definition
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 18,
  },
});

export default Users;
