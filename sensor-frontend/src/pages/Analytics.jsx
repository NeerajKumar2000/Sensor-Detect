import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { motion } from 'framer-motion';

const STATUS_COLORS = ['#00C49F', '#FF8042'];
const TYPE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d884d8', '#84c4ff'];

export default function Analytics() {
  const [incidentData, setIncidentData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://127.0.0.1:8000/incidents");
      const formatted = res.data.map(item => ({
        ...item,
        date: item.timestamp.split("T")[0]
      }));
      setIncidentData(formatted);
    };
    fetchData();
  }, []);

  const dailyTrend = Object.entries(
    incidentData.reduce((acc, curr) => {
      acc[curr.date] = (acc[curr.date] || 0) + 1;
      return acc;
    }, {})
  ).map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // 👈 sort by date

  const typeData = Object.entries(
    incidentData.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {})
  ).map(([type, value]) => ({ type, value }));

  const statusData = Object.entries(
    incidentData.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const typeStack = {};
  incidentData.forEach(item => {
    if (!typeStack[item.date]) typeStack[item.date] = {};
    typeStack[item.date][item.type] = (typeStack[item.date][item.type] || 0) + 1;
  });

  const stackedData = Object.entries(typeStack)
    .map(([date, types]) => ({ date, ...types }))
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // 👈 sort by date

  const uniqueTypes = [...new Set(incidentData.map(i => i.type))];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-fuchsia-800 to-pink-700 overflow-hidden text-white">
      {/* Glowing Background & Title */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-pink-400 opacity-10 animate-ping" />
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.04 }}
          transition={{ duration: 1 }}
          className="absolute text-[11rem] font-black text-white select-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"
        >
          ANALYTICS
        </motion.h1>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6">
        <motion.h1
          className="text-4xl font-extrabold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          📈 Analytics Dashboard
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/20 backdrop-blur p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Daily Incident Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyTrend}>
                <XAxis dataKey="date" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#00C49F" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/20 backdrop-blur p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Status Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/20 backdrop-blur p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Incidents by Type</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={typeData}>
                <XAxis dataKey="type" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/20 backdrop-blur p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Type Distribution Over Time</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stackedData}>
                <XAxis dataKey="date" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Legend />
                {uniqueTypes.map((type, index) => (
                  <Bar
                    key={type}
                    dataKey={type}
                    stackId="a"
                    fill={TYPE_COLORS[index % TYPE_COLORS.length]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
