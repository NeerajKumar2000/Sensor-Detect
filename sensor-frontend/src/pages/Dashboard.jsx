import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis
} from 'recharts';
import { motion } from 'framer-motion';

const STATUS_COLORS = ['#00C49F', '#FF8042'];

export default function Dashboard() {
  const [incidentData, setIncidentData] = useState([]);
  const [latestIncidents, setLatestIncidents] = useState([]);
  const navigate = useNavigate();
  const apiBase = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${apiBase}/incidents`);
        const formatted = res.data.map(item => ({
          ...item,
          date: item.timestamp.split("T")[0]
        }));
        setIncidentData(formatted);

        // Sort by latest and pick top 5
        const sorted = [...formatted].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setLatestIncidents(sorted.slice(0, 10));
      } catch (error) {
        console.error("Error fetching incident data:", error.message);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const total = incidentData.length;
  const newCount = incidentData.filter(i => i.status === 'New').length;
  const resolvedCount = incidentData.filter(i => i.status === 'Resolved').length;

  const dailyData = Object.entries(
    incidentData.reduce((acc, item) => {
      acc[item.date] = (acc[item.date] || 0) + 1;
      return acc;
    }, {})
  )
  .map(([date, count]) => ({ date, count }))
  .sort((a, b) => new Date(a.date) - new Date(b.date)); // ✅ Sort by ascending date

  const statusData = Object.entries(
    incidentData.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
      {/* Background Title Text */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1 }}
          className="text-[160px] font-extrabold text-white select-none"
        >
          SENSOR_IQ
        </motion.h1>
      </div>

      <div className="relative z-10 flex h-full">
        {/* Sidebar */}
        <div className="w-64 bg-black/50 text-white p-4">
          <h2 className="text-xl font-bold mb-4">Sensor_IQ</h2>
          <ul>
            <li className="mb-2 hover:text-blue-400"><Link to="/dashboard">Dashboard</Link></li>
            <li className="mb-2 hover:text-blue-400"><Link to="/incidents">Incidents</Link></li>
            <li className="mb-2 hover:text-blue-400"><Link to="/analytics">Analytics</Link></li>
            <li className="mb-2 hover:text-blue-400"><Link to="/live">Live Feeds</Link></li>
            <li className="mb-2 hover:text-blue-400"><Link to="/social">Social Feeds</Link></li>
            <li className="mb-2 hover:text-blue-400"><Link to="/map">Map</Link></li>
            <li className="mt-6 hover:text-red-400 cursor-pointer" onClick={() => {
              localStorage.removeItem("authToken");
              navigate("/");
            }}>Logout</li>
          </ul>
        </div>

        {/* Main Content */}
        <motion.div
          className="flex-1 p-6 overflow-y-auto bg-white/30 backdrop-blur"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white drop-shadow-md mb-6">Dashboard</h1>

          {/* Count Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <motion.div
              className="bg-white/60 backdrop-blur-sm shadow rounded p-4 border-l-4 border-blue-500"
              whileHover={{ scale: 1.03 }}
            >
              <h2 className="text-xl font-semibold">Total Incidents</h2>
              <p className="text-3xl">{total}</p>
            </motion.div>
            <motion.div
              className="bg-white/60 backdrop-blur-sm shadow rounded p-4 border-l-4 border-red-500"
              whileHover={{ scale: 1.03 }}
            >
              <h2 className="text-xl font-semibold">New Incidents</h2>
              <p className="text-3xl text-red-600">{newCount}</p>
            </motion.div>
            <motion.div
              className="bg-white/60 backdrop-blur-sm shadow rounded p-4 border-l-4 border-green-500"
              whileHover={{ scale: 1.03 }}
            >
              <h2 className="text-xl font-semibold">Resolved Incidents</h2>
              <p className="text-3xl text-green-600">{resolvedCount}</p>
            </motion.div>
          </div>

          {/* Latest Incidents Feed */}
          <motion.div
            className="mb-8 bg-white/60 backdrop-blur-sm p-4 rounded shadow"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-2">🕒 Latest 10 Incidents</h2>
            <ul className="text-sm space-y-2">
              {latestIncidents.map((item, idx) => (
                <li key={idx} className="text-gray-900">
                  <strong>{item.type}</strong> — {new Date(item.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Graphs */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              className="bg-white/60 backdrop-blur-sm p-4 rounded shadow"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl font-semibold mb-2">Daily Incident Trend</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailyData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3182ce" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              className="bg-white/60 backdrop-blur-sm p-4 rounded shadow"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-2">Incident Status</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
