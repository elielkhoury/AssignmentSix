import React, {useState} from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import Video from 'react-native-video';
import {Snackbar} from 'react-native-paper';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUserPosts, sendNotification} from '../../../redux/actions';
import {
  container,
  text,
  utils,
} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/components/style';
import {
  db,
  storage,
} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/services/firebaseConfig';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import {collection, doc, setDoc} from 'firebase/firestore';

type SaveProps = {
  navigation: any;
  route: any;
  currentUser: any;
};

const Save: React.FC<SaveProps> = ({navigation, route, currentUser}) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [caption] = useState(''); // Added state for caption

  const uploadImage = async () => {
    if (route.params.source) {
      setUploading(true);
      const response = await fetch(route.params.source);
      const blob = await response.blob();

      const fileRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}`);
      uploadBytes(fileRef, blob)
        .then(async snapshot => {
          const downloadURL = await getDownloadURL(snapshot.ref);

          const postRef = doc(collection(db, 'posts'));
          await setDoc(postRef, {
            caption, // Use the state value
            imageUrl: downloadURL,
            user: currentUser.uid,
            createdAt: new Date(),
          });

          Alert.alert(
            'Upload Successful',
            'Your post has been uploaded successfully.',
          );
          navigation.goBack();
        })
        // eslint-disable-next-line @typescript-eslint/no-shadow
        .catch(error => {
          console.error('Upload failed: ', error);
          setError(true);
        })
        .finally(() => setUploading(false));
    }
  };

  // Placeholder function if needed or remove if not used
  const renderMentionsTextInput = () => {
    return null;
  };

  return (
    <View style={[container.container, utils.backgroundWhite]}>
      {uploading ? (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={[text.bold, text.large]}>Upload in progress...</Text>
        </View>
      ) : (
        <View>
          {renderMentionsTextInput()}
          {route.params.type === 'video' ? (
            <Video
              source={{uri: route.params.source}}
              style={styles.media}
              resizeMode="cover"
              repeat={true}
            />
          ) : (
            <Image source={{uri: route.params.source}} style={styles.media} />
          )}
        </View>
      )}
      <Button title="Upload" onPress={uploadImage} />{' '}
      <Snackbar
        visible={error}
        onDismiss={() => setError(false)}
        duration={2000}>
        Something went wrong!
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  media: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  headerRightIcon: {
    marginRight: 10,
  },
  uploadingContainer: {
    ...container.container,
    ...utils.justifyCenter,
    ...utils.alignItemsCenter,
  },
});

const mapStateToProps = (state: any) => ({
  currentUser: state.userState.currentUser,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({fetchUserPosts, sendNotification}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Save);
