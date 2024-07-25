// src/components/DispatcherForm.jsx

import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';
import "./Sass/DispatcherForm.scss";
import { db, storage } from '../helpers/firebase';

const DispatcherForm = ({ job, onClose, onSubmit }) => {
  const [MwazzafData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [expandedThumbnail, setExpandedThumbnail] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTechs, setFilteredTechs] = useState([]);
  const [techFound, setTechFound] = useState(false);

  useEffect(() => {
    fetchTechnicians();
    if (job && job.data && job.data.MwazzafData) {
      setFormData(job.data.MwazzafData || job.data.jobStatus);
    }
    fetchThumbnails();
  }, [job]);

  const renderSchedualJobDoneInputField = () => {
    return (
      <> <div className="form-row">
      <div className="form-group">
        <label>Technician Name</label>
        <input
          type="text"
          value={MwazzafData.techName || ''}
          onChange={handleTechNameChange}
          placeholder="Enter Technician Name"
          className={errors['techName'] ? "input-error" : ""}
        />
        {searchTerm && !techFound && (
          <button type="button" onClick={handleAddTechnician} style={{ marginLeft: '10px' }}>+</button>
        )}
        {errors['techName'] && <span className="error-msg">{errors['techName']}</span>}
      </div>
      <div className="form-group">
        <label>Technician Contact</label>
        <input
          type="text"
          placeholder="Enter Technician Contact"
          value={MwazzafData.techCon || ""}
          onChange={handleTechContactChange}
          className={errors['techCon'] ? "input-error" : ""}
        />
        {errors['techCon'] && <span className="error-msg">{errors['techCon']}</span>}
      </div>
    </div>
        {renderInputField("Job Done Scheduled Date", "jobdonescheduledate")}
        {renderInputField("Job Done Time", "jobDoneTime")}
        {renderInputField("Job Done Tech Description", "jobDoneTechDescription")}
      </>
    );
  };

  const renderProcessingJobDoneInputField = () => {
    return (
      <>
        {renderInputField("Job Done Cost", "jobDoneCost")}
        {renderInputField("Job Done Paid By", "jobDonePaidby")}
        {renderInputField("Job Done Payment Address", "jobDonePaymentAdress")}
        <div className="form-group">
          <label>Attach Job Done Pictures</label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>
      </>
    );
  };

  const renderProcessingEstimInputField = () => {
    return (
      <>
        {renderInputField("Estim Cost", "estimCost")}
        {renderInputField("Estim Paid By", "estimPaidby")}
        {renderInputField("Estim Payment Address", "estimPaymentAdress")}
        <div className="form-group">
          <label>Attach Estimation Pictures</label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>
      </>
    );
  };

  const renderSchedualeEstimInputField = () => {
    return (
      <>
         <div className="form-row">
            <div className="form-group">
              <label>Technician Name</label>
              <input
                type="text"
                value={MwazzafData.techName || ''}
                onChange={handleTechNameChange}
                placeholder="Enter Technician Name"
                className={errors['techName'] ? "input-error" : ""}
              />
              {searchTerm && !techFound && (
                <button type="button" onClick={handleAddTechnician} style={{ marginLeft: '10px' }}>+</button>
              )}
              {errors['techName'] && <span className="error-msg">{errors['techName']}</span>}
            </div>
            <div className="form-group">
              <label>Technician Contact</label>
              <input
                type="text"
                placeholder="Enter Technician Contact"
                value={MwazzafData.techCon || ""}
                onChange={handleTechContactChange}
                className={errors['techCon'] ? "input-error" : ""}
              />
              {errors['techCon'] && <span className="error-msg">{errors['techCon']}</span>}
            </div>
          </div>
        {renderInputField("Estim Scheduled Date", "estimscheduleddate")}
        {renderInputField("Estim Time", "estimscheduledtimee")}
        {renderInputField("Estim Tech Description", "estimTechDescription")}
      </>
    );
  };

  const renderInputField = (label, field) => {
    const isEstimation = job.data?.jobStatus === "estimationScheduled";
    const isEstimationField = field.startsWith("estim");

    if (isEstimation && isEstimationField) {
      return (
        <div className="form-group" key={field}>
          <label>{label}</label>
          <div className="input-container">
            <input
              type="text"
              value={MwazzafData[field] || ""}
              onChange={(e) => handleInputChange(e, field)}
              className={errors[field] ? "input-error" : ""}
              readOnly={field === "estimTechName" || field === "estimTechCon"}
            />
          </div>
          {errors[field] && <span className="error-msg">{errors[field]}</span>}
        </div>
      );
    } else {
      return (
        <div className="form-group" key={field}>
          <label>{label}</label>
          <div className="input-container">
            <input
              type="text"
              value={MwazzafData[field] || ""}
              onChange={(e) => handleInputChange(e, field)}
              className={errors[field] ? "input-error" : ""}
            />
          </div>
          {errors[field] && <span className="error-msg">{errors[field]}</span>}
        </div>
      );
    }
  };

  const handleInputRendering = () => {
    const jobState = job?.data?.jobStatus;

    if (jobState === "estimationNeeded") {
      return renderSchedualeEstimInputField();
    } else if (jobState === "estimationScheduled") {
      return renderProcessingEstimInputField();
    } else if (jobState === "jobDoneNeeded") {
      return renderSchedualJobDoneInputField();
    } else if (jobState === "jobDonescheduled") {
      return renderProcessingJobDoneInputField();
    }
    return null;
  };

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
      setFormData({
        ...MwazzafData,
        techName: filtered[0].techName,
        techCon: filtered[0].techCon
      });
      setTechFound(true);
    } else {
      setFormData({
        ...MwazzafData,
        techName: input,
        techCon: ''
      });
      setTechFound(false);
    }
  };

  const handleTechContactChange = (e) => {
    const input = e.target.value;
    setSearchTerm(input);
    const filtered = technicians.filter(tech => tech.techCon.toLowerCase().includes(input.toLowerCase()));
    setFilteredTechs(filtered);
    if (filtered.length === 1 && filtered[0].techCon.toLowerCase() === input.toLowerCase()) {
      setFormData({
        ...MwazzafData,
        techCon: filtered[0].techCon,
        techName: filtered[0].techName,
      });
      setTechFound(true);
    } else {
      setFormData({
        ...MwazzafData,
        techCon: input,
        techName: ''
      });
      setTechFound(false);
    }
  };

  const handleAddTechnician = async () => {
    if (MwazzafData.techName && MwazzafData.techCon) {
      try {
        const techListCollection = collection(db, 'siyanjiye');
        await addDoc(techListCollection, { techName: MwazzafData.techName, techCon: MwazzafData.techCon });
        fetchTechnicians(); // Refresh technician list
      } catch (error) {
        console.error("Error adding technician:", error);
      }
    } else {
      alert('Please provide both technician name and contact to add a new technician.');
    }
  };

  const handleFileChange = (e) => {
    setUploadedFiles(e.target.files);
  };

  const fetchThumbnails = async () => {
    if (!job) return;

    const jobRef = ref(storage, `jobs/${job.data.jobId}`);
    try {
      const result = await listAll(jobRef);
      const urls = await Promise.all(result.items.map((item) => getDownloadURL(item)));
      setThumbnails(urls);
    } catch (error) {
      console.error("Error fetching thumbnails:", error);
    }
  };

  const handleInputChange = (e, field) => {
    setFormData({
      ...MwazzafData,
      [field]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setUploading(true);
    if (job?.data?.jobStatus === "estimationNeeded") {
      job.data.jobStatus = "estimationScheduled";
    }

    const uploadPromises = Array.from(uploadedFiles).map((file) => {
      const fileRef = ref(storage, `jobs/${job.data.jobId}/${file.name}`);
      return uploadBytesResumable(fileRef, file).then(() =>
        getDownloadURL(fileRef)
      );
    });
    try {
      const fileUrls = await Promise.all(uploadPromises);
      setFormData({
        ...MwazzafData,
        fileUrls,
      });
      onSubmit({ ...MwazzafData, fileUrls });
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit2 = async () => {
    setUploading(true);
    if (job?.data?.jobStatus === "estimationScheduled") {
      job.data.jobStatus = "jobDoneNeeded";
    }

    const uploadPromises = Array.from(uploadedFiles).map((file) => {
      const fileRef = ref(storage, `jobs/${job.data.jobId}/${file.name}`);
      return uploadBytesResumable(fileRef, file).then(() =>
        getDownloadURL(fileRef)
      );
    });
    try {
      const fileUrls = await Promise.all(uploadPromises);
      setFormData({
        ...MwazzafData,
        fileUrls,
      });
      onSubmit({ ...MwazzafData, fileUrls });
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploading(false);
    }
  };

  const isEstimation = job?.data?.jobStatus === "estimationNeeded" || job?.data?.jobStatus === "estimationScheduled";

  return (
    <div className="dispatcher-form-container">
      <div className="form-container">
        <div className="job-details">
          <p>
            Hello there, we need someone for{" "}
            <span className="highlight">{job?.data?.jobData?.trade}</span>
            <br />
            to: <span className="highlight">{job.data.jobData?.jobdescr}</span>
            <br />
            At: <span className="highlight">{job?.data?.jobData?.joblocation}</span>
            <br />
            Maximum by: <span className="highlight">{job?.data?.jobData?.neededdate}</span>
            <br />
            You guys do free estimation, right?
            <br />
            <span className="highlight">YES?</span> AWESOME!
            <br />
            <span className="highlight">No?</span> How much do you guys charge? The best I can do is:
            <br />
            <span className="highlight">
              {job?.data?.jobData?.nte ? `${job.data.jobData.nte - 25}$` : ""}
            </span>
            <br />
            <span className="highlight">No?</span> Ok ok give me a minute, I will ask my manager, I might be able to get you:
            <br />
            <span className="highlight">{job?.data?.jobData?.nte ? `${job.data.jobData.nte}$` : ""}</span>
            <h3>WO# {job.data.woNum}</h3>
          </p>
        </div>
        <div className="form-content">
         
          <div className="form-row">
            {handleInputRendering()}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Upload Pictures</label>
              <input type="file" multiple onChange={handleFileChange} />
            </div>
          </div>
          <div className="form-row thumbnails-row">
            {thumbnails.map((url, index) => (
              <div
                key={index}
                className={`thumbnail-container ${expandedThumbnail === url ? "expanded" : ""}`}
                onClick={() => setExpandedThumbnail(url)}
              >
                <img src={url} alt={`Thumbnail ${index}`} className="thumbnail" />
              </div>
            ))}
          </div>
        </div>
        <div className="button-container">
          <button
            className="button-primary"
            onClick={isEstimation ? handleSubmit : handleSubmit2}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Submit"}
          </button>
          <button className="button-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DispatcherForm;
