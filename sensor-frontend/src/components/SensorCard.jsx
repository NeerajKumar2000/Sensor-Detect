import React from 'react';

export default function SensorCard({ sensor }) {
  let bgColor = 'bg-gray-200';
  if (sensor.threat === 'High') bgColor = 'bg-red-100 border-red-500';
  else if (sensor.threat === 'Medium') bgColor = 'bg-yellow-100 border-yellow-500';
  else if (sensor.threat === 'Low') bgColor = 'bg-green-100 border-green-500';

  return (
    <div className={`border-l-4 ${bgColor} p-4 rounded shadow hover:shadow-lg transition`}>
      <h3 className="text-lg font-semibold mb-2">{sensor.name}</h3>
      <p><span className="font-bold">Location:</span> {sensor.location}</p>
      <p><span className="font-bold">Threat Level:</span> {sensor.threat}</p>
      <p><span className="font-bold">Status:</span> {sensor.status}</p>
    </div>
  );
}
