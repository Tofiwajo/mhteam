import React, { useState, useEffect } from 'react';
import Manager from './main/Manager';
import Moudir from './main/Moudir';
import Mwazzaf from './main/Mwazzaf';
import TechList from './main/TechList';
import Invoicing from "./main/Invoicing";
import { useUser } from './helpers/Mosta5demContext';
import './Dashboard.css';

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
    <div id='Column'>
      <div id="navbar">
        <div id='navbarTitle'>
          Welcome {currentMosta5demName} {currentMosta5demLastName}
        </div>
        <div className='flexItem'>
          <button className='btn' onClick={() => handleComponentToggle('Invoicing')}>
            Invoicing
          </button>
          <button className='btn' onClick={() => handleComponentToggle('Manager')}>
            Manager
          </button>
          <button className='btn' onClick={() => handleComponentToggle('Moudir')}>
            Admin
          </button>
          <button className='btn' onClick={() => handleComponentToggle('Mwazzaf')}>
            Jobs Processing
          </button>
          <button className='btn' onClick={() => handleComponentToggle('TechList')}>
            Technicians
          </button>
          <button id='leavebtn' onClick={handleLeave}>
            Sign out
          </button>
        </div>
      </div>

      <div id='content'>
        {visibleComponent === 'Invoicing' && (currentMosta5demType === "DataTeam" || currentMosta5demType === "Admin") && (
          <Invoicing currentMosta5dem={currentMosta5dem} />
        )}
        {visibleComponent === 'Manager' && (currentMosta5demType === "Manager" || currentMosta5demType === "Admin") && (
          <Manager currentMosta5dem={currentMosta5dem} />
        )}
        {visibleComponent === 'Moudir' && (currentMosta5demType === "DataTeam" || currentMosta5demType === "Admin") && (
          <Moudir currentMosta5dem={currentMosta5dem} />
        )}
        {visibleComponent === 'Mwazzaf' && (currentMosta5demType === "Manager" || currentMosta5demType === "teamLeader" || currentMosta5demType === "Dispatcher" || currentMosta5demType === "Admin") && (
          <Mwazzaf currentMosta5dem={currentMosta5dem} />
        )}
        {visibleComponent === 'TechList' && (currentMosta5demType === "Manager" || currentMosta5demType === "teamLeader" || currentMosta5demType === "Dispatcher" || currentMosta5demType === "Admin") && (
          <TechList onClose={() => handleComponentToggle('none')} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
