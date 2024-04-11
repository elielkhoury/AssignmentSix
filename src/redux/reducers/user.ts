import {
  CLEAR_DATA,
  USER_CHATS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_STATE_CHANGE,
} from '../constants';

interface UserState {
  currentUser: any | null;
  posts: any[];
  chats: any[];
  following: string[];
}

interface Action {
  type: string;
  currentUser?: any;
  posts?: any[];
  chats?: any[];
  following?: string[];
}

// Initial state of the user reducer
const initialState: UserState = {
  currentUser: null,
  posts: [],
  chats: [],
  following: [],
};

export const user = (
  state: UserState = initialState,
  action: Action,
): UserState => {
  switch (action.type) {
    case USER_STATE_CHANGE:
      return {
        ...state,
        currentUser: action.currentUser,
      };
    case USER_POSTS_STATE_CHANGE:
      return {
        ...state,
        posts: action.posts ?? [],
      };
    case USER_FOLLOWING_STATE_CHANGE:
      return {
        ...state,
        following: action.following ?? [],
      };
    case USER_CHATS_STATE_CHANGE:
      return {
        ...state,
        chats: action.chats ?? [],
      };
    case CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
};
