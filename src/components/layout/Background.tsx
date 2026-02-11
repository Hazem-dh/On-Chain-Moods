import { motion } from "framer-motion";

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {/* Base tint so gradients don't look "white" */}
      <div className="absolute inset-0 bg-yellow-50/60" />

      {/* Wave 1 - Yellow */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #FFCC00 0%, transparent 55%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Wave 2 - Blue */}
      <motion.div
        className="absolute inset-0 opacity-35"
        style={{
          background:
            "radial-gradient(circle at 30% 70%, #3B4CCA 0%, transparent 55%)",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          x: [-50, 50, -50],
          y: [50, -50, 50],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Wave 3 - Red */}
      <motion.div
        className="absolute inset-0 opacity-25"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, #EF4444 0%, transparent 55%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [100, -100, 100],
          y: [-100, 100, -100],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Mesh Gradient Overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
              linear-gradient(45deg, #FFCC00 0%, transparent 35%),
              linear-gradient(135deg, #3B4CCA 0%, transparent 35%),
              linear-gradient(225deg, #EF4444 0%, transparent 35%)
            `,
        }}
      />

      {/* Optional: subtle blur for a smoother look */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />
    </div>
  );
};

export default Background;
