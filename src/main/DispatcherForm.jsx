import React, { useEffect, useState } from 'react';
import { db } from '../helpers/firebase';
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';

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
  const [jobStatus, setjobStatus] = useState({});
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
    setjobStatus(if (data.jobStatus= "estimationNeeded") {data.jobStatus= "estimationScheduled"}
  elseif((if (data.jobStatus= "estimationScheduled") {data.jobStatus= "jobDoneNeeded"}
  elseif((if (data.jobStatus= "jobDoneNeeded") {data.jobStatus= "jobDoneSchedule"}
  elseif((if (data.jobStatus= "jobDoneSchedule") {data.jobStatus= "jobDoneSchedule"}

  )

    try {
      await setDoc(doc(db, '2achghal', job.id), {
        ...job.data,
        [section]: form[section]
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
      <div>
        <p>
          Hello there, we need someone for{" "}
          <span className="highlight">{data.trade}</span>
          <br />
          to: <span className="highlight">{data.jobdescr}</span>
          <br />
          At: <span className="highlight">{data.joblocation}</span>
          <br />
          Maximum by: <span className="highlight">{data.neededdate}</span>
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
        <div>
          <div> woNum: {data.woNum}, callerNumber: {data.callerNumber}, clientName: {data.clientName}, contact: {data.contact}, estimNeeded: {data.estimNeeded}, ivrNumb: {data.ivrNumb}, ivrcode: {data.ivrcode}, jobState: {data.jobStatus}, jobZip: {data.jobZip}, jobdescr: {data.jobdescr}, joblocation: {data.joblocation}, neededdate: {data.neededdate}, nte: {data.nte}</div>
          <div> poNumb: {data.poNumb}, streetAddress: {data.streetAddress}, submdate: {data.submdate}, trade: {data.trade}, urgency: {data.urgency}, jobStatus: {data.jobStatus}, assignedBy: {data.assignedBy}, assignedManager: {data.assignedManager}, assignedTeamLeader: {data.assignedTeamLeader}, assignedDispatcher: {data.assignedDispatcher}</div>
        </div>
        <div>
          <h3>Estimation Schedule</h3>
          estimScheduleTechName: {data.estimScheduleData?.estimScheduleTechName}, estimScheduleTechCon: {data.estimScheduleData?.estimScheduleTechCon}, estimScheduleDate: {data.estimScheduleData?.estimScheduleDate}, estimScheduleTime: {data.estimScheduleData?.estimScheduleTime}, estimScheduleBy: {data.estimScheduleData?.estimScheduleBy}, estimScheduleCost: {data.estimScheduleData?.estimScheduleCost}
        </div>
        <h3>Estimation Processing Data</h3>
        <div>
          estimProcessingTechName: {data.estimProcessingData?.estimProcessingTechName}, estimProcessingTechCon: {data.estimProcessingData?.estimProcessingTechCon}, estimProcessingDate: {data.estimProcessingData?.estimProcessingDate}, estimProcessingTechCost: {data.estimProcessingData?.estimProcessingTechCost}, estimProcessingPaymentAdress: {data.estimProcessingData?.estimProcessingPaymentAdress}, estimProcessingPaymentPicture: {data.estimProcessingData?.estimProcessingPaymentPicture}, estimProcessingTechDetails: {data.estimProcessingData?.estimProcessingTechDetails}
        </div>
        <h3>Job Done Schedule Data</h3>
        <div>
          jobDoneScheduleTechName: {data.jobDoneScheduleData?.jobDoneScheduleTechName}, jobDoneScheduleTechCon: {data.jobDoneScheduleData?.jobDoneScheduleTechCon}, jobDoneScheduleDate: {data.jobDoneScheduleData?.jobDoneScheduleDate}, jobDoneScheduleCost: {data.jobDoneScheduleData?.jobDoneScheduleCost}, jobDoneScheduleTechHours: {data.jobDoneScheduleData?.jobDoneScheduleTechHours}, jobDoneScheduleTechNum: {data.jobDoneScheduleData?.jobDoneScheduleTechNum}, jobDoneScheduleMaterials: {data.jobDoneScheduleData?.jobDoneScheduleMaterials}, jobDoneScheduleDetails: {data.jobDoneScheduleData?.jobDoneScheduleDetails}
        </div>
        <h3>Job Done Processing Data</h3>
        <div>
          jobDoneProcessingCost: {data.jobDoneProcessingData?.jobDoneProcessingCost}, jobDoneProcessingTechHours: {data.jobDoneProcessingData?.jobDoneProcessingTechHours}, jobDoneProcessingTechNum: {data.jobDoneProcessingData?.jobDoneProcessingTechNum}, jobDoneProcessingMaterials: {data.jobDoneProcessingData?.jobDoneProcessingMaterials}, jobDoneProcessingSupliers: {data.jobDoneProcessingData?.jobDoneProcessingSupliers}, jobDoneProcessingPaidBy: {data.jobDoneProcessingData?.jobDoneProcessingPaidBy}, jobDoneProcessingPaymentAdress: {data.jobDoneProcessingData?.jobDoneProcessingPaymentAdress}, jobDonePaymentPicture: {data.jobDoneProcessingData?.jobDonePaymentPicture}, jobDoneProcessingBeforePictures: {data.jobDoneProcessingData?.jobDoneProcessingBeforePictures}, jobDoneProcessingAfterPictures: {data.jobDoneProcessingData?.jobDoneProcessingAfterPictures}, jobDoneProcessingSignOffPicture: {data.jobDoneProcessingData?.jobDoneProcessingSignOffPicture}, jobDoneProcessingDetails: {data.jobDoneProcessingData?.jobDoneProcessingDetails}
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
            <div key={key}>
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
    <div>
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
