import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import App from './App';
import { UserProvider } from './helpers/Mosta5demContext';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create root instead of render
root.render(
  <UserProvider>
    <App />
  </UserProvider>
);
