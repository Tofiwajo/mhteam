import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import { geocodeAddress } from './geocode';
import jobsIcon from '../main/Icons/Jobs.jpg';
import techIcon from '../main/Icons/Technichian.png';

const JobsIcon = L.icon({
  iconUrl: jobsIcon,
  iconSize: [30, 30],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const TechIcon = L.icon({
  iconUrl: techIcon,
  iconSize: [50, 50],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const MapComponent = ({ jobs, techs }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedTech, setSelectedTech] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current && mapContainerRef.current) {
        mapRef.current = L.map(mapContainerRef.current).setView([37.0902, -95.7129], 4);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(mapRef.current);

        const geocoder = L.Control.Geocoder.nominatim();
        L.Control.geocoder({
          query: '',
          placeholder: 'Search for a location...',
          defaultMarkGeocode: false,
          geocoder: geocoder,
        })
          .on('markgeocode', (e) => {
            const latLng = e.geocode.center;
            L.marker(latLng).addTo(mapRef.current).bindPopup(e.geocode.name).openPopup();
            mapRef.current.setView(latLng, 10);
          })
          .addTo(mapRef.current);
      }

      if (mapRef.current) {
        const jobMarkers = L.markerClusterGroup({
          iconCreateFunction: (cluster) => {
            return L.divIcon({
              html: `<div style="background-color: orange; border-radius: 50%; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center;">
                      ${cluster.getChildCount()}
                     </div>`,
              className: 'job-cluster-icon'
            });
          }
        });

        const techMarkers = L.markerClusterGroup({
          iconCreateFunction: (cluster) => {
            return L.divIcon({
              html: `<div style="background-color: green; border-radius: 50%; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center;">
                      ${cluster.getChildCount()}
                     </div>`,
              className: 'tech-cluster-icon'
            });
          }
        });

        const geocodedJobs = await Promise.all(jobs.map(async (job) => {
          const { joblocation, jobdescr } = job.data;
          let latLng;

          if (joblocation && typeof joblocation === 'string') {
            latLng = await geocodeAddress(joblocation);
          } else if (joblocation && typeof joblocation.lat === 'number' && typeof joblocation.lng === 'number') {
            latLng = joblocation;
          }

          if (latLng) {
            return { id: job.id, latLng, jobdescr };
          } else {
            console.error(`Invalid job location for job ID ${job.id}: `, joblocation);
            return null;
          }
        }));

        const geocodedTechs = techs.map((tech) => {
          const { coordinates, data } = tech;
          if (coordinates) {
            return { id: tech.id, latLng: coordinates, techData: data };
          } else {
            console.error(`Invalid tech coordinates for tech ID ${tech.id}: `, coordinates);
            return null;
          }
        });

        const onJobMarkerClick = (geocodedJob) => {
          setSelectedJob(geocodedJob);
          calculateDistance(geocodedJob, selectedTech);
        };

        const onTechMarkerClick = (geocodedTech) => {
          setSelectedTech(geocodedTech);
          calculateDistance(selectedJob, geocodedTech);
        };

        geocodedJobs.forEach((geocodedJob) => {
          if (geocodedJob) {
            const { latLng, jobdescr } = geocodedJob;
            const marker = L.marker([latLng.lat, latLng.lng], { icon: JobsIcon })
              .bindPopup(jobdescr || "No description available")
              .on('click', () => onJobMarkerClick(geocodedJob))
              .on('mouseover', () => marker.openPopup())
              .on('mouseout', () => marker.closePopup());
            jobMarkers.addLayer(marker);
          }
        });

        geocodedTechs.forEach((geocodedTech) => {
          if (geocodedTech) {
            const { latLng, techData } = geocodedTech;
            const marker = L.marker([latLng.lat, latLng.lng], { icon: TechIcon })
              .bindPopup(generateTechPopupContent(techData))
              .on('click', () => onTechMarkerClick(geocodedTech))
              .on('mouseover', () => marker.openPopup())
              .on('mouseout', () => marker.closePopup());
            techMarkers.addLayer(marker);
          }
        });

        mapRef.current.addLayer(jobMarkers);
        mapRef.current.addLayer(techMarkers);
      }
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [jobs, techs]);

  const generateTechPopupContent = (techData) => {
    return `
      <div>
        <h4>${techData.techName}</h4>
        <p>Contact: ${techData.contact}</p>
        <p>Free Estimation: ${techData.freeEstimation ? 'Yes' : 'No'}</p>
        <!-- Add more fields as needed -->
      </div>
    `;
  };

  const calculateDistance = (job, tech) => {
    if (job && tech) {
      const { lat: lat1, lng: lon1 } = job.latLng;
      const { lat: lat2, lng: lon2 } = tech.latLng;
      const R = 3958.8; // Radius of the Earth in miles
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      setDistance(distance.toFixed(2));
    } else {
      setDistance(null);
    }
  };

  return (
    <div>
      <div id="map" ref={mapContainerRef} style={{ height: '500px', width: '100%' }} />
      {selectedJob && selectedTech && (
        <div>
          <h3>Selected Job: {selectedJob.jobdescr}</h3>
          <h3>Selected Technician: {selectedTech.techData.techName}</h3>
          <h3>Distance: {distance} miles</h3>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
