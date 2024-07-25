import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../helpers/firebase';

const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsCollection = collection(db, '2achghal');
        const jobSnapshot = await getDocs(jobsCollection);
        const jobList = jobSnapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        }));
        setJobs(jobList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return { jobs, loading, error };
};

export default useJobs;
