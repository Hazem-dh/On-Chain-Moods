import { motion } from "framer-motion";

const FloatingStar = ({
  x,
  delay,
  duration,
  size,
}: {
  x: string;
  delay: number;
  duration: number;
  size: number;
}) => (
  <motion.div
    className="fixed pointer-events-none select-none z-0"
    style={{ left: x, bottom: -40, fontSize: size }}
    animate={{ y: [0, -window.innerHeight - 100], opacity: [0, 1, 1, 0] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  >
    ✦
  </motion.div>
);

export default FloatingStar;
