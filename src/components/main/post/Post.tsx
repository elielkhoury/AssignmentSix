import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  deletePost,
  fetchUserPosts,
  sendNotification,
} from '../../../redux/actions/index';

import {db} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/services/firebaseConfig';
import {doc, getDoc, setDoc, deleteDoc, onSnapshot} from 'firebase/firestore';

// Defining prop types for the Post component.
interface Props {
  route?: {
    params?: {
      notification?: {userId: string; postId: string};
      user?: {uid: string};
      item?: {id: string};
    };
  };
  currentUser: {uid: string};
  deletePost: typeof deletePost;
  fetchUserPosts: typeof fetchUserPosts;
  sendNotification: typeof sendNotification;
  post?: PostItem;
  isMuted?: boolean;
  toggleMute?: () => void;
}

// Types for user and post items.
interface User {
  uid: string;
  name: string;
  image?: string;
}

interface PostItem {
  id: string;
  caption: string;
  downloadURL?: string;
}

const Post: React.FC<Props> = props => {
  const [item, setItem] = useState<PostItem | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentUserLike, setCurrentUserLike] = useState(false);

  // Effect to fetch post and user data on component mount or when dependencies change.
  useEffect(() => {
    const fetchPostData = async () => {
      let userId: string = '';
      let postId: string = '';

      if (props.route && props.route.params) {
        if (props.route.params.notification) {
          ({userId, postId} = props.route.params.notification);
        } else if (props.route.params.user && props.route.params.item) {
          userId = props.route.params.user.uid;
          postId = props.route.params.item.id;
        }

        // Fetch user data from Firestore.
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser({...(userSnap.data() as User), uid: userSnap.id});
        }

        // Fetch post data from Firestore.
        const postRef = doc(db, 'posts', userId, 'userPosts', postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          setItem({...(postSnap.data() as PostItem), id: postSnap.id});
        }

        // Listen for changes in like status.
        const likeRef = doc(
          db,
          'posts',
          userId,
          'userPosts',
          postId,
          'likes',
          props.currentUser.uid,
        );
        onSnapshot(likeRef, snapshot => {
          setCurrentUserLike(snapshot.exists());
        });
      }
    };

    fetchPostData();
  }, [props.route, props.currentUser.uid]);

  // Handling like action.
  const onLikePress = async () => {
    if (user && item) {
      await setDoc(
        doc(
          db,
          'posts',
          user.uid,
          'userPosts',
          item.id,
          'likes',
          props.currentUser.uid,
        ),
        {},
      );
      setCurrentUserLike(true);
    }
  };

  // Handling dislike action.
  const onDislikePress = async () => {
    if (user && item) {
      await deleteDoc(
        doc(
          db,
          'posts',
          user.uid,
          'userPosts',
          item.id,
          'likes',
          props.currentUser.uid,
        ),
      );
      setCurrentUserLike(false);
    }
  };

  // Rendering post content or loading text.
  if (!user || !item) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>{user.name}</Text>{' '}
      {/* Displaying the name of the user who posted. */}
      <Text>{item.caption}</Text>
      <TouchableOpacity
        onPress={currentUserLike ? onDislikePress : onLikePress}>
        <Icon
          name={currentUserLike ? 'heart' : 'heart-outline'}
          size={24}
          color={currentUserLike ? 'red' : 'black'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Redux connection to map state to props and dispatch actions.
const mapStateToProps = (state: any) => ({
  currentUser: state.userState.currentUser,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({deletePost, fetchUserPosts, sendNotification}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Post);
