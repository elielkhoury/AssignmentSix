import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  ScrollView,
  Button,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {sendNotification} from '../../../redux/actions/index';
import {
  container,
  utils,
} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/components/style';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import {getCurrentUserUid} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/components/utils';
import {db} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/services/firebaseConfig';

// Props interface for type checking
interface ProfileProps {
  route: {params: {uid: string}};
  currentUser: any;
  posts: any[];
  following: string[];
  sendNotification: Function;
}

function Profile({route, currentUser, posts, following}: ProfileProps) {
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch user details and posts on component mount or when dependencies change
  useEffect(() => {
    const currentUserId = getCurrentUserUid();
    if (!currentUserId) {
      console.error(
        "User ID is null, can't proceed with Firestore operations.",
      );
      setLoading(false);
      return;
    }

    let userUid =
      route.params.uid === currentUserId ? currentUserId : route.params.uid;

    if (route.params.uid === currentUserId) {
      setUser(currentUser);
      setUserPosts(posts);
      setLoading(false);
    } else {
      const userRef = doc(db, 'users', userUid);
      getDoc(userRef).then(snapshot => {
        if (snapshot.exists()) {
          setUser({uid: snapshot.id, ...snapshot.data()});
        }
      });

      // Fetching user's posts
      const postsRef = collection(db, 'posts', userUid, 'userPosts');
      const q = query(postsRef, orderBy('creation', 'desc'));
      getDocs(q).then(snapshot => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        let fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserPosts(fetchedPosts);
      });
    }

    setIsFollowing(following.includes(userUid));
  }, [route.params.uid, following, currentUser, posts]);

  // Render loading indicator or user details and posts
  if (loading) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centeredView}>
        <Icon name="dizzy" size={40} color="black" />
        <Text>User Not Found</Text>
      </View>
    );
  }

  const onFollow = async () => {
    const currentUserId = getCurrentUserUid();
    if (!user || !currentUser || !currentUserId) {
      console.error("User ID is null, can't follow.");
      return;
    }

    const followRef = doc(
      db,
      'following',
      currentUserId,
      'userFollowing',
      user.uid,
    );

    try {
      await setDoc(followRef, {});
      console.log(`Now following ${user.uid}`);
      sendNotification(
        user.notificationToken,
        'New Follower',
        `${currentUser.name} started following you`,
        {type: 'follow'},
      );
    } catch (error) {
      console.error('Failed to follow user: ', error);
    }
  };

  const onUnfollow = async () => {
    const currentUserId = getCurrentUserUid();
    if (!user || !currentUser || !currentUserId) {
      console.error("User ID is null, can't unfollow.");
      return;
    }

    const followRef = doc(
      db,
      'following',
      currentUserId,
      'userFollowing',
      user.uid,
    );

    try {
      await deleteDoc(followRef);
      console.log(`Unfollowed ${user.uid}`);
    } catch (error) {
      console.error('Failed to unfollow user: ', error);
    }
  };

  return (
    <ScrollView style={[container.container, utils.backgroundWhite]}>
      <Button
        title={isFollowing ? 'Unfollow' : 'Follow'}
        onPress={isFollowing ? onUnfollow : onFollow}
      />
      {userPosts.length ? (
        userPosts.map(post => (
          <View key={post.id}>
            <Text>{post.description}</Text>
          </View>
        ))
      ) : (
        <Text>No posts found</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (state: any) => ({
  currentUser: state.userState.currentUser,
  posts: state.userState.posts,
  following: state.userState.following,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({sendNotification}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
