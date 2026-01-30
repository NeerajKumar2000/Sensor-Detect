import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const incidentOptions = [
  { id: 'n5Sensor', label: 'Fire Alarm from N5 Sensor' },
  { id: 'warning', label: 'Warning' },
  { id: 'maintenance', label: 'Under Maintenance' },
  { id: 'cameraDetection', label: 'Camera detected Fire Incident' },
  { id: 'phoneCall', label: 'Phone call received with Fire Incident' }
];

export default function FireIncidentSimulator() {
  const [selectedIncidents, setSelectedIncidents] = useState([]);
  const [incidentList, setIncidentList] = useState([]);
  const [filter, setFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const audioRef = useRef(null);
  const apiBase = "http://127.0.0.1:8000";

  const fetchIncidents = async () => {
    try {
      const res = await axios.get(`${apiBase}/incidents`);
      setIncidentList(res.data);
    } catch (error) {
      console.error("Error fetching incidents:", error);
      toast.error("Unable to fetch incidents.");
    }
  };

  useEffect(() => {
    audioRef.current = new Audio('/mixkit-fast-ignition-fire-1349.mp3'); // File must be in /public
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckboxChange = (option) => {
    setSelectedIncidents((prev) =>
      prev.includes(option.id)
        ? prev.filter((id) => id !== option.id)
        : [...prev, option.id]
    );
  };

  const generateSimulation = async () => {
    const timestamp = new Date().toISOString();
    const incidents = selectedIncidents.map((id) => {
      const match = incidentOptions.find((opt) => opt.id === id);
      return {
        id: Math.random().toString(36).substring(2, 9),
        type: match.label,
        timestamp,
        status: 'New'
      };
    });

    try {
      for (const incident of incidents) {
        await axios.post(`${apiBase}/incidents`, incident);
      }
      audioRef.current?.play(); // 🔔 Play sound on successful generation
      setSelectedIncidents([]);
      toast.success("🔥 Simulation generated!");
      fetchIncidents();
    } catch (error) {
      toast.error("Error generating simulation.");
      console.error("Simulation error:", error);
    }
  };

  const markAsResolved = async (incidentId) => {
    try {
      await axios.put(`${apiBase}/incidents/${incidentId}`);
      toast.success("Marked as resolved.");
      fetchIncidents();
    } catch (error) {
      toast.error("Failed to update incident.");
      console.error("Resolution error:", error);
    }
  };

  const exportAsJson = () => {
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(incidentList, null, 2));
    const link = document.createElement('a');
    link.setAttribute("href", jsonStr);
    link.setAttribute("download", "incident_data.json");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredIncidents = incidentList
    .filter(i => filter === 'All' || i.status === filter)
    .filter(i => typeFilter === 'All' || i.type === typeFilter);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-fuchsia-800 to-pink-700 overflow-hidden text-white">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-pink-400 opacity-10 animate-ping" />
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.04 }}
          transition={{ duration: 1 }}
          style={{marginLeft:"-420px"}}
          className="absolute text-[9rem] font-black text-white select-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"
        >
          INCIDENTS
        </motion.h1>
      </div>

      <div className="relative z-10 p-6">
        <Toaster position="top-right" />
        <motion.h1
          className="text-4xl font-extrabold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🔥 Incident Simulator
        </motion.h1>

        <motion.fieldset
          className="border border-white/30 rounded p-6 max-w-xl bg-white/20 backdrop-blur shadow mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <legend className="text-lg font-semibold">Select Incident Types</legend>
          {incidentOptions.map((option) => (
            <div key={option.id} className="my-2">
              <input
                type="checkbox"
                id={option.id}
                checked={selectedIncidents.includes(option.id)}
                onChange={() => handleCheckboxChange(option)}
                className="mr-2"
              />
              <label htmlFor={option.id}>{option.label}</label>
            </div>
          ))}
          <button
            onClick={generateSimulation}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
          >
            Generate Simulation
          </button>
        </motion.fieldset>

        <div className="flex gap-4 mb-4 flex-wrap">
          {['All', 'New', 'Resolved'].map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded font-semibold text-sm ${
                filter === type ? 'bg-blue-600 text-white' : 'bg-white/30 hover:bg-white/50 text-white'
              }`}
              onClick={() => setFilter(type)}
            >
              {type}
            </motion.button>
          ))}

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded text-black"
          >
            <option value="All">All Types</option>
            {incidentOptions.map(opt => (
              <option key={opt.id} value={opt.label}>{opt.label}</option>
            ))}
          </select>

          <motion.button
            onClick={exportAsJson}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-auto bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Export as JSON
          </motion.button>
        </div>

        {filteredIncidents.length === 0 ? (
          <p className="text-gray-300">No incidents found.</p>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {filteredIncidents.map((incident) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/20 backdrop-blur p-4 rounded shadow text-white flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-bold text-lg">{incident.type}</h3>
                    <p><strong>Time:</strong> {incident.timestamp}</p>
                    <p><strong>Status:</strong> {incident.status}</p>
                  </div>
                  {incident.status === 'New' && (
                    <button
                      onClick={() => markAsResolved(incident.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Mark Resolved
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
