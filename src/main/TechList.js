import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../helpers/firebase';
import { useUser } from '../helpers/Mosta5demContext';
import './Techlist.css';
import usaStates from '../helpers/usaStates';

const TechList = ({ onClose }) => {
  const [techData, setTechData] = useState({
    techName: "",
    techCon: "",
    techEstimCost: "",
    techPaidby: "",
    techPaymentAdress:"",
    techZip: "",
    techState: "",
    techCoverage: 40,
    techNote: "",
    techTrade: "",
    techUrgency: "",
    freeEstim: true,
    techLicenses: "",
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
    <div id="body">
        <div class="title">Add Technician</div>
        <div class="fromCon">
            <div>
            <form onSubmit={handleSubmit}>
                <div class="form-group">
                  <div htmlFor="techName" class="label">Name:               </div>
                  <input
                    type="text"
                    id="techName"
                    name="techName"
                    value={techData.techName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div class="form-group">
                  <div htmlFor="techCon" class="label">Contact:            </div>
                  <input
                    type="text"
                    id="techCon"
                    name="techCon"
                    value={techData.techCon}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div class="form-group">
                  <div htmlFor="freeEstim" class="label">Free Estimation:</div>
                  <input
                    type="checkbox"
                    id="freeEstim"
                    name="freeEstim"
                    checked={techData.freeEstim}
                    onChange={() => setTechData({ ...techData, freeEstim: !techData.freeEstim })}
                  />
              
                </div>
                <div class="form-group">
                  <div htmlFor="estimCost" class="label">Estimation Cost:    </div>
                  <input
                    type="text"
                    id="estimCost"
                    name="estimCost"
                    value={techData.estimCost}
                    onChange={handleInputChange}
                  />
                </div>
                <div class="form-group">
                  <div htmlFor="paidby" class="label">Paid By:            </div>
                  <input
                    type="text"
                    id="paidby"
                    name="paidby"
                    value={techData.paidby}
                    onChange={handleInputChange}
                  />
                </div>
                <div class="form-group">
                  <div htmlFor="techPaymentAdress" class="label">Payment address:    </div>
                  <input
                    type="text"
                    id="techPaymentAddress"
                    name="techPaymentAddress"
                    value={techData.techPaymentAdress}
                    onChange={handleInputChange}
                  />
                </div>
                <div class="form-group">
                  <div htmlFor="techZip" class="label">Zip Code:           </div>
                 
                  <input
                    type="text"
                    id="techZip"
                    name="techZip"
                    value={techData.techZip}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div class="form-group">
                  <div htmlFor="techState" class="label">State:              </div>
                  <select 
                   type="text"
                   id="techState"
                   name="techState"
                  value={techData.techState || ''}
                  onChange={(e) => handleInputChange(e, 'techState')}
              >
             
                {usaStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
                
                </div>
                <div class="form-group">
                  <div htmlFor="techCoverage" class="label">Coverage Area:      </div>
                  <input
                    type="number"
                    id="techCoverage"
                    name="techCoverage"
                    value={techData.techCoverage}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div class="form-group">
                  <div htmlFor="techTrade" class="label">Trade:              </div>
                  <input
                    type="text"
                    id="techTrade"
                    name="techTrade"
                    value={techData.techTrade}
                    onChange={handleInputChange}
                  />
                </div>
                <div class="form-group">
                  <div htmlFor="techUrgency" class="label">Urgency:            </div>
                  <input
                    type="text"
                    id="techUrgency"
                    name="techUrgency"
                    value={techData.techUrgency}
                    onChange={handleInputChange}
                  />
                </div>
                <div class="form-group">
                  <div htmlFor="techNote" class="label">Notes:              </div>
                  <textarea
                    id="techNote"
                    name="techNote"
                    value={techData.techNote}
                    onChange={handleInputChange}
                  />
                </div>
                <div class="button-group">
                  <div className='btn'><button type="submit" class="button-primary">Add</button></div>
                  <div className='btn'><button type="button" class="button-secondary" onClick={onClose}>Cancel</button></div>
                </div>
              </form>
            </div>
        </div>
    </div>

  );
};

export default TechList;
