import { motion } from "framer-motion";
import { Music, Play, Apple, Instagram, Waves } from "lucide-react";

interface Platform {
  id: string;
  name: string;
  color: string;
  glowClass: string;
}

const platforms: Platform[] = [
  { id: "spotify", name: "Spotify", color: "from-green-500 to-green-400", glowClass: "glow-green" },
  { id: "youtube", name: "YouTube", color: "from-red-500 to-red-400", glowClass: "glow-purple" },
  { id: "apple", name: "Apple Music", color: "from-pink-500 to-rose-400", glowClass: "glow-purple" },
  { id: "instagram", name: "Instagram", color: "from-purple-500 to-pink-500", glowClass: "glow-purple" },
  { id: "tidal", name: "TIDAL", color: "from-blue-400 to-cyan-400", glowClass: "glow-cyan" },
];

const PlatformIcon = ({ id }: { id: string }) => {
  const iconClass = "w-7 h-7";
  switch (id) {
    case "spotify": return <Music className={iconClass} />;
    case "youtube": return <Play className={iconClass} />;
    case "apple": return <Apple className={iconClass} />;
    case "instagram": return <Instagram className={iconClass} />;
    case "tidal": return <Waves className={iconClass} />;
    default: return <Music className={iconClass} />;
  }
};

interface PlatformSelectorProps {
  selected: string[];
  onToggle: (id: string) => void;
  isAnalyzing: boolean;
  completedPlatforms: string[];
}

const PlatformSelector = ({ selected, onToggle, isAnalyzing, completedPlatforms }: PlatformSelectorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-wrap justify-center gap-6"
      id="platform-selector"
    >
      {platforms.map((p, i) => {
        const isSelected = selected.includes(p.id);
        const isCompleted = completedPlatforms.includes(p.id);
        const isProcessing = isAnalyzing && isSelected && !isCompleted;

        return (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
            whileHover={!isAnalyzing ? { scale: 1.1 } : {}}
            whileTap={!isAnalyzing ? { scale: 0.95 } : {}}
            onClick={() => !isAnalyzing && onToggle(p.id)}
            disabled={isAnalyzing}
            className={`relative flex flex-col items-center gap-2 group`}
          >
            {/* Spinner ring */}
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[82px] h-[82px] rounded-full border-2 border-transparent border-t-neon-purple border-r-neon-blue animate-spin-slow" />
              </div>
            )}

            {/* Icon circle */}
            <div
              className={`relative w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-300 ${
                isSelected
                  ? `bg-gradient-to-br ${p.color} ${p.glowClass} text-foreground`
                  : "bg-muted/50 text-muted-foreground border border-border hover:border-primary/30"
              }`}
            >
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-foreground text-2xl"
                >
                  ✓
                </motion.div>
              ) : (
                <PlatformIcon id={p.id} />
              )}

              {/* Glow ring on selected */}
              {isSelected && !isProcessing && (
                <div className={`absolute inset-[-4px] rounded-full border-2 border-white/20 animate-pulse-glow pointer-events-none`} />
              )}
            </div>

            <span className={`text-xs font-medium transition-colors ${
              isSelected ? "text-foreground" : "text-muted-foreground"
            }`}>
              {p.name}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default PlatformSelector;
