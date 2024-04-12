import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {firebaseAuth} from '/Users/elieelkhoury/Desktop/Eurisko/AssignmentSix/src/services/firebaseConfig';
import {signInWithEmailAndPassword} from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        navigate('/home');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const onSignIn = async () => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
  };

  if (!firebaseAuth.currentUser) {
    return (
      <div className="container vertical-center">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <h3>Sign In</h3>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                value={email}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                value={password}
              />
            </div>
            <button className="btn btn-primary btn-block" onClick={onSignIn}>
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null; // Render nothing if the user is already logged in
}

function alert(message: string) {
  console.log(message); // Implement your own alert handling or use something like toast notifications
}
