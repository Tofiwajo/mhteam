// Dashboard.js
import React, { useState, useEffect } from 'react';
import Moudir from './main/Moudir';
import Mwazzaf from './main/Mwazzaf';
import TechList from './main/TechList';
import { useUser } from './helpers/Mosta5demContext';

const Dashboard = () => {
  const {
    currentMosta5dem,
    currentMosta5demType,
    currentMosta5demContact,
    currentMosta5demEmail,
    currentMosta5demName,
    currentMosta5demLastName,
    setCurrentMosta5dem
  } = useUser();

  const [visibleComponent, setVisibleComponent] = useState('none');

  const handleLeave = () => {
    setCurrentMosta5dem(null);
  };

  const handleComponentToggle = (componentName) => {
    setVisibleComponent(visibleComponent === componentName ? 'none' : componentName);
  };

  useEffect(() => {
    console.log('Dashboard props:', {
      currentMosta5dem,
      currentMosta5demType,
      currentMosta5demContact,
      currentMosta5demEmail,
      currentMosta5demName,
      currentMosta5demLastName,
    });
  }, [currentMosta5dem]);

  if (!currentMosta5dem) {
    return <p>No user is logged in</p>;
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Welcome {currentMosta5demName} {currentMosta5demLastName}
      </p>
      <button onClick={handleLeave} style={{ marginBottom: '20px', padding: '10px 20px' }}>
        Leave
      </button>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => handleComponentToggle('Moudir')} style={{ margin: '5px' }}>
          Toggle Moudir
        </button>
        <button onClick={() => handleComponentToggle('Mwazzaf')} style={{ margin: '5px' }}>
          Toggle Mwazzaf
        </button>
        <button onClick={() => handleComponentToggle('TechList')} style={{ margin: '5px' }}>
          Toggle TechList
        </button>
      </div>
      {visibleComponent === 'Moudir' && (
        <Moudir
          currentMosta5dem={currentMosta5dem}
        />
      )}
      {visibleComponent === 'Mwazzaf' && (
        <Mwazzaf
          currentMosta5dem={currentMosta5dem}
        />
      )}
      {visibleComponent === 'TechList' && (
        <TechList
          onClose={() => handleComponentToggle('none')}
        />
      )}
    </div>
  );
};

export default Dashboard;
