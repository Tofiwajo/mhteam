// App.js
import React, { useState } from 'react';
import { db } from './helpers/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Dashboard from './Dashboard';
import { useUser } from './helpers/Mosta5demContext';
import './App.css';
   

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {
    currentMosta5dem,
    setCurrentMosta5dem,
    setCurrentMosta5demType,
    setCurrentMosta5demContact,
    setCurrentMosta5demEmail,
    setCurrentMosta5demName,
    setCurrentMosta5demLastName,
  } = useUser();

  const handleLogin = async () => {
    try {
      const q = query(collection(db, 'mosta5dem'), where('emailMosta5dem', '==', email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        if (data.passMosta5dem === password) {
          setCurrentMosta5dem(doc.id);
          setCurrentMosta5demType(data.TypeMosta5dem);
          setCurrentMosta5demContact(data.contactMosta5dem);
          setCurrentMosta5demEmail(data.emailMosta5dem);
          setCurrentMosta5demName(data.nameMosta5dem);
          setCurrentMosta5demLastName(data.lastNameMosta5dem);
          setError('');
        } else {
          setError('Incorrect password');
        }
      } else {
        setError('Email not found');
      }
    } catch (error) {
      setError('An error occurred during login');
      console.error('Login error:', error);
    }
  };

  if (currentMosta5dem) {
    return <Dashboard />;
  }

  return (
    <div className="App">
    <header className="App-header">
        <h1>Management Helpdesk Team</h1>
      </header>


      <div id="actual-App">

      <div className="input">



        <div className="input-text">Enter your Email:</div>
        <input required type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
      


        <div className="input-text">Password:</div>
        <input required type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
      
    
      </div>



      <div>
        <button id='login' onClick={handleLogin}>Log in</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>


      
      <div id="android">Download our Android App</div>
      <button id="download-button">Download APK</button>
      </div>


    </div>
  );
};

export default App;
