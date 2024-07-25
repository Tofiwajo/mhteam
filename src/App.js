// App.js
import React, { useState } from 'react';
import { db } from './helpers/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Dashboard from './Dashboard';
import { useUser } from './helpers/Mosta5demContext';

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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <input
        type="email"
        placeholder="Enter email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: '10px', padding: '10px', width: '300px' }}
      />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: '10px', padding: '10px', width: '300px' }}
      />
      <button onClick={handleLogin} style={{ padding: '10px 20px' }}>
        Let's Go
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default App;
