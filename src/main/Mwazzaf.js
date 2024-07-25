import React, { useEffect, useState, useRef } from 'react';
import DispatcherForm from './DispatcherForm';
import MapComponent from './MapComponent';
import TechList from './TechList';
import zipcodes from 'zipcodes';
import { db } from '../helpers/firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';

const jobListCollection = collection(db, '2achghal');

const findWoForCurrentUser = async (currentMosta5dem) => {
  try {
    const q1 = query(
      jobListCollection,
      where('assignedDispatcher', '==', currentMosta5dem)
    );
    const querySnapshot1 = await getDocs(q1);
    const docs1 = querySnapshot1.docs.map(doc => ({ id: doc.id, data: doc.data() }));

    const q2 = query(
      jobListCollection,
      where('assignedManager', '==', currentMosta5dem)
    );
    const querySnapshot2 = await getDocs(q2);
    const docs2 = querySnapshot2.docs.map(doc => ({ id: doc.id, data: doc.data() }));

    const combinedDocs = [...docs1, ...docs2];
    const uniqueDocs = Array.from(new Set(combinedDocs.map(doc => doc.id)))
                            .map(id => {
                              return combinedDocs.find(doc => doc.id === id);
                            });

    return uniqueDocs;
  } catch (e) {
    console.error('Error finding jobs:', e);
    throw e;
  }
};

const Mwazzaf = ({ currentMosta5dem }) => {
  const [isWindowVisible, setIsWindowVisible] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [clickedRowIndex, setClickedRowIndex] = useState(null);
  const [isJobsTableVisible, setIsJobsTableVisible] = useState(true);
  const [isTechListVisible, setIsTechListVisible] = useState(false);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await findWoForCurrentUser(currentMosta5dem);
        setJobs(jobs);
      } catch (e) {
        console.error('Error fetching jobs:', e);
      }
    };

    const fetchTechs = async () => {
      try {
        const techListCollection = collection(db, 'siyanjiye');
        const querySnapshot = await getDocs(techListCollection);
        const techList = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
        getCoordinates(techList);
      } catch (e) {
        console.error('Error fetching techs:', e);
      }
    };

    fetchJobs();
    fetchTechs();
  }, [currentMosta5dem]);

  const getCoordinates = (techList) => {
    const coords = techList.map((tech) => {
      const coordinates = zipcodes.lookup(tech.data.techZip);
      return { ...tech, coordinates: coordinates ? { lat: coordinates.latitude, lng: coordinates.longitude } : null };
    });
    setCoordinates(coords);
  };

  const handleRowClick = (job, index) => {
    setSelectedJob(job);
    setClickedRowIndex(index);
    setIsFormVisible(true);
  };

  const handleCloseClick = () => {
    setSelectedJob(null);
    setIsFormVisible(false);
  };

  const handleOpenWindow = () => {
    setIsWindowVisible(true);
  };

  const handleCloseWindow = () => {
    setIsWindowVisible(false);
  };

  const handleFormSubmit = async (formData) => {
    if (!selectedJob) return;

    try {
      const jobDoc = doc(db, '2achghal', selectedJob.id);
      await updateDoc(jobDoc, {formData, status: 'estimationScheduled' });
      alert('Data updated successfully');
      setSelectedJob(null);
      setIsFormVisible(false);
    } catch (e) {
      console.error('Error updating document: ', e);
      alert('Error updating data');
    }
  };

  const getRowStyle = (job) => {
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    const neededDate = new Date(job.data.neededdate);
    const isUrgent = (neededDate <= threeDaysFromNow) && (neededDate >= today);
    const isEstimationNeeded = job.data.estimNeeded;

    if (neededDate.toDateString() === today.toDateString()) {
      return { backgroundColor: 'red' };
    } else if (isUrgent) {
      return { backgroundColor: 'lightcoral' };
    } else if (isEstimationNeeded) {
      return { backgroundColor: 'lightyellow' };
    }
    return { backgroundColor: 'lightgreen' };
  };

  const handleMapJobClick = (jobId) => {
    const jobIndex = jobs.findIndex(job => job.id === jobId);
    if (jobIndex !== -1 && tableRef.current) {
      const tableRows = tableRef.current.getElementsByTagName('tr');
      const rowElement = tableRows[jobIndex + 1];  // Adjust for header row
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        handleRowClick(jobs[jobIndex], jobIndex);
      }
    }
  };

  const toggleJobsTableVisibility = () => {
    setIsJobsTableVisible(!isJobsTableVisible);
  };

  const handleTechListOpen = () => {
    setIsTechListVisible(true);
  };

  const handleTechListClose = () => {
    setIsTechListVisible(false);
  };

  const countEstimationNeeded = jobs.filter(job => job.data.estimNeeded).length;
  const countJobComplete = jobs.filter(job => !job.data.estimNeeded).length;
  const countUrgentJobs = jobs.filter(job => {
    const neededDate = new Date(job.data.neededdate);
    const today = new Date();
    const diffDays = Math.ceil((neededDate - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 5;
  }).length;
  const countTotalPending = jobs.length;

  const thumbnailContainerStyle = {
    display: 'inline-block',
    margin: '5px',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
  };

  const thumbnailStyle = {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
  };

  return (
    <div>
      <button onClick={handleTechListOpen} className="button-primary">+Tech</button>
      <MapComponent
        jobs={jobs}
        techs={coordinates}
        onJobClick={handleMapJobClick}
      />
      <div className="mwazzaf-container">
        <h2 onClick={toggleJobsTableVisibility} className="toggle-heading" style={{ backgroundColor: 'lightblue', padding: '10px' }}>
          Jobs to Schedule
          <span style={{ color: 'green' }}> - Estim Jobs: {countEstimationNeeded}</span>
          <span style={{ color: 'blue' }}> | Job Complete: {countJobComplete}</span>
          <span style={{ color: 'red' }}> | Urgent Jobs: {countUrgentJobs}</span>
          <span style={{ color: 'purple' }}> | Total Pending: {countTotalPending}</span>
        </h2>
        {isJobsTableVisible && (
          <table className="table-container" ref={tableRef} style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
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
              {jobs
                .filter(job => job.data.jobStatus === 'estimationNeeded' || job.data.jobStatus === 'jobDoneNeeded')
                .map((job, index) => (
                  <React.Fragment key={job.id}> {/* Use unique job.id */}
                  <tr
                    onClick={() => handleRowClick(job, index)}
                    style={getRowStyle(job)}
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
                      {job.data.fileURLs && Object.values(job.data.fileURLs).map((url, fileIndex) => (
                        <div key={fileIndex} style={thumbnailContainerStyle}>
                          <img
                            src={url}
                            alt={`File thumbnail ${fileIndex + 1}`}
                            style={thumbnailStyle}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.5)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          />
                        </div>
                      ))}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
        {isFormVisible && selectedJob && (
          <DispatcherForm
            job={selectedJob}
            onClose={handleCloseClick}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
      {isTechListVisible && (
        <TechList onClose={handleTechListClose} />
      )}
    </div>
  );
};

export default Mwazzaf;
