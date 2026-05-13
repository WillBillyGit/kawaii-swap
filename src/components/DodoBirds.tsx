import { motion } from "motion/react";

export default function DodoBirds() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-5 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`dodo-${i}`}
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            scale: 0.6 + Math.random() * 0.4
          }}
          animate={{
            y: [null, "-20px", "20px"],
            x: [null, "10px", "-10px"],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut"
          }}
          className="absolute"
        >
          <div className="relative">
             <div className="w-12 h-10 bg-kawaii-lavender rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.2)] border-2 border-white/30" />
             <div className="absolute -top-2 left-6 w-8 h-8 bg-kawaii-lavender rounded-full border-2 border-white/30" />
             <div className="absolute top-2 left-10 w-4 h-3 bg-kawaii-gold rounded-full" />
             <div className="absolute top-1 left-8 w-1 h-1 bg-kawaii-purple rounded-full" />
             <motion.div 
               animate={{ rotate: [0, -15, 0] }}
               transition={{ duration: 1, repeat: Infinity }}
               className="absolute top-4 -left-2 w-6 h-4 bg-white/40 rounded-full border border-white/20" 
             />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
