import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function SocialFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchSocialPosts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/ai-social-posts");
        setPosts(res.data.posts);
      } catch (error) {
        console.error("Error fetching social posts:", error);
      }
    };
    fetchSocialPosts();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-red-900 via-yellow-700 to-red-800 text-white overflow-hidden">
      {/* 🔥 Glowing Fire-Like Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 w-[500px] h-[500px] bg-red-500 rounded-full opacity-10 animate-ping transform -translate-x-1/2" />
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.04, scale: 1 }}
          transition={{ duration: 2 }}
          style={{marginLeft: "-420px"}}
          className="absolute text-[9rem] font-black top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 select-none"
        >
          SOCIAL FEEDS
        </motion.h1>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 p-6">
        <motion.h1
          className="text-4xl font-extrabold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🔥 Social Media Fire Alerts
        </motion.h1>
        <p className="text-white/80 mb-6">
          AI-generated simulated social media posts related to fire alerts.
        </p>

        <AnimatePresence>
          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white/20 backdrop-blur-lg p-4 rounded shadow text-white"
              >
                <p><strong>@FireBot{index + 1}:</strong> {post}</p>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
