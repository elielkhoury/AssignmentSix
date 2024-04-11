import React, {useEffect} from 'react';
import {BackHandler, Text, View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

// This component displays a message indicating the user's account is blocked.
export default function Blocked() {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <Icon name="stop-circle" size={150} color="red" style={styles.icon} />
        <Text style={styles.text}>Your account has been blocked</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    height: '100%',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '90%',
  },
  icon: {
    position: 'absolute',
  },
  text: {
    textAlign: 'center',
    paddingHorizontal: 40,
    fontSize: 20,
    marginTop: 400,
    width: '100%',
  },
});
