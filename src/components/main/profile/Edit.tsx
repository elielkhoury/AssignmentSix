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
import {
  auth,
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
    if (!auth.currentUser) {
      console.error('No signed-in user available.');
      return;
    }

    // If the image was changed, upload the new image to Firebase Storage.
    if (imageChanged && image) {
      const uri = image;
      const childPath = `profile/${auth.currentUser.uid}`;
      const storageRef = ref(storage, childPath);

      // Fetch the blob and upload, then update profile with downloadURL
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

  // Function to update Firestore with the new profile data.
  const updateProfile = async (data: {
    name: any;
    description: any;
    image?: string;
  }) => {
    if (!auth.currentUser) {
      console.error('No signed-in user available for profile update.');
      return;
    }

    const userRef = doc(db, 'users', auth.currentUser.uid);
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
