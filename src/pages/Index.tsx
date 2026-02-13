import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import AudioUpload from "@/components/AudioUpload";
import PlatformSelector from "@/components/PlatformSelector";
import NeuralFlowAnimation from "@/components/NeuralFlowAnimation";
import ReportCard from "@/components/ReportCard";
import { analyzeAudio, generateReport, type AudioMetadata, type PlatformReport } from "@/lib/audioAnalysis";

const AI_TIPS: Record<string, string[]> = {
  spotify: [
    "Normalize loudness to -14 LUFS for optimal playback.",
    "Use lossless WAV/FLAC for distribution to avoid double-compression.",
    "Leave 0.5–1 dB headroom to prevent clipping after encoding.",
  ],
  youtube: [
    "Target -14 LUFS for consistent loudness across YouTube.",
    "48 kHz sample rate is preferred for YouTube audio.",
    "Avoid heavy limiting — YouTube's normalizer will reduce perceived quality.",
  ],
  apple: [
    "Apple Music targets -16 LUFS — slightly quieter than Spotify.",
    "Submit in ALAC/WAV at 24-bit for Apple Digital Masters.",
    "Ensure no intersample peaks above -1 dBTP.",
  ],
  instagram: [
    "Keep audio under 60s for Reels with punchy dynamics.",
    "Compress to 192 kbps AAC for optimal Instagram playback.",
    "Boost high-end slightly to cut through phone speakers.",
  ],
  tidal: [
    "TIDAL HiFi supports lossless — submit at 16-bit/44.1 kHz minimum.",
    "For MQA, provide original high-res masters (96 kHz+).",
    "Dynamic range is valued — avoid over-compression.",
  ],
};

const Index = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<AudioMetadata | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [completedPlatforms, setCompletedPlatforms] = useState<string[]>([]);
  const [reports, setReports] = useState<PlatformReport[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    setAudioFile(file);
    setReports([]);
    setCompletedPlatforms([]);
    setAnalysisComplete(false);
    try {
      const meta = await analyzeAudio(file);
      setMetadata(meta);
    } catch (err) {
      console.error("Failed to analyze audio:", err);
    }
  }, []);

  const togglePlatform = useCallback((id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, []);

  const startAnalysis = useCallback(async () => {
    if (!metadata || selectedPlatforms.length === 0) return;

    setIsAnalyzing(true);
    setReports([]);
    setCompletedPlatforms([]);
    setAnalysisComplete(false);

    const newReports: PlatformReport[] = [];

    for (const platformId of selectedPlatforms) {
      // Simulate AI processing delay
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
      const report = generateReport(metadata, platformId);
      newReports.push(report);
      setCompletedPlatforms((prev) => [...prev, platformId]);
    }

    setReports(newReports);
    setIsAnalyzing(false);
    setAnalysisComplete(true);
  }, [metadata, selectedPlatforms]);

  const canStart = metadata && selectedPlatforms.length > 0 && !isAnalyzing;

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <ParticleBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
            <span className="bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan bg-clip-text text-transparent">
              Music Platform
            </span>{" "}
            Checker
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
            AI-powered audio analysis for Spotify, YouTube, Apple Music, Instagram & TIDAL
          </p>
        </motion.div>

        {/* Upload */}
        <AudioUpload
          metadata={metadata}
          onFileSelect={handleFileSelect}
          isAnalyzing={isAnalyzing}
        />

        {/* Platform Selection */}
        {metadata && (
          <div className="space-y-4">
            <h2 className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Select Platforms
            </h2>
            <PlatformSelector
              selected={selectedPlatforms}
              onToggle={togglePlatform}
              isAnalyzing={isAnalyzing}
              completedPlatforms={completedPlatforms}
            />
          </div>
        )}

        {/* Neural Flow */}
        <NeuralFlowAnimation active={isAnalyzing} />

        {/* Start Button */}
        {metadata && !analysisComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={canStart ? { scale: 1.05 } : {}}
              whileTap={canStart ? { scale: 0.97 } : {}}
              onClick={startAnalysis}
              disabled={!canStart}
              className={`relative px-10 py-4 rounded-2xl font-bold text-foreground text-base transition-all flex items-center gap-3 ${
                canStart
                  ? "bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan glow-purple cursor-pointer"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
              style={canStart ? { backgroundSize: "200% 200%", animation: "gradient-shift 3s ease infinite" } : {}}
            >
              <Zap className="w-5 h-5" />
              {isAnalyzing ? "Analyzing..." : "Start AI Analysis"}
            </motion.button>
          </motion.div>
        )}

        {/* Reports */}
        <AnimatePresence>
          {reports.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h2 className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest">
                Analysis Report
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {reports.map((report, i) => (
                  <ReportCard
                    key={report.platform}
                    report={report}
                    index={i}
                    aiTips={AI_TIPS[report.platform]}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center pt-8 pb-4">
          <p className="text-muted-foreground/50 text-xs">
            Music Platform Drawback & Distribution Checker • Premium Audio Analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
