import React, { useEffect, useState, useRef } from 'react';
import DispatcherForm from '../main/DispatcherForm';
import MapComponent from './MapComponent';
import TechList from './TechList';
import zipcodes from 'zipcodes';
import { db } from '../helpers/firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import './Mwazzaf.css';

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
  const [selectedJobNeeded, setSelectedJobNeeded] = useState(null);
  const [selectedJobScheduled, setSelectedJobScheduled] = useState(null);
  const [clickedRowIndexNeeded, setClickedRowIndexNeeded] = useState(null);
  const [clickedRowIndexScheduled, setClickedRowIndexScheduled] = useState(null);
  const [isJobsNeededTableVisible, setIsJobsNeededTableVisible] = useState(true);
  const [isJobsScheduledTableVisible, setIsJobsScheduledTableVisible] = useState(true);
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

  const handleRowClickNeeded = (job, index) => {
    setSelectedJobNeeded(job);
    setClickedRowIndexNeeded(index);
  };

  const handleRowClickScheduled = (job, index) => {
    setSelectedJobScheduled(job);
    setClickedRowIndexScheduled(index);
  };

  const handleCloseClick = () => {
    setSelectedJobNeeded(null);
    setSelectedJobScheduled(null);
    setClickedRowIndexNeeded(null);
    setClickedRowIndexScheduled(null);
  };

  const handleOpenWindow = () => {
    setIsWindowVisible(true);
  };

  const handleCloseWindow = () => {
    setIsWindowVisible(false);
  };

  const handleFormSubmit = async (formData) => {
    if (!selectedJobNeeded && !selectedJobScheduled) return;

    try {
      const jobDoc = doc(db, '2achghal', (selectedJobNeeded || selectedJobScheduled).id);
      await updateDoc(jobDoc, { ...formData, jobStatus: 'estimationScheduled' });
      alert('Data updated successfully');
      handleCloseClick();
      setJobs(prevJobs => prevJobs.map(job => job.id === (selectedJobNeeded || selectedJobScheduled).id ? { ...job, data: { ...job.data, ...formData, jobStatus: 'estimationScheduled' } } : job));
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
        handleRowClickNeeded(jobs[jobIndex], jobIndex);
      }
    }
  };

  const toggleJobsNeededTableVisibility = () => {
    setIsJobsNeededTableVisible(!isJobsNeededTableVisible);
  };

  const toggleJobsScheduledTableVisibility = () => {
    setIsJobsScheduledTableVisible(!isJobsScheduledTableVisible);
  };

  const handleTechListOpen = () => {
    setIsTechListVisible(true);
  };

  const handleTechListClose = () => {
    setIsTechListVisible(false);
  };

  const renderTableRows = (filterCondition, handleRowClick, selectedJob, clickedRowIndex) => {
    return jobs
      .filter(filterCondition)
      .map((job, index) => (
        <React.Fragment key={job.id}>
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
                <div key={fileIndex} style={{ display: 'inline-block', margin: '5px', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
                  <img
                    src={url}
                    alt={`File thumbnail ${fileIndex + 1}`}
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.5)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
              ))}
            </td>
          </tr>
          {clickedRowIndex === index && (
            <tr>
              <td colSpan="9">
                <DispatcherForm
                  job={selectedJob}
                  onClose={handleCloseClick}
                  onSubmit={handleFormSubmit}
                />
              </td>
            </tr>
          )}
        </React.Fragment>
      ));
  };

  return (
    <div id='body'>
      <MapComponent
        jobs={jobs}
        techs={coordinates}
        onJobClick={handleMapJobClick}
      />
      <div className="mwazzaf-container">
        <h2 onClick={toggleJobsNeededTableVisibility} className="toggle-heading">
          Jobs to Schedule
        </h2>
        {isJobsNeededTableVisible && (
          <table className="table-container" ref={tableRef}>
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
              {renderTableRows(
                job => job.data.jobStatus === 'estimationNeeded' || job.data.jobStatus === 'jobDoneNeeded',
                handleRowClickNeeded,
                selectedJobNeeded,
                clickedRowIndexNeeded
              )}
            </tbody>
          </table>
        )}
      </div>
      <div className="mwazzaf-container">
        <h2 onClick={toggleJobsScheduledTableVisibility} className="toggle-heading">
          Scheduled Jobs
        </h2>
        {isJobsScheduledTableVisible && (
          <table className="table-container" ref={tableRef}>
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
              {renderTableRows(
                job => job.data.jobStatus === 'estimationScheduled' || job.data.jobStatus === 'jobDoneScheduled',
                handleRowClickScheduled,
                selectedJobScheduled,
                clickedRowIndexScheduled
              )}
            </tbody>
          </table>
        )}
      </div>
      {isTechListVisible && (
        <TechList onClose={handleTechListClose} />
      )}
    </div>
  );
};

export default Mwazzaf;
