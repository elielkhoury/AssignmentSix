import {
  CLEAR_DATA,
  USERS_DATA_STATE_CHANGE,
  USERS_LIKES_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
} from '../constants';

// User interface to describe the user object shape
interface User {
  id: string;
}

// Post interface to describe the post object shape
interface Post {
  isMuted: boolean | undefined;
  description: any;
  id: string;
  currentUserLike: boolean;
}

// Action interface to describe the actions that can be dispatched
interface Action {
  type: string;
  user?: User;
  posts?: Post[];
  postId?: string;
  currentUserLike?: boolean;
}

// UsersState interface to describe the shape of the users state
interface UsersState {
  users: User[];
  feed: Post[];
  usersFollowingLoaded: number;
}

// Initial state of the users reducer
const initialState: UsersState = {
  users: [],
  feed: [],
  usersFollowingLoaded: 0,
};

// Users reducer to handle actions related to users
export const users = (
  state: UsersState = initialState,
  action: Action,
): UsersState => {
  switch (action.type) {
    case USERS_DATA_STATE_CHANGE:
      return {
        ...state,
        users: action.user ? [...state.users, action.user] : state.users,
      };
    case USERS_POSTS_STATE_CHANGE:
      return {
        ...state,
        usersFollowingLoaded: state.usersFollowingLoaded + 1,
        feed: action.posts ? [...state.feed, ...action.posts] : state.feed,
      };
    case USERS_LIKES_STATE_CHANGE:
      return {
        ...state,
        feed: state.feed.map(post =>
          post.id === action.postId
            ? {...post, currentUserLike: action.currentUserLike ?? false}
            : post,
        ),
      };
    case CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
};
