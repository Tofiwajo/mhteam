// src/hooks/useMosta5dem.js
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../helpers/firebase';

const useMosta5dem = () => {
  const [managers, setManagers] = useState([]);
  const [dispatchers, setDispatchers] = useState([]);
  const [estimTechs, setEstimTechs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const managersCollection = collection(db, 'managers');
        const dispatchersCollection = collection(db, 'dispatchers');
        const estimTechsCollection = collection(db, 'estimTechs');

        const [managersSnapshot, dispatchersSnapshot, estimTechsSnapshot] = await Promise.all([
          getDocs(managersCollection),
          getDocs(dispatchersCollection),
          getDocs(estimTechsCollection)
        ]);

        setManagers(managersSnapshot.docs.map(doc => ({ id: doc.id, nameMosta5dem: doc.data().nameMosta5dem })));
        setDispatchers(dispatchersSnapshot.docs.map(doc => ({ id: doc.id, nameMosta5dem: doc.data().nameMosta5dem })));
        setEstimTechs(estimTechsSnapshot.docs.map(doc => ({ id: doc.id, nameMosta5dem: doc.data().nameMosta5dem })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { managers, dispatchers, estimTechs, loading, error };
};

export default useMosta5dem;
