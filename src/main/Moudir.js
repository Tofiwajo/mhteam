import React, { useState, useEffect } from 'react';
import { db, storage } from '../helpers/firebase';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import PhoneListModal from './PhoneListModal';

const Moudir = ({ currentMosta5dem }) => {
  const [form, setForm] = useState({
   
    estimScheduleData:{ 
      estimScheduleTechName:"",
      estimScheduleTechCon:"",
      estimScheduleDate:"",
      estimScheduleTime:"",
      estimScheduleBy:"",
      estimScheduleCost:"",
    },
    estimProcessingData:{
      estimProcessingTechName:"",
      estimProcessingTechCon:"",
      estimProcessingDate:"",
      estimProcessingTechCost:"",
      estimProcessingPaymentAdress:"",
      estimProcessingPaymentPicture:"",
      estimProcessingTechDetails:"",
    },
    jobDoneScheduleData:{
      jobDoneScheduleTechName:"",
      jobDoneScheduleTechCon:"",
      jobDoneScheduleDate:"",
      jobDoneScheduleCost:"",
      jobDoneScheduleTechHours:"",
      jobDoneScheduleTechNum:"",
      jobDoneScheduleMaterials:"",
      jobDoneScheduleDetails:"",
    },
    jobDoneProcessingData:{
      jobDoneProcessingCost:"",
      jobDoneProcessingTechHours:"",
      jobDoneProcessingTechNum:"",
      jobDoneProcessingMaterials:"",
      jobDoneProcessingSupliers:"",
      jobDoneProcessingPaidBy:"",
      jobDoneProcessingPaymentAdress:"",
      jobDonePaymentPicture:"",
      jobDoneProcessingBeforePictures:"",
      jobDoneProcessingAfterPictures:"",
      jobDoneProcessingSignOffPicture:"",
      jobDoneProcessingDetails:"",

    } 
   });
  const [jobs, setJobs] = useState([]);
  const [managers, setManagers] = useState([]);
  const [dispatchers, setDispatchers] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileURLs, setFileURLs] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle file selection
  const onFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  // Upload multiple files
  const handleFileUpload = async (files, jobId) => {
    const urls = {};
    for (const file of files) {
      const fileRef = ref(storage, `files/${jobId}/${file.name}`);
      try {
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        urls[file.name] = downloadURL;
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
    return urls;
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const jobsCollection = collection(db, '2achghal');
      const jobSnapshot = await getDocs(jobsCollection);
      const jobList = jobSnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      }));
      setJobs(jobList);
    };

    const fetchMosta5dem = async () => {
      const mosta5demCollection = collection(db, 'mosta5dem');
      const mosta5demSnapshot = await getDocs(mosta5demCollection);
      const mosta5demList = mosta5demSnapshot.docs.map(doc => doc.data());

      setManagers(mosta5demList.filter(item => item.TypeMosta5dem === 'Manager'));
      setDispatchers(mosta5demList.filter(item => item.TypeMosta5dem === 'Dispatcher'));
    };

    fetchJobs();
    fetchMosta5dem();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Save job data
    const newJobDoc = await addDoc(collection(db, '2achghal'), {
      ...form,
      assignedBy: currentMosta5dem,
      jobStatus: form.estimNeeded ? 'estimationNeeded' : 'jobDoneNeeded'
    });

    // Upload files and get URLs
    if (files.length > 0) {
      const urls = await handleFileUpload(files, newJobDoc.id);
      await updateDoc(doc(db, '2achghal', newJobDoc.id), { fileURLs: urls });
    }

    // Reset form and files
    setForm({
      woNum: '',
      callerNumber: '',
      clientName: '',
      contact: '',
      estimNeeded: false,
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
      jobId: '',
      jobStatus: '',
      assignedBy: '',
      assignedManager: '',
      assignedDispatcher: '',
    },{estimScheduleData:{ 
      estimScheduleTechName:"",
      estimScheduleTechCon:"",
      estimScheduleDate:"",
      estimScheduleTime:"",
      estimScheduleBy:"",
      estimScheduleCost:"",
    }},{
    estimProcessingData:{
      estimProcessingTechName:"",
      estimProcessingTechCon:"",
      estimProcessingDate:"",
      estimProcessingTechCost:"",
      estimProcessingPaymentAdress:"",
      estimProcessingPaymentPicture:"",
      estimProcessingTechDetails:"",
    }},{
    jobDoneScheduleData:{
      jobDoneScheduleTechName:"",
      jobDoneScheduleTechCon:"",
      jobDoneScheduleDate:"",
      jobDoneScheduleCost:"",
      jobDoneScheduleTechHours:"",
      jobDoneScheduleTechNum:"",
      jobDoneScheduleMaterials:"",
      jobDoneScheduleDetails:"",
    }},{
    jobDoneProcessingData:{
      jobDoneProcessingCost:"",
      jobDoneProcessingTechHours:"",
      jobDoneProcessingTechNum:"",
      jobDoneProcessingMaterials:"",
      jobDoneProcessingSupliers:"",
      jobDoneProcessingPaidBy:"",
      jobDoneProcessingPaymentAdress:"",
      jobDonePaymentPicture:"",
      jobDoneProcessingBeforePictures:"",
      jobDoneProcessingAfterPictures:"",
      jobDoneProcessingSignOffPicture:"",
      jobDoneProcessingDetails:"",

    }});
    setFiles([]);

    // Refresh job list
    const jobsCollection = collection(db, '2achghal');
    const jobSnapshot = await getDocs(jobsCollection);
    const jobList = jobSnapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));
    setJobs(jobList);

    document.getElementById('addJobForm').style.display = 'none';
  };

  const handleCancel = () => {
    document.getElementById('addJobForm').style.display = 'none';
  };

  const thumbnailStyle = {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
    transition: 'transform 0.3s ease',
  };

  const thumbnailContainerStyle = {
    position: 'relative',
    display: 'inline-block',
    margin: '5px',
    cursor: 'pointer',
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>+</button>
      <button onClick={() => document.getElementById('addJobForm').style.display = 'block'}>+</button>
      <PhoneListModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
      <table className="table-container" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>WO#</th>
            <th>Zip Code</th>
            <th>Job Location</th>
            <th>Job Description</th>
            <th>Needed Date</th>
            <th>Submitted Date</th>
            <th>Estimation Needed?</th>
            <th>Budget</th>
            <th>File</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr
              key={job.id}
              className={job.data.estimNeeded ? 'yellow-row' : 'orange-row'}
            >
              <td>{job.data.woNum}</td>
              <td>{job.data.jobZip}</td> 
              <td>{job.data.joblocation}</td>
              <td>{job.data.jobdescr}</td>
              <td>{job.data.neededdate}</td>
              <td>{job.data.submdate}</td>
              <td>{job.data.estimNeeded ? "Yes" : "No"}</td>
              <td>{job.data.nte}</td>
              <td>
                {job.data.fileURLs && Object.values(job.data.fileURLs).map((url, index) => (
                  <div key={index} style={thumbnailContainerStyle}>
                    <img
                      src={url}
                      alt={`File thumbnail ${index + 1}`}
                      style={thumbnailStyle}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.5)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form id="addJobForm" style={{ display: 'none', marginTop: '20px' }} onSubmit={handleSubmit}>
        <div>
          <input name="woNum" value={form.woNum} onChange={handleChange} placeholder="Work Order Number" />
          <input name="callerNumber" value={form.callerNumber} onChange={handleChange} placeholder="Caller Number" />
          <input name="clientName" value={form.clientName} onChange={handleChange} placeholder="Client Name" />
          <input name="contact" value={form.contact} onChange={handleChange} placeholder="Contact" />
          <label>
            <input name="estimNeeded" type="checkbox" checked={form.estimNeeded} onChange={handleChange} />
            is Estimation Needed?
          </label>
          <input name="ivrNumb" value={form.ivrNumb} onChange={handleChange} placeholder="IVR Number" />
          <input name="ivrcode" value={form.ivrcode} onChange={handleChange} placeholder="IVR Code" />
          <input name="jobState" value={form.jobState} onChange={handleChange} placeholder="Job State" />
          <input name="jobZip" value={form.jobZip} onChange={handleChange} placeholder="Job Zip" />
          <input name="jobdescr" value={form.jobdescr} onChange={handleChange} placeholder="Job Description" />
          <input name="joblocation" value={form.joblocation} onChange={handleChange} placeholder="Job Location" />
          <input name="neededdate" value={form.neededdate} onChange={handleChange} placeholder="Needed Date" />
          <input name="nte" value={form.nte} onChange={handleChange} placeholder="NTE" />
          <input name="poNumb" value={form.poNumb} onChange={handleChange} placeholder="PO Number" />
          <input name="streetAddress" value={form.streetAddress} onChange={handleChange} placeholder="Street Address" />
          <input name="submdate" value={form.submdate} onChange={handleChange} placeholder="Submit Date" />
          <input name="trade" value={form.trade} onChange={handleChange} placeholder="Trade" />
          <input name="urgency" value={form.urgency} onChange={handleChange} placeholder="Urgency" />
          <select name="assignedManager" value={form.assignedManager} onChange={handleChange}>
            <option value="">Select Manager</option>
            {managers.map(manager => (
              <option key={manager.id} value={manager.idMosta5dem}>{manager.nameMosta5dem}</option>
            ))}
          </select>
          <select name="assignedDispatcher" value={form.assignedDispatcher} onChange={handleChange}>
            <option value="">Select Dispatcher</option>
            {dispatchers.map(dispatcher => (
              <option key={dispatcher.id} value={dispatcher.idMosta5dem}>{dispatcher.nameMosta5dem}</option>
            ))}
          </select>
          <input type="file" multiple onChange={onFileChange} />
        </div>
        <div>
          <button type="submit">SUBMIT</button>
          <button type="button" onClick={handleCancel}>CANCEL</button>
        </div>
      </form>
    </div>
  );
};

export default Moudir;
