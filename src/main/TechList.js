import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../helpers/firebase';
import { useUser } from '../helpers/Mosta5demContext';
import './Sass/TechList.scss';

const TechList = ({ onClose }) => {
  const [techData, setTechData] = useState({
    techName: "",
    techCon: "",
    estimCost: "",
    paidby: "",
    techZip: "",
    techState: "",
    techCoverage: 40,
    techNote: "",
    techTrade: "",
    techUrgency: "",
    freeEstim: true,
  });

  const { currentMosta5dem } = useUser();

  useEffect(() => {
    console.log('TechList props:', { currentMosta5dem });
  }, [currentMosta5dem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTechData({
      ...techData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentMosta5dem) {
      console.error('CurrentMosta5dem is undefined');
      alert('Cannot add technician: User not logged in');
      return;
    }
    try {
      console.log('CurrentMosta5dem:', currentMosta5dem); // Debug log
      const techListCollection = collection(db, 'siyanjiye');
      const docRef = await addDoc(techListCollection, {
        ...techData,
        AddedBy: currentMosta5dem,
      });
      await updateDoc(docRef, { techId: docRef.id });
      alert('Technician added successfully');
      onClose();
    } catch (error) {
      console.error('Error adding technician:', error);
      alert('Error adding technician');
    }
  };

  return (
    <div className="tech-list-modal">
      <div className="tech-list-content">
        <h2>Add Technician</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="techName">Name</label>
            <input
              type="text"
              id="techName"
              name="techName"
              value={techData.techName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="techCon">Contact</label>
            <input
              type="text"
              id="techCon"
              name="techCon"
              value={techData.techCon}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="estimCost">Estimation Cost</label>
            <input
              type="text"
              id="estimCost"
              name="estimCost"
              value={techData.estimCost}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="paidby">Paid By</label>
            <input
              type="text"
              id="paidby"
              name="paidby"
              value={techData.paidby}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="techZip">Zip Code</label>
            <input
              type="text"
              id="techZip"
              name="techZip"
              value={techData.techZip}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="techState">State</label>
            <input
              type="text"
              id="techState"
              name="techState"
              value={techData.techState}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="techCoverage">Coverage Area</label>
            <input
              type="number"
              id="techCoverage"
              name="techCoverage"
              value={techData.techCoverage}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="techNote">Notes</label>
            <textarea
              id="techNote"
              name="techNote"
              value={techData.techNote}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="techTrade">Trade</label>
            <input
              type="text"
              id="techTrade"
              name="techTrade"
              value={techData.techTrade}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="techUrgency">Urgency</label>
            <input
              type="text"
              id="techUrgency"
              name="techUrgency"
              value={techData.techUrgency}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="freeEstim">Free Estimation</label>
            <input
              type="checkbox"
              id="freeEstim"
              name="freeEstim"
              checked={techData.freeEstim}
              onChange={() => setTechData({ ...techData, freeEstim: !techData.freeEstim })}
            />
          </div>
          <div className="button-group">
            <button type="submit" className="button-primary">Add</button>
            <button type="button" className="button-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TechList;
