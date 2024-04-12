import React from 'react';
import {View} from 'react-native';
import {
  DrawerContentScrollView,
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {Provider as PaperProvider, Drawer} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Dummy screens
function UsersScreen() {
  return <View />;
}

function UserScreen() {
  return <View />;
}

function PostScreen() {
  return <View />;
}

const DrawerContent = (props: DrawerContentComponentProps) => (
  <DrawerContentScrollView {...props}>
    <Drawer.Section title="Menu">
      <Drawer.Item
        label="Users"
        // eslint-disable-next-line react/no-unstable-nested-components
        icon={({color, size}) => (
          <Icon name="account" color={color} size={size} />
        )}
        onPress={() => props.navigation.navigate('Users')}
      />
    </Drawer.Section>
  </DrawerContentScrollView>
);

const DrawerNavigator = createDrawerNavigator();

function Home() {
  return (
    <PaperProvider>
      <DrawerNavigator.Navigator
        // eslint-disable-next-line react/no-unstable-nested-components
        drawerContent={(props: DrawerContentComponentProps) => (
          <DrawerContent {...props} />
        )}>
        <DrawerNavigator.Screen name="Users" component={UsersScreen} />
        <DrawerNavigator.Screen name="User" component={UserScreen} />
        <DrawerNavigator.Screen name="Post" component={PostScreen} />
      </DrawerNavigator.Navigator>
    </PaperProvider>
  );
}

export default Home;
