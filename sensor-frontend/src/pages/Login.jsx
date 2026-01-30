import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleLogin = () => {
    localStorage.setItem('authToken', 'dummyToken');
    navigate('/dashboard');
  };

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center">
      {/* Improved Background Title Text */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <h1 className="text-[100px] sm:text-[150px] lg:text-[160px] font-black text-white/10 tracking-widest select-none" style={{marginBottom: "500px"}}>
          SENSOR_IQ
        </h1>
      </div>

      {/* Glass Login Box */}
      <motion.div
        className="relative z-10 backdrop-blur-lg bg-white/20 border border-white/30 p-8 rounded-xl shadow-2xl w-96"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: show ? 1 : 0, y: show ? 0 : 30 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-white drop-shadow-md">
          Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 bg-white/60 text-black placeholder-gray-700 border border-white/40 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 bg-white/60 text-black placeholder-gray-700 border border-white/40 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition duration-200 font-semibold shadow-md"
        >
          Login
        </button>
      </motion.div>
    </div>
  );
}
