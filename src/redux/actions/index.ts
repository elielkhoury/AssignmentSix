import {
  db,
  auth,
} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/services/firebaseConfig';
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  getDocs,
  onSnapshot,
  where,
  deleteDoc,
} from 'firebase/firestore';
import {User} from 'firebase/auth';
import {
  CLEAR_DATA,
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  USER_CHATS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_STATE_CHANGE,
  USERS_BY_USERNAME,
} from '../constants';

// Redux actions and other code using db and auth
export const clearData = () => ({
  type: CLEAR_DATA,
});

// Action to reload user-related data
export const reload = () => async (dispatch: any) => {
  dispatch(clearData());
  dispatch(fetchUser());
  dispatch(fetchUserPosts());
  dispatch(fetchUserFollowing());
  dispatch(fetchUserChats());
};

export const fetchUser = () => async (dispatch: any) => {
  if (auth.currentUser) {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      dispatch({
        type: USER_STATE_CHANGE,
        currentUser: {uid: auth.currentUser.uid, ...userSnap.data()},
      });
    }
  }
};

// Fetch current user's posts
export const fetchUserPosts = () => async (dispatch: any) => {
  if (auth.currentUser) {
    const postsQuery = query(
      collection(db, 'posts', auth.currentUser.uid, 'userPosts'),
      orderBy('creation', 'desc'),
    );
    const querySnapshot = await getDocs(postsQuery);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const posts = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

    dispatch({type: USER_POSTS_STATE_CHANGE, posts});
  }
};

// Fetch list of users current user is following
export const fetchUserFollowing = () => async (dispatch: any) => {
  if (auth.currentUser) {
    const followingQuery = collection(
      db,
      'following',
      auth.currentUser.uid,
      'userFollowing',
    );
    const querySnapshot = await getDocs(followingQuery);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const following = querySnapshot.docs.map(doc => doc.id);

    dispatch({type: USER_FOLLOWING_STATE_CHANGE, following});
    following.forEach(uid => {
      dispatch(fetchUsersData(uid, true));
    });
  }
};

// Fetch data for specific users, including their posts if requested
export const fetchUsersData =
  (uid: string, getPosts: boolean) => async (dispatch: any, getState: any) => {
    const found = getState().usersState.users.some((el: any) => el.uid === uid);
    if (!found) {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        let user = {uid, ...userDoc.data()};
        dispatch({type: USERS_DATA_STATE_CHANGE, user});
      }
      if (getPosts) {
        dispatch(fetchUsersPosts(uid));
      }
    }
  };

// Fetch posts for specific users
export const fetchUsersPosts = (uid: string) => async (dispatch: any) => {
  const postsQuery = query(
    collection(db, 'posts', uid, 'userPosts'),
    orderBy('creation', 'desc'),
  );
  const querySnapshot = await getDocs(postsQuery);
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const posts = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    user: uid,
  }));

  dispatch({type: USERS_POSTS_STATE_CHANGE, posts, uid});
};

export const sendNotification = async (
  to: string,
  title: string,
  body: string,
  data: any,
) => {
  console.log('Sending notification:', {to, title, body, data});
};

// Fetch user chats from Firestore and observe for real-time updates
export const fetchUserChats = () => async (dispatch: any) => {
  if (auth.currentUser) {
    const chatsQuery = query(
      collection(db, 'chats'),
      where('users', 'array-contains', auth.currentUser.uid),
    );
    onSnapshot(chatsQuery, snapshot => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      let chats = snapshot.docs.map(doc => {
        const data = doc.data();
        const id = doc.id;
        return {id, ...data};
      });
      dispatch({type: USER_CHATS_STATE_CHANGE, chats});
    });
  }
};

// Delete a post from Firestore
export const deletePost =
  (postId: string, userId: string) => async (dispatch: any) => {
    try {
      await deleteDoc(doc(db, 'posts', userId, 'userPosts', postId));
      console.log('Post deleted successfully');
      dispatch({
        type: deletePost,
        payload: {postId},
      });
    } catch (error) {
      console.error('Error deleting post: ', error);
    }
  };

// Update user feed posts in the Redux store
export const updateUserFeedPosts =
  () =>
  async (dispatch: (arg0: {type: string; posts: {id: string}[]}) => void) => {
    if (!auth.currentUser) {
      console.error('No authenticated user found.');
      return;
    }

    const uid = auth.currentUser.uid;
    const postsRef = collection(db, 'posts', uid, 'userPosts');
    const q = query(postsRef, where('uid', '==', uid));

    const querySnapshot = await getDocs(q);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    dispatch({
      type: USER_POSTS_STATE_CHANGE,
      posts,
    });
  };

// Search for users by username
export const queryUsersByUsername =
  (searchText: string) => async (dispatch: any) => {
    if (!searchText.trim()) {
      return;
    }

    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('username', '>=', searchText),
      where('username', '<=', searchText + '\uf8ff'),
    );
    const querySnapshot = await getDocs(q);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const users: User[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<User, 'id'>),
    }));

    dispatch({
      type: USERS_BY_USERNAME,
      payload: users,
    });
  };
