import {combineReducers} from 'redux';
import {user} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/redux/reducers/user';
import {users} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/redux/reducers/users';

// Combine reducers to create a single rootReducer
const rootReducer = combineReducers({
  userState: user,
  usersState: users,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
