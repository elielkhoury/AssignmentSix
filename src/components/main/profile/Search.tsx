import React, {useState} from 'react';
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import {Dispatch, UnknownAction, bindActionCreators} from 'redux';
import {queryUsersByUsername} from '../../../redux/actions/index';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {
  container,
  text,
  utils,
} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/components/style';
import {db} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/services/firebaseConfig';

// Defining the User interface to structure user data
interface User {
  id: string;
  username: string;
  name: string;
  image: string;
}

// The Search component allowing to find users by their usernames
function Search(props: {
  navigation: {
    navigate: (arg0: string, arg1: {uid: any; username: undefined}) => void;
  };
}) {
  const [users, setUsers] = useState<User[]>([]);

  const searchUsers = async (searchText: string) => {
    if (!searchText.trim()) {
      setUsers([]);
      return;
    }

    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('username', '>=', searchText),
      where('username', '<=', searchText + '\uf8ff'),
    );
    const querySnapshot = await getDocs(q);
    const usersList: User[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<User, 'id'>),
    }));
    setUsers(usersList);
  };

  return (
    <View style={[utils.backgroundWhite, container.container]}>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={utils.searchBar}
          placeholder="Type Here..."
          // eslint-disable-next-line @typescript-eslint/no-shadow
          onChangeText={text => searchUsers(text)}
        />
      </View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.userContainer}
            onPress={() =>
              props.navigation.navigate('Profile', {
                uid: item.id,
                username: undefined,
              })
            }>
            {item.image === 'default' ? (
              <Icon
                style={[utils.profileImage, styles.profileImageMargin]}
                name="user-circle"
                size={50}
                color="black"
              />
            ) : (
              <Image
                style={[utils.profileImage, styles.profileImageMargin]}
                source={{uri: item.image}}
              />
            )}
            <View style={utils.justifyCenter}>
              <Text style={text.username}>{item.username}</Text>
              <Text style={text.name}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchInputContainer: {
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  userContainer: {
    ...container.horizontal,
    ...utils.padding10Sides,
    ...utils.padding10Top,
  },
  profileImageMargin: utils.marginBottomSmall,
});

const mapDispatchToProps = (dispatch: Dispatch<UnknownAction>) =>
  bindActionCreators({queryUsersByUsername}, dispatch);

export default connect(null, mapDispatchToProps)(Search);
