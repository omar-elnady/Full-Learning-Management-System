"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const icons = [
  { icon: "🎬", position: "top-20 left-20" },
  { icon: "💻", position: "top-32 right-32" },
  { icon: "📜", position: "top-1/2 left-16" },
  { icon: "📚", position: "top-1/3 right-20" },
  { icon: "👨‍🏫", position: "bottom-32 left-32" },
  { icon: "🧠", position: "bottom-40 right-24" },
];

export default function FloatingIcons() {
  const [showIcons, setShowIcons] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIcons(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!showIcons) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute ${item.position}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [-10, 10, -10] 
          }}
          transition={{
            opacity: { duration: 0.6 },
            scale: { duration: 0.6 },
            y: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            },
            delay: index * 0.15
          }}
        >
          <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border border-blue-500/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl">{item.icon}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}