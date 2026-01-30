import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { motion } from 'framer-motion';

const sensors = [
  {
    id: 1,
    name: 'Forest Sensor 01',
    lat: 37.7749,
    lng: -122.4194,
    threat: 'High',
  },
  {
    id: 2,
    name: 'Valley Sensor 02',
    lat: 37.8044,
    lng: -122.2711,
    threat: 'Medium',
  },
  {
    id: 3,
    name: 'River Sensor 03',
    lat: 37.6879,
    lng: -122.4702,
    threat: 'Low',
  },
];

const mapContainerStyle = {
  width: '100%',
  height: '80vh',
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

export default function Map() {
  const [selectedSensor, setSelectedSensor] = useState(null);

  const getIcon = (threat) => {
    const base = 'http://maps.google.com/mapfiles/ms/icons/';
    if (threat === 'High') return `${base}red-dot.png`;
    if (threat === 'Medium') return `${base}yellow-dot.png`;
    if (threat === 'Low') return `${base}green-dot.png`;
    return null;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-900 via-yellow-700 to-red-800 text-white overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.04, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute text-[9rem] font-black top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 select-none"
        >
          SENSOR MAP
        </motion.h1>
      </div>

      <div className="relative z-10 p-6">
        <motion.h1
          className="text-4xl font-extrabold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🗺️ Live Sensor Threat Map
        </motion.h1>

        <div className="rounded-lg overflow-hidden shadow-lg border-4 border-white">
          <LoadScript googleMapsApiKey="AIzaSyDT9akE_45-s5tTsj3Ri39N1RiZxttx6Os">
            <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10}>
              {sensors.map((sensor) => (
                <Marker
                  key={sensor.id}
                  position={{ lat: sensor.lat, lng: sensor.lng }}
                  icon={{ url: getIcon(sensor.threat) }}
                  onClick={() => setSelectedSensor(sensor)}
                />
              ))}

              {selectedSensor && (
                <InfoWindow
                  position={{ lat: selectedSensor.lat, lng: selectedSensor.lng }}
                  onCloseClick={() => setSelectedSensor(null)}
                >
                  <div>
                    <h2 className="font-bold text-lg">{selectedSensor.name}</h2>
                    <p>Threat: <span className="font-semibold">{selectedSensor.threat}</span></p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
}
