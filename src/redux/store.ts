import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {user} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/redux/reducers/user';
import {users} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/redux/reducers/users';

// Combine the user and users reducers into a single rootReducer
const rootReducer = combineReducers({
  userState: user,
  usersState: users,
});

// Configure the store with the rootReducer
const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
