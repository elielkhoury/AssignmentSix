import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {reload} from '../../../redux/actions/index';
import {RootState} from '../../../redux/reducers';
import Post from './Post';
import {AppDispatch} from '../../../redux/store';

interface PostType {
  id: string;
  caption: string;
  isMuted?: boolean;
}

const Feed: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {feed} = useSelector((state: RootState) => state.usersState); // Accessing the feed from Redux state.
  const [refreshing, setRefreshing] = useState<boolean>(false); // State to control the refresh indicator.
  const [posts, setPosts] = useState<PostType[]>([]); // Local state for posts, including mute status.

  // Effect to update posts whenever the feed changes.
  useEffect(() => {
    // Mapping the feed to include a default muted status.
    const updatedPosts = feed.map(post => ({
      id: post.id,
      caption: post.description, // Using the description as caption.
      isMuted: true, // Defaulting posts to muted.
    }));
    setPosts(updatedPosts); // Updating local state.
  }, [feed]);

  // Function to handle pull-to-refresh action.
  const onRefresh = () => {
    setRefreshing(true);
    dispatch(reload()); // Dispatching an action to reload the feed.
    setRefreshing(false); // Resetting refresh state after dispatch.
  };

  // Function to toggle the mute status of a post.
  const toggleMuteStatus = (postId: string) => {
    setPosts(currentPosts =>
      currentPosts.map(
        post => (post.id === postId ? {...post, isMuted: !post.isMuted} : post), // Toggling the isMuted property.
      ),
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Adding pull-to-refresh functionality.
        }
        renderItem={({item}) => (
          <View style={styles.postContainer}>
            <Post
              post={item}
              isMuted={item.isMuted}
              toggleMute={() => toggleMuteStatus(item.id)} // Passing function to toggle mute.
            />
            <TouchableOpacity
              style={styles.muteButton}
              onPress={() => toggleMuteStatus(item.id)}>
              <Text>{item.isMuted ? 'Unmute' : 'Mute'}</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postContainer: {
    marginBottom: 20,
  },
  muteButton: {
    padding: 10,
    backgroundColor: '#DDD',
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default Feed;
