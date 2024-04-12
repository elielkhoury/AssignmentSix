import React, {useEffect, useState} from 'react';
import {View, Text, Button, ScrollView, StyleSheet, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useRoute} from '@react-navigation/native';

export default function Post() {
  const [post, setPost] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const navigation = useNavigation();
  const route = useRoute();
  const {uid, id} = route.params as any;

  useEffect(() => {
    const postRef = firestore()
      .collection('posts')
      .doc(uid)
      .collection('userPosts')
      .doc(id);

    const unsubscribePost = postRef.onSnapshot(
      (snapshot: {exists: any; id: any; data: () => any}) => {
        if (snapshot.exists) {
          setPost({id: snapshot.id, ...snapshot.data()});
        } else {
          setPost(null);
        }
      },
    );

    const unsubscribeComments = postRef
      .collection('comments')
      .onSnapshot((snapshot: {docs: any[]}) => {
        const loadedComments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(loadedComments);
      });

    return () => {
      unsubscribePost();
      unsubscribeComments();
    };
  }, [uid, id]);

  const deletePost = () => {
    firestore()
      .collection('posts')
      .doc(uid)
      .collection('userPosts')
      .doc(id)
      .delete()
      .then(() => {
        Alert.alert('Post Deleted');
        navigation.goBack();
      })
      .catch((error: {message: string}) => {
        Alert.alert('Error', 'Unable to delete post: ' + error.message);
      });
  };

  if (!post) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{post.caption}</Text>
      <Text style={styles.date}>
        {new Date(post.creation.seconds * 1000).toLocaleDateString()}
      </Text>
      <Button title="Delete Post" onPress={deletePost} />
      <View>
        {comments.map(comment => (
          <Text key={comment.id}>{comment.text}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  date: {
    fontSize: 16,
    marginBottom: 10,
  },
});
