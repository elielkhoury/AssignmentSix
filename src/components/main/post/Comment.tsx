import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchUsersData, sendNotification} from '../../../redux/actions';
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  doc,
} from 'firebase/firestore';
import {getDoc} from 'firebase/firestore/lite';
import {RootState} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/redux/reducers';
import {db} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/services/firebaseConfig';

interface CommentProps {
  route: {
    params: {
      uid: string;
      postId: string;
    };
  };
  users: any[];
  currentUser: {
    uid: string;
    name: string;
    image: string;
    notificationToken?: string;
  };
  fetchUsersData: typeof fetchUsersData;
  sendNotification: typeof sendNotification;
}

const Comment: React.FC<CommentProps> = ({
  route,
  currentUser,
  // eslint-disable-next-line @typescript-eslint/no-shadow
  sendNotification,
}) => {
  const [comments, setComments] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const fetchComments = async () => {
      const postCommentsQuery = query(
        collection(
          db, // Use db from firebaseConfig.ts
          'posts',
          route.params.uid,
          'userPosts',
          route.params.postId,
          'comments',
        ),
        orderBy('creation', 'desc'),
      );
      const querySnapshot = await getDocs(postCommentsQuery);
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const fetchedComments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        creation: doc.data().creation.toDate(), // Convert Timestamp to Date
      }));
      setComments(fetchedComments);
    };

    fetchComments();
  }, [route.params.uid, route.params.postId]);

  // Handle sending a new comment
  const onCommentSend = async () => {
    if (input.trim().length === 0) {
      return;
    }

    setInput('');
    textInputRef.current?.clear();

    // Add comment to Firestore
    await addDoc(
      collection(
        db,
        'posts',
        route.params.uid,
        'userPosts',
        route.params.postId,
        'comments',
      ),
      {
        creator: currentUser.uid,
        text: input,
        creation: serverTimestamp(),
      },
    );

    const userDocRef = doc(db, 'users', route.params.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists() && userDoc.data().notificationToken) {
      sendNotification(
        userDoc.data().notificationToken,
        'New Comment',
        `${currentUser.name} commented on your post.`,
        {type: 'comment', user: currentUser.uid},
      );
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        renderItem={({item}) => (
          <View style={styles.commentContainer}>
            <Text>{item.text}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <TextInput
        ref={textInputRef}
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Write a comment..."
      />
      <TouchableOpacity style={styles.sendButton} onPress={onCommentSend}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  sendButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
  },
  commentContainer: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

// Connect component to Redux store
const mapStateToProps = (state: RootState) => ({
  users: state.usersState.users,
  currentUser: state.userState.currentUser,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      fetchUsersData,
      sendNotification,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
