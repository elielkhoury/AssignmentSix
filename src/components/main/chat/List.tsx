import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux';
import {Dispatch, bindActionCreators} from 'redux';
import {fetchUsersData} from '../../../redux/actions';
import {
  text,
  utils,
} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/components/style';
import auth from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/services/firebaseConfig';

interface User {
  uid: string;
  name?: string;
  image?: string;
}

interface Chat {
  id: string;
  users: string[];
  otherUser?: User;
}

interface ChatListProps {
  chats: Chat[];
  users: User[];
  navigation: {
    navigate: (route: string, params: {user: User}) => void;
  };
}

const ChatList = (props: ChatListProps) => {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const newChats = props.chats.map(chat => {
      const otherUserId = chat.users.find(id => id !== auth().currentUser?.uid);
      const otherUser = props.users.find(user => user.uid === otherUserId);
      return {...chat, otherUser};
    });
    setChats(newChats);
  }, [props.chats, props.users]);

  return (
    <View style={styles.chatListContainer}>
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              if (item.otherUser) {
                props.navigation.navigate('Chat', {user: item.otherUser});
              } else {
                console.log('User not found.');
              }
            }}
            style={styles.chatItem}>
            <View style={styles.userRow}>
              {item.otherUser && item.otherUser.image !== 'default' ? (
                <FastImage
                  style={utils.profileImageSmall}
                  source={{uri: item.otherUser.image}}
                />
              ) : (
                <Icon name="user-circle" size={35} color="black" />
              )}
            </View>
            <Text style={[text.bold, styles.chatUserName]} numberOfLines={1}>
              {item.otherUser?.name || 'Chat User'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const mapStateToProps = (state: any) => ({
  currentUser: state.userState.currentUser,
  chats: state.userState.chats,
  users: state.usersState.users,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) =>
  bindActionCreators({fetchUsersData}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);

const styles = StyleSheet.create({
  chatListContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
  },
  chatItem: {
    padding: 15,
    flexDirection: 'row',
  },
  userRow: {
    flexDirection: 'row',
  },
  chatUserName: {
    flex: 1,
  },
});
