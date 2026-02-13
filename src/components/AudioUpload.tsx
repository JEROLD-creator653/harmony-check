import { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Music, FileAudio } from "lucide-react";
import type { AudioMetadata } from "@/lib/audioAnalysis";

interface AudioUploadProps {
  metadata: AudioMetadata | null;
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

const AudioUpload = ({ metadata, onFileSelect, isAnalyzing }: AudioUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && (file.type === "audio/mpeg" || file.type === "audio/wav")) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      id="upload-zone"
      className="glass rounded-2xl p-8 max-w-2xl mx-auto glow-purple relative overflow-hidden"
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-purple/20 via-neon-blue/20 to-neon-cyan/20 opacity-50 pointer-events-none" />

      {!metadata ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="relative z-10 flex flex-col items-center gap-5 py-12 cursor-pointer group"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center glow-purple"
          >
            <Upload className="w-9 h-9 text-foreground" />
          </motion.div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Drop your audio file here
            </h2>
            <p className="text-muted-foreground text-sm">
              Supports MP3 & WAV • Drag & drop or click to browse
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-foreground font-semibold text-sm glow-purple transition-all"
          >
            Choose File
          </motion.button>
          <input
            ref={inputRef}
            type="file"
            accept=".mp3,.wav,audio/mpeg,audio/wav"
            className="hidden"
            onChange={handleChange}
          />
        </div>
      ) : (
        <div className="relative z-10 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center shrink-0">
              <FileAudio className="w-7 h-7 text-foreground" />
            </div>
            <div className="min-w-0">
              <h3 className="text-foreground font-semibold truncate">{metadata.fileName}</h3>
              <p className="text-muted-foreground text-sm">
                {formatDuration(metadata.duration)} • {formatSize(metadata.fileSize)} • {metadata.sampleRate / 1000}kHz • {metadata.channels === 1 ? "Mono" : "Stereo"}
              </p>
            </div>
            {!isAnalyzing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => inputRef.current?.click()}
                className="ml-auto px-4 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:text-foreground transition-colors"
              >
                Change
              </motion.button>
            )}
          </div>

          {/* Waveform */}
          <div className="flex items-end gap-[2px] h-16">
            {metadata.waveformData.map((v, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(4, v * 100)}%` }}
                transition={{ delay: i * 0.003, duration: 0.4 }}
                className="flex-1 rounded-full bg-gradient-to-t from-neon-purple to-neon-cyan min-h-[3px]"
                style={{ opacity: 0.4 + v * 0.6 }}
              />
            ))}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".mp3,.wav,audio/mpeg,audio/wav"
            className="hidden"
            onChange={handleChange}
          />
        </div>
      )}
    </motion.div>
  );
};

export default AudioUpload;
