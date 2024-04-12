import React, {useState} from 'react';
import {
  Button,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {launchImageLibrary} from 'react-native-image-picker';
import auth from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/services/firebaseConfig';
import {
  db,
  storage,
} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/services/firebaseConfig';
import {doc, updateDoc} from 'firebase/firestore';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import {connect} from 'react-redux';
import {updateUserFeedPosts} from '../../../redux/actions/index';
import {
  container,
  utils,
} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/components/style';

function Edit(props: {
  currentUser: {name: any; description: any; image: any};
  updateUserFeedPosts: () => void;
  navigation: {goBack: () => void};
}) {
  // State hooks for user details and image change status remain the same
  const [name, setName] = useState(props.currentUser.name);
  const [description, setDescription] = useState(
    props.currentUser.description || '',
  );
  const [image, setImage] = useState(props.currentUser.image);
  const [imageChanged, setImageChanged] = useState(false);

  // Function to open the image library and update state with the selected image.
  const pickImage = async () => {
    const result = await launchImageLibrary({mediaType: 'photo', quality: 1});
    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImage(uri);
      setImageChanged(true);
    }
  };

  // Function to save the updated user profile.
  const Save = async () => {
    // Get the currentUser and ensure it exists before proceeding
    const currentUser = auth().currentUser;

    if (!currentUser) {
      console.error('No signed-in user available.');
      return;
    }

    // Proceed with the rest of the function if currentUser is not null
    if (imageChanged && image) {
      const uri = image;
      const childPath = `profile/${currentUser.uid}`;
      const storageRef = ref(storage, childPath);

      const response = await fetch(uri);
      const blob = await response.blob();

      uploadBytes(storageRef, blob).then(snapshot => {
        getDownloadURL(snapshot.ref).then(downloadURL => {
          updateProfile({name, description, image: downloadURL});
        });
      });
    } else {
      updateProfile({name, description});
    }
  };

  const updateProfile = async (data: {
    name: any;
    description: any;
    image?: string;
  }) => {
    const currentUser = auth().currentUser;

    if (!currentUser) {
      console.error('No signed-in user available for profile update.');
      return;
    }

    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, data);
    props.updateUserFeedPosts();
    props.navigation.goBack();
  };

  return (
    <View style={container.form}>
      {/* Touchable icon to trigger image library. */}
      <TouchableOpacity onPress={pickImage}>
        {image === 'default' ? (
          <Icon name="user" size={80} />
        ) : (
          <Image source={{uri: image}} style={utils.profileImageBig} />
        )}
        <Text>Change Profile Photo</Text>
      </TouchableOpacity>
      {/* Input fields for name and description. */}
      <TextInput value={name} onChangeText={setName} placeholder="Name" />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
      />
      <Button title="Save Changes" onPress={Save} />
    </View>
  );
}

// Connecting component to Redux store.
const mapStateToProps = (state: {userState: {currentUser: any}}) => ({
  currentUser: state.userState.currentUser,
});

const mapDispatchToProps = {
  updateUserFeedPosts,
};

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
