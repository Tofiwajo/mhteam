// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { UserProvider  } from './helpers/Mosta5demContext';

ReactDOM.render(
  <UserProvider>
    <App />
  </UserProvider>,
  document.getElementById('root')
);