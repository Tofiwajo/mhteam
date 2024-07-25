import React, { useState, useEffect } from 'react';
import { db } from '../helpers/firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';

const PhoneList = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    TypeMosta5dem: '1',
    contactMosta5dem: '1',
    emailMosta5dem: '1',
    lastNameMosta5dem: '1',
    nameMosta5dem: '1',
    passMosta5dem: '1',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'mosta5dem'));
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'mosta5dem'), form);
      await updateDoc(doc(db, 'mosta5dem', docRef.id), {
        idMosta5dem: docRef.id
      });
      setForm({
        TypeMosta5dem: '',
        contactMosta5dem: '',
        emailMosta5dem: '',
        lastNameMosta5dem: '',
        nameMosta5dem: '',
        passMosta5dem: '',
        idMosta5dem:doc.id,
      });
      // Fetch the updated user list
      const snapshot = await getDocs(collection(db, 'mosta5dem'));
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div>
      <h1>User List</h1>
      <table>
        <thead>
          <tr>
            <th>User Role</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Last Name</th>
            <th>Name</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.TypeMosta5dem}</td>
              <td>{user.contactMosta5dem}</td>
              <td>{user.emailMosta5dem}</td>
              <td>{user.lastNameMosta5dem}</td>
              <td>{user.nameMosta5dem}</td>
              <td>{user.passMosta5dem}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => document.getElementById('addForm').style.display = 'block'}>+</button>
      <form id="addForm" style={{ display: 'none' }} onSubmit={handleSubmit}>
        <input name="TypeMosta5dem" value={form.TypeMosta5dem} onChange={handleChange} placeholder="TypeMosta5dem" />
        <input name="contactMosta5dem" value={form.contactMosta5dem} onChange={handleChange} placeholder="Contact" />
        <input name="emailMosta5dem" value={form.emailMosta5dem} onChange={handleChange} placeholder="Email" />
        <input name="lastNameMosta5dem" value={form.lastNameMosta5dem} onChange={handleChange} placeholder="Last Name" />
        <input name="nameMosta5dem" value={form.nameMosta5dem} onChange={handleChange} placeholder="Name" />
        <input name="passMosta5dem" value={form.passMosta5dem} onChange={handleChange} placeholder="Password" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PhoneList;
