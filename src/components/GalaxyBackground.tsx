import { motion } from "motion/react";

export default function GalaxyBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#0f0a1e] overflow-hidden">
      {/* Central Nebula */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] opacity-30 select-none pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-kawaii-lavender)_0%,_transparent_70%)] blur-[120px] animate-pulse-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffb7e2_0%,_transparent_60%)] blur-[100px] animate-pulse-slow delay-1000" />
      </div>

      {/* Floating Crystals */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            rotate: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.5
          }}
          animate={{
            y: [null, (Math.random() * -50) + "px", (Math.random() * 50) + "px"],
            rotate: [null, (Math.random() * 20) + "deg", (Math.random() * -20) + "deg"]
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            repeatType: "mirror"
          }}
          className="absolute w-8 h-12 bg-linear-to-tr from-kawaii-blue/40 to-kawaii-pink/40 blur-[1px] border border-white/30 rounded-lg pointer-events-none"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        />
      ))}

      {/* Little Sparkles */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
          className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}
