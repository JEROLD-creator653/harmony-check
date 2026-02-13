import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import type { PlatformReport } from "@/lib/audioAnalysis";
import { PLATFORM_REQUIREMENTS } from "@/lib/audioAnalysis";

interface ReportCardProps {
  report: PlatformReport;
  index: number;
  aiTips?: string[];
}

const CircularProgress = ({ value, size = 80 }: { value: number; size?: number }) => {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const color =
    value >= 80 ? "hsl(160, 84%, 40%)" : value >= 50 ? "hsl(45, 93%, 47%)" : "hsl(0, 84%, 60%)";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(240,10%,16%)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-foreground font-bold text-lg">{value}</span>
      </div>
    </div>
  );
};

const StatusBadge = ({ pass, label, value }: { pass: boolean; label: string; value: string }) => (
  <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
    <span className="text-muted-foreground text-sm">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-foreground text-sm font-medium">{value}</span>
      {pass ? (
        <CheckCircle className="w-4 h-4 text-neon-green" />
      ) : (
        <XCircle className="w-4 h-4 text-destructive" />
      )}
    </div>
  </div>
);

const ReportCard = ({ report, index, aiTips }: ReportCardProps) => {
  const req = PLATFORM_REQUIREMENTS[report.platform];
  const riskColor =
    report.compressionRisk === "low"
      ? "text-neon-green"
      : report.compressionRisk === "medium"
      ? "text-yellow-400"
      : "text-destructive";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="glass rounded-2xl p-6 space-y-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-foreground font-bold text-lg">{req.name}</h3>
        <CircularProgress value={report.qualityScore} />
      </div>

      <div className="space-y-0">
        <StatusBadge
          pass={report.bitratePass}
          label="Bitrate"
          value={`${report.bitrateValue} kbps (min ${req.minBitrate})`}
        />
        <StatusBadge
          pass={report.loudnessOk}
          label="Loudness"
          value={`${report.measuredLUFS} LUFS (target ${report.targetLUFS})`}
        />
        <StatusBadge
          pass={report.sampleRatePass}
          label="Sample Rate"
          value={`≥ ${req.minSampleRate / 1000}kHz`}
        />
        <div className="flex items-center justify-between py-2 border-b border-border/50">
          <span className="text-muted-foreground text-sm">Compression Risk</span>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium capitalize ${riskColor}`}>
              {report.compressionRisk}
            </span>
            <AlertTriangle className={`w-4 h-4 ${riskColor}`} />
          </div>
        </div>
      </div>

      {/* Readiness bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Platform Readiness</span>
          <span className="text-foreground font-semibold">{report.readinessPercent}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${report.readinessPercent}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: index * 0.15 + 0.3 }}
            className="h-full rounded-full bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan"
          />
        </div>
      </div>

      {/* AI Tips */}
      {aiTips && aiTips.length > 0 && (
        <div className="space-y-2 pt-2">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            🧠 AI Suggestions
          </h4>
          <ul className="space-y-1.5">
            {aiTips.map((tip, i) => (
              <li key={i} className="text-muted-foreground text-xs leading-relaxed flex gap-2">
                <span className="text-neon-cyan shrink-0">▸</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default ReportCard;
