import { motion } from "framer-motion";

interface NeuralFlowAnimationProps {
  active: boolean;
}

const NeuralFlowAnimation = ({ active }: NeuralFlowAnimationProps) => {
  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex justify-center my-6"
    >
      <div className="flex items-center gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
            className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan"
            style={{
              boxShadow: "0 0 10px hsl(263, 70%, 66%, 0.5)",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default NeuralFlowAnimation;
