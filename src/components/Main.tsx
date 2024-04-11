import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {Dispatch, UnknownAction, bindActionCreators} from 'redux';
import {reload} from '../redux/actions/index';
import messaging from '@react-native-firebase/messaging';

import CameraScreen from './main/add/Camera';
import ChatListScreen from './main/chat/List';
import FeedScreen from './main/post/Feed';
// import ProfileScreen from './main/profile/Profile';
import SearchScreen from './main/profile/Search';

interface Chat {
  readByCurrentUser: boolean;
}

interface User {
  uid: string;
  banned?: boolean;
  isAdmin?: boolean;
}

interface MainProps {
  navigation: {
    navigate: (route: string, params?: any) => void;
  };
  currentUser: User | null;
  chats: Chat[];
  reload: () => void;
}

const Tab = createMaterialBottomTabNavigator();

function Main({navigation, currentUser, chats}: MainProps) {
  const [unreadChats, setUnreadChats] = useState(false);

  // Request notification permission on mount
  useEffect(() => {
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    };

    requestPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('FCM Message Data:', remoteMessage.data);
    });

    return unsubscribe;
  }, []);

  // Determine if there are any unread chats
  useEffect(() => {
    const hasUnreadChats = chats.some(
      (chat: {readByCurrentUser: any}) => !chat.readByCurrentUser,
    );
    setUnreadChats(hasUnreadChats);
  }, [chats]);

  // Navigate to blocked or admin screen based on user status
  useEffect(() => {
    if (currentUser?.banned) {
      navigation.navigate('Blocked');
    } else if (currentUser?.isAdmin) {
      navigation.navigate('Admin');
    } else {
    }
  }, [currentUser, navigation]);

  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName="Feed"
        labeled={false}
        barStyle={styles.tabBar}>
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="magnify" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="camera" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatListScreen}
          options={{
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({color}) => (
              <View style={styles.iconContainer}>
                {unreadChats && <View style={styles.unreadIndicator} />}
                <MaterialCommunityIcons name="chat" color={color} size={26} />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
      ;
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabBar: {
    backgroundColor: '#ffffff',
  },
  iconContainer: {
    position: 'relative',
  },
  unreadIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
});

const mapStateToProps = (store: {
  userState: {
    friendsRequests: any;
    currentUser: any;
    chats: any;
  };
}) => ({
  currentUser: store.userState.currentUser,
  chats: store.userState.chats,
  friendsRequests: store.userState.friendsRequests,
});

const mapDispatchToProps = (dispatch: Dispatch<UnknownAction>) =>
  bindActionCreators({reload}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
