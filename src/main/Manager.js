import React, { useState, useEffect } from 'react';
import { db } from '../helpers/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import '../main/Manager.css';
const Manager = () => {
  const [jobs, setJobs] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [dispatchers, setDispatchers] = useState([]);
  const [selectedAssignments, setSelectedAssignments] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
    fetchMosta5dem();
  }, []);

  const fetchJobs = async () => {
    const jobsCollection = collection(db, '2achghal');
    const jobsSnapshot = await getDocs(jobsCollection);
    const jobsList = jobsSnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
    setJobs(jobsList.filter(job => job.data.jobStatus === 'estimationNeeded' || job.data.jobStatus === 'jobDoneNeeded'));
  };

  const fetchMosta5dem = async () => {
    const mosta5demCollection = collection(db, 'mosta5dem');
    const mosta5demSnapshot = await getDocs(mosta5demCollection);
    const mosta5demList = mosta5demSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    setTeamLeaders(mosta5demList.filter(item => item.TypeMosta5dem === 'TeamLeader'));
    setDispatchers(mosta5demList.filter(item => item.TypeMosta5dem === 'Dispatcher'));
  };

  const handleChange = (e, jobId) => {
    const { name, value } = e.target;
    setSelectedAssignments(prev => ({
      ...prev,
      [jobId]: {
        ...prev[jobId],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e, jobId) => {
    e.preventDefault();
    const jobRef = doc(db, '2achghal', jobId);
    const assignment = selectedAssignments[jobId] || {};

    await updateDoc(jobRef, {
      assignedTeamLeader: assignment.assignedTeamLeader || '',
      assignedDispatcher: assignment.assignedDispatcher || '',
    });

    fetchJobs(); // Refresh the job list after assignment
  };

  const handleRowClick = (job) => {
    setSelectedJob(job);
  };

  return (
    <div>
      <h2>Jobs to Assign</h2>
      <table className="table-container">
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
            <th>Assign To</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id} onClick={() => handleRowClick(job)}>
              <td>{job.data.woNum}</td>
              <td>{job.data.jobZip}</td>
              <td>{job.data.joblocation}</td>
              <td>{job.data.jobdescr}</td>
              <td>{job.data.neededdate}</td>
              <td>{job.data.submdate}</td>
              <td>{job.data.estimNeeded ? 'Yes' : 'No'}</td>
              <td>{job.data.nte}</td>
              <td>{job.data.poNumb}</td>
              <td>
                <select
                  name="assignedTeamLeader"
                  value={selectedAssignments[job.id]?.assignedTeamLeader || ''}
                  onChange={e => handleChange(e, job.id)}
                >
                  <option value="">Select Team Leader</option>
                  {teamLeaders.map(leader => (
                    <option key={leader.id} value={leader.id}>
                      {leader.nameMosta5dem}
                    </option>
                  ))}
                </select>
             
                <select
                  name="assignedDispatcher"
                  value={selectedAssignments[job.id]?.assignedDispatcher || ''}
                  onChange={e => handleChange(e, job.id)}
                >
                  <option value="">Select Dispatcher</option>
                  {dispatchers.map(dispatcher => (
                    <option key={dispatcher.id} value={dispatcher.id}>
                      {dispatcher.nameMosta5dem}
                    </option>
                  ))}
                </select>
              
                <button onClick={e => handleSubmit(e, job.id)}>Assign</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedJob && (
         <div className="job-details">
         <div className="job-detail-row">
           <span className="label">WO Number:</span> <span>{selectedJob.data.woNum}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">Caller Number:</span> <span>{selectedJob.data.callerNumber}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">Client Name:</span> <span>{selectedJob.data.clientName}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">Contact:</span> <span>{selectedJob.data.contact}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">Estimation Needed:</span> <span>{selectedJob.data.estimNeeded}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">IVR Number:</span> <span>{selectedJob.data.ivrNumb}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">IVR Code:</span> <span>{selectedJob.data.ivrcode}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">Job Status:</span> <span>{selectedJob.data.jobStatus}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">Job Zip:</span> <span>{selectedJob.data.jobZip}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">Job Description:</span> <span>{selectedJob.data.jobdescr}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">Job Location:</span> <span>{selectedJob.data.joblocation}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">Needed Date:</span> <span>{selectedJob.data.neededdate}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">NTE:</span> <span>{selectedJob.data.nte}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">PO Number:</span> <span>{selectedJob.data.poNumb}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">Street Address:</span> <span>{selectedJob.data.streetAddress}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">Submission Date:</span> <span>{selectedJob.data.submdate}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">Trade:</span> <span>{selectedJob.data.trade}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">Urgency:</span> <span>{selectedJob.data.urgency}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">Assigned By:</span> <span>{selectedJob.data.assignedBy}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">Assigned Manager:</span> <span>{selectedJob.data.assignedManager}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">Assigned Team Leader:</span> <span>{selectedJob.data.assignedTeamLeader}</span>
         </div>
         <div className="job-detail-row">
           <span className="label">Assigned Dispatcher:</span> <span>{selectedJob.data.assignedDispatcher}</span>
         </div>
         <div className="section">
          <h3>Estimation Schedule</h3>
          <div className="job-detail-row">
            <span className="label">Tech Name:</span> <span>{selectedJob.data.estimScheduleData?.estimScheduleTechName}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Tech Contact:</span> <span>{selectedJob.data.estimScheduleData?.estimScheduleTechCon}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Date:</span> <span>{selectedJob.data.estimScheduleData?.estimScheduleDate}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Time:</span> <span>{selectedJob.data.estimScheduleData?.estimScheduleTime}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Scheduled By:</span> <span>{selectedJob.data.estimScheduleData?.estimScheduleBy}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Cost:</span> <span>{selectedJob.data.estimScheduleData?.estimScheduleCost}</span>
          </div>
        </div>
        <div className="section">
          <h3>Estimation Processing Data</h3>
          <div className="job-detail-row">
            <span className="label">Tech Name:</span> <span>{selectedJob.data.estimProcessingData?.estimProcessingTechName}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Tech Contact:</span> <span>{selectedJob.data.estimProcessingData?.estimProcessingTechCon}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Date:</span> <span>{selectedJob.data.estimProcessingData?.estimProcessingDate}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Tech Cost:</span> <span>{selectedJob.data.estimProcessingData?.estimProcessingTechCost}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Payment Address:</span> <span>{selectedJob.data.estimProcessingData?.estimProcessingPaymentAdress}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Payment Picture:</span> <span>{selectedJob.data.estimProcessingData?.estimProcessingPaymentPicture}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Tech Details:</span> <span>{selectedJob.data.estimProcessingData?.estimProcessingTechDetails}</span>
          </div>
        </div>
        <div className="section">
          <h3>Job Done Schedule Data</h3>
          <div className="job-detail-row">
            <span className="label">Tech Name:</span> <span>{selectedJob.data.jobDoneScheduleData?.jobDoneScheduleTechName}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Tech Contact:</span> <span>{selectedJob.data.jobDoneScheduleData?.jobDoneScheduleTechCon}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Date:</span> <span>{selectedJob.data.jobDoneScheduleData?.jobDoneScheduleDate}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Cost:</span> <span>{selectedJob.data.jobDoneScheduleData?.jobDoneScheduleCost}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Tech Hours:</span> <span>{selectedJob.data.jobDoneScheduleData?.jobDoneScheduleTechHours}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Tech Number:</span> <span>{selectedJob.data.jobDoneScheduleData?.jobDoneScheduleTechNum}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Materials:</span> <span>{selectedJob.data.jobDoneScheduleData?.jobDoneScheduleMaterials}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Details:</span> <span>{selectedJob.data.jobDoneScheduleData?.jobDoneScheduleDetails}</span>
          </div>
        </div>
        <div className="section">
          <h3>Job Done Processing Data</h3>
          <div className="job-detail-row">
            <span className="label">Cost:</span> <span>{selectedJob.data.jobDoneProcessingData?.jobDoneProcessingCost}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Tech Hours:</span> <span>{selectedJob.data.jobDoneProcessingData?.jobDoneProcessingTechHours}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Tech Number:</span> <span>{selectedJob.data.jobDoneProcessingData?.jobDoneProcessingTechNum}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Materials:</span> <span>{selectedJob.data.jobDoneProcessingData?.jobDoneProcessingMaterials}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Suppliers:</span> <span>{selectedJob.data.jobDoneProcessingData?.jobDoneProcessingSupliers}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Paid By:</span> <span>{selectedJob.data.jobDoneProcessingData?.jobDoneProcessingPaidBy}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Payment Address:</span> <span>{selectedJob.data.jobDoneProcessingData?.jobDoneProcessingPaymentAdress}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Payment Picture:</span> <span>{selectedJob.data.jobDoneProcessingData?.jobDonePaymentPicture}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Before Pictures:</span> <span>{selectedJob.data.jobDoneProcessingData?.jobDoneProcessingBeforePictures}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">After Pictures:</span> <span>{selectedJob.data.jobDoneProcessingData?.jobDoneProcessingAfterPictures}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Sign-Off Picture:</span> <span>{selectedJob.data.jobDoneProcessingData?.jobDoneProcessingSignOffPicture}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Details:</span> <span>{selectedJob.data.jobDoneProcessingData?.jobDoneProcessingDetails}</span>
          </div>
        </div>
       </div>
       
      )}
    </div>
  );
};

export default Manager;
