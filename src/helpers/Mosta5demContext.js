// Mosta5demContext.js
import React, { createContext, useContext, useState } from 'react';

const Mosta5demContext = createContext();

export const useUser = () => useContext(Mosta5demContext);

export const UserProvider = ({ children }) => {
  const [currentMosta5dem, setCurrentMosta5dem] = useState(null);
  const [currentMosta5demType, setCurrentMosta5demType] = useState('');
  const [currentMosta5demContact, setCurrentMosta5demContact] = useState('');
  const [currentMosta5demEmail, setCurrentMosta5demEmail] = useState('');
  const [currentMosta5demName, setCurrentMosta5demName] = useState('');
  const [currentMosta5demLastName, setCurrentMosta5demLastName] = useState('');
  
  return (
    <Mosta5demContext.Provider
      value={{
        currentMosta5dem,
        setCurrentMosta5dem,
        currentMosta5demType,
        setCurrentMosta5demType,
        currentMosta5demContact,
        setCurrentMosta5demContact,
        currentMosta5demEmail,
        setCurrentMosta5demEmail,
        currentMosta5demName,
        setCurrentMosta5demName,
        currentMosta5demLastName,
        setCurrentMosta5demLastName,
      }}
    >
      {children}
    </Mosta5demContext.Provider>
  );
};
