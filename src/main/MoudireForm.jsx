import React, { useState, useEffect } from 'react';
import { db } from '../helpers/firebase';
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';

const AddJobForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    woNum: '',
    callerNumber: '',
    clientName: '',
    contact: '',
    estimNeeded: '',
    ivrNumb: '',
    ivrcode: '',
    jobState: '',
    jobZip: '',
    jobdescr: '',
    joblocation: '',
    neededdate: '',
    nte: '',
    poNumb: '',
    streetAddress: '',
    submdate: '',
    trade: '',
    urgency: '',
    jobStatus: '',
    assignedBy: '',
    assignedManager: '',
    assignedDispatcher: '',
    assignedEstimTech: '',
    assignedJobDoneTech: '',
    jobId: '' // This will hold the ID of the new document in the collection 2achghal
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'mosta5dem'));
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUserChange = (e) => {
    setFormData({
      ...formData,
      jobId: e.target.value // Set the selected user's ID as jobId
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jobData = { ...formData };

    // Add a new document to the collection 2achghal
    const docRef = await addDoc(collection(db, '2achghal'), jobData);

    // Get the ID of the newly added document
    const newJobId = docRef.id;

    // Update the job document with the jobId
    await updateDoc(doc(db, '2achghal', newJobId), { jobId: newJobId });

    // Trigger the onSubmit callback with the updated job data
    await onSubmit({ ...jobData, jobId: newJobId });

    // Optionally, clear the form or perform any other necessary actions after submission
    setFormData({
      woNum: '',
      callerNumber: '',
      clientName: '',
      contact: '',
      estimNeeded: '',
      ivrNumb: '',
      ivrcode: '',
      jobState: '',
      jobZip: '',
      jobdescr: '',
      joblocation: '',
      neededdate: '',
      nte: '',
      poNumb: '',
      streetAddress: '',
      submdate: '',
      trade: '',
      urgency: '',
      jobStatus: '',
      assignedBy: '',
      assignedManager: '',
      assignedDispatcher: '',
      assignedEstimTech: '',
      assignedJobDoneTech: '',
      jobId: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(formData).filter(key => key !== 'jobId').map((key) => (
        <div key={key}>
          <label>{key}</label>
          <input
            type="text"
            name={key}
            value={formData[key]}
            onChange={handleChange}
          />
        </div>
      ))}

      <div>
        <label>Select User:</label>
        <select name="jobId" onChange={handleUserChange} value={formData.jobId}>
          <option value="">Select a user</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.nameMosta5dem} {user.lastNameMosta5dem}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">Add Job</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default AddJobForm;
