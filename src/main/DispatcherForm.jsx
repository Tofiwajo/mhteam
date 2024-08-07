import React, { useEffect, useState } from 'react';
import { db } from '../helpers/firebase';
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import './DispatcherForm.css';

const jobListCollection = collection(db, '2achghal');

const DispatcherForm = ({ job, currentMosta5dem }) => {
  const [form, setForm] = useState({
    estimScheduleData: {
      estimScheduleTechName: '',
      estimScheduleTechCon: '',
      estimScheduleDate: '',
      estimScheduleTime: '',
      estimScheduleBy: '',
      estimScheduleCost: ''
    },
    estimProcessingData: {
      estimProcessingTechName: '',
      estimProcessingTechCon: '',
      estimProcessingDate: '',
      estimProcessingTechCost: '',
      estimProcessingPaymentAdress: '',
      estimProcessingPaymentPicture: '',
      estimProcessingTechDetails: ''
    },
    jobDoneScheduleData: {
      jobDoneScheduleTechName: '',
      jobDoneScheduleTechCon: '',
      jobDoneScheduleDate: '',
      jobDoneScheduleCost: '',
      jobDoneScheduleTechHours: '',
      jobDoneScheduleTechNum: '',
      jobDoneScheduleMaterials: '',
      jobDoneScheduleDetails: ''
    },
    jobDoneProcessingData: {
      jobDoneProcessingTechName: '',
      jobDoneProcessingTechCon: '',
      jobDoneProcessingCost: '',
      jobDoneProcessingTechHours: '',
      jobDoneProcessingTechNum: '',
      jobDoneProcessingMaterials: '',
      jobDoneProcessingSupliers: '',
      jobDoneProcessingPaidBy: '',
      jobDoneProcessingPaymentAdress: '',
      jobDonePaymentPicture: '',
      jobDoneProcessingBeforePictures: '',
      jobDoneProcessingAfterPictures: '',
      jobDoneProcessingSignOffPicture: '',
      jobDoneProcessingDetails: ''
    }
  });

  const [jobs, setJobs] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTechs, setFilteredTechs] = useState([]);
  const [techFound, setTechFound] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await findWoForCurrentUser(currentMosta5dem);
        setJobs(jobs);
      } catch (e) {
        console.error('Error fetching jobs:', e);
      }
    };

    fetchJobs();
    fetchTechnicians();
  }, [currentMosta5dem]);

  const fetchTechnicians = async () => {
    try {
      const techListCollection = collection(db, 'siyanjiye');
      const querySnapshot = await getDocs(techListCollection);
      const technicianData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTechnicians(technicianData);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    }
  };

  const handleTechNameChange = (e) => {
    const input = e.target.value;
    setSearchTerm(input);
    const filtered = technicians.filter(tech => tech.techName.toLowerCase().includes(input.toLowerCase()));
    setFilteredTechs(filtered);
    if (filtered.length === 1 && filtered[0].techName.toLowerCase() === input.toLowerCase()) {
      setForm(prevForm => ({
        ...prevForm,
        estimScheduleData: {
          ...prevForm.estimScheduleData,
          estimScheduleTechName: filtered[0].techName,
          estimScheduleTechCon: filtered[0].techCon
        }
      }));
      setTechFound(true);
    } else {
      setForm(prevForm => ({
        ...prevForm,
        estimScheduleData: {
          ...prevForm.estimScheduleData,
          estimScheduleTechName: input,
          estimScheduleTechCon: ''
        }
      }));
      setTechFound(false);
    }
  };

  const handleTechContactChange = (e) => {
    const input = e.target.value;
    setSearchTerm(input);
    const filtered = technicians.filter(tech => tech.techCon.toLowerCase().includes(input.toLowerCase()));
    setFilteredTechs(filtered);
    if (filtered.length === 1 && filtered[0].techCon.toLowerCase() === input.toLowerCase()) {
      setForm(prevForm => ({
        ...prevForm,
        estimScheduleData: {
          ...prevForm.estimScheduleData,
          estimScheduleTechCon: filtered[0].techCon,
          estimScheduleTechName: filtered[0].techName
        }
      }));
      setTechFound(true);
    } else {
      setForm(prevForm => ({
        ...prevForm,
        estimScheduleData: {
          ...prevForm.estimScheduleData,
          estimScheduleTechCon: input,
          estimScheduleTechName: ''
        }
      }));
      setTechFound(false);
    }
  };

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
        .map(id => combinedDocs.find(doc => doc.id === id));

      return uniqueDocs;
    } catch (e) {
      console.error('Error finding jobs:', e);
      throw e;
    }
  };

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    if (dataset.section) {
      setForm((prevForm) => ({
        ...prevForm,
        [dataset.section]: {
          ...prevForm[dataset.section],
          [name]: value
        }
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e, section) => {
    e.preventDefault();
    setIsSubmitted(true);

    const updatedJobStatus = (() => {
      switch (job.data.jobStatus) {
        case 'estimationNeeded':
          return 'estimationScheduled';
        case 'estimationScheduled':
          return 'jobDoneNeeded';
        case 'jobDoneNeeded':
          return 'jobDoneScheduled';
        case 'jobDoneScheduled':
          return 'jobFinalize';
        default:
          return job.data.jobStatus;
      }
    })();

    try {
      await setDoc(doc(db, '2achghal', job.id), {
        ...job.data,
        [section]: form[section],
        jobStatus: updatedJobStatus
      });
      console.log('Document successfully written!');
    } catch (e) {
      console.error('Error writing document: ', e);
    }
  };

  const renderJobData = () => {
    if (!job || !job.data) {
      return <div>No job data available</div>;
    }

    const { data } = job;

    return (
      <div className="job-data-container">
        <p>
          Hello there, we need someone for
          {" "}
          <span className="highlight">{data.trade}</span>
          <br />
          to: <span className="highlight">
            {data.jobdescr}</span>
          <br />
          At: <span className="highlight">
            {data.joblocation}</span>
          <br />
          Maximum by: <span className="highlight">
            {data.neededdate}</span>
          <br />
          You guys do free estimation, right?
          <br />
          <span className="highlight">YES?</span> AWESOME!
          <br />
          <span className="highlight">No?</span> How much do you guys charge? The best I can do is:
          <br />
          <span className="highlight">
            {data.nte ? `$${data.nte - 25}$` : ""}
          </span>
          <br />
          <span className="highlight">No?</span> Ok ok give me a minute, I will ask my manager, I might be able to get you:
          <br />
          <span className="highlight">{data.nte ? `$${data.nte}$` : ""}</span>
          <h3>WO# {data.woNum}</h3>
        </p>
        <div className="job-details">
          <div className="job-detail-row">
            <span className="label">WO Number:</span> <span>{data.woNum}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Caller Number:</span> <span>{data.callerNumber}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Client Name:</span> <span>{data.clientName}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Contact:</span> <span>{data.contact}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Estimation Needed:</span> <span>{data.estimNeeded}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">IVR Number:</span> <span>{data.ivrNumb}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">IVR Code:</span> <span>{data.ivrcode}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Job Status:</span> <span>{data.jobStatus}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Job Zip:</span> <span>{data.jobZip}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Job Description:</span> <span>{data.jobdescr}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Job Location:</span> <span>{data.joblocation}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Needed Date:</span> <span>{data.neededdate}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">NTE:</span> <span>{data.nte}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">PO Number:</span> <span>{data.poNumb}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Street Address:</span> <span>{data.streetAddress}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Submission Date:</span> <span>{data.submdate}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Trade:</span> <span>{data.trade}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Urgency:</span> <span>{data.urgency}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Assigned By:</span> <span>{data.assignedBy}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Assigned Manager:</span> <span>{data.assignedManager}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Assigned Team Leader:</span> <span>{data.assignedTeamLeader}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Assigned Dispatcher:</span> <span>{data.assignedDispatcher}</span>
          </div>
        </div>
        <div className="section">
          <h3>Estimation Schedule</h3>
          <div className="job-detail-row">
            <span className="label">Tech Name:</span> <span>{data.estimScheduleData?.estimScheduleTechName}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Tech Contact:</span> <span>{data.estimScheduleData?.estimScheduleTechCon}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Date:</span> <span>{data.estimScheduleData?.estimScheduleDate}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Time:</span> <span>{data.estimScheduleData?.estimScheduleTime}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Scheduled By:</span> <span>{data.estimScheduleData?.estimScheduleBy}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Cost:</span> <span>{data.estimScheduleData?.estimScheduleCost}</span>
          </div>
        </div>
        <div className="section">
          <h3>Estimation Processing Data</h3>
          <div className="job-detail-row">
            <span className="label">Tech Name:</span> <span>{data.estimProcessingData?.estimProcessingTechName}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Tech Contact:</span> <span>{data.estimProcessingData?.estimProcessingTechCon}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Date:</span> <span>{data.estimProcessingData?.estimProcessingDate}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Tech Cost:</span> <span>{data.estimProcessingData?.estimProcessingTechCost}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Payment Address:</span> <span>{data.estimProcessingData?.estimProcessingPaymentAdress}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Payment Picture:</span> <span>{data.estimProcessingData?.estimProcessingPaymentPicture}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Tech Details:</span> <span>{data.estimProcessingData?.estimProcessingTechDetails}</span>
          </div>
        </div>
        <div className="section">
          <h3>Job Done Schedule Data</h3>
          <div className="job-detail-row">
            <span className="label">Tech Name:</span> <span>{data.jobDoneScheduleData?.jobDoneScheduleTechName}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Tech Contact:</span> <span>{data.jobDoneScheduleData?.jobDoneScheduleTechCon}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Date:</span> <span>{data.jobDoneScheduleData?.jobDoneScheduleDate}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Cost:</span> <span>{data.jobDoneScheduleData?.jobDoneScheduleCost}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Tech Hours:</span> <span>{data.jobDoneScheduleData?.jobDoneScheduleTechHours}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Tech Number:</span> <span>{data.jobDoneScheduleData?.jobDoneScheduleTechNum}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Materials:</span> <span>{data.jobDoneScheduleData?.jobDoneScheduleMaterials}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Details:</span> <span>{data.jobDoneScheduleData?.jobDoneScheduleDetails}</span>
          </div>
        </div>
        <div className="section">
          <h3>Job Done Processing Data</h3>
          <div className="job-detail-row">
            <span className="label">Cost:</span> <span>{data.jobDoneProcessingData?.jobDoneProcessingCost}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Tech Hours:</span> <span>{data.jobDoneProcessingData?.jobDoneProcessingTechHours}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Tech Number:</span> <span>{data.jobDoneProcessingData?.jobDoneProcessingTechNum}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Materials:</span> <span>{data.jobDoneProcessingData?.jobDoneProcessingMaterials}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Suppliers:</span> <span>{data.jobDoneProcessingData?.jobDoneProcessingSupliers}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Paid By:</span> <span>{data.jobDoneProcessingData?.jobDoneProcessingPaidBy}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Payment Address:</span> <span>{data.jobDoneProcessingData?.jobDoneProcessingPaymentAdress}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Payment Picture:</span> <span>{data.jobDoneProcessingData?.jobDonePaymentPicture}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Before Pictures:</span> <span>{data.jobDoneProcessingData?.jobDoneProcessingBeforePictures}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">After Pictures:</span> <span>{data.jobDoneProcessingData?.jobDoneProcessingAfterPictures}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Sign-Off Picture:</span> <span>{data.jobDoneProcessingData?.jobDoneProcessingSignOffPicture}</span>
          </div>
          <div className="job-detail-row">
            <span className="label">Details:</span> <span>{data.jobDoneProcessingData?.jobDoneProcessingDetails}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderForm = (section, data) => (
    <form onSubmit={(e) => handleSubmit(e, section)}>
      <h2>{section.split(/(?=[A-Z])/).join(' ')}</h2>
      {isSubmitted ? (
        <div>Form submitted successfully!</div>
      ) : (
        <>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="form-group">
              <input
                type={key.includes('Date') ? 'date' : key.includes('Time') ? 'time' : key.includes('Cost') || key.includes('Hours') || key.includes('Num') ? 'number' : 'text'}
                name={key}
                data-section={section}
                value={value}
                onChange={handleChange}
                placeholder={key.split(/(?=[A-Z])/).join(' ')}
                required
              />
              {key.includes('Picture') && <input type="file" name={key} data-section={section} onChange={handleChange} />}
            </div>
          ))}
          <button type="submit">Submit {section.split(/(?=[A-Z])/).join(' ')}</button>
        </>
      )}
    </form>
  );

  return (
    <div className="dispatcher-form">
      <div>
        <h2>Job Data</h2>
        {renderJobData()}
      </div>
      {job.data.jobStatus === 'estimationNeeded' && renderForm('estimScheduleData', form.estimScheduleData)}
      {job.data.jobStatus === 'estimationScheduled' && renderForm('estimProcessingData', form.estimProcessingData)}
      {job.data.jobStatus === 'jobDoneNeeded' && renderForm('jobDoneScheduleData', form.jobDoneScheduleData)}
      {job.data.jobStatus === 'jobDoneScheduled' && renderForm('jobDoneProcessingData', form.jobDoneProcessingData)}
    </div>
  );
};

export default DispatcherForm;
