export interface AudioMetadata {
  fileName: string;
  fileSize: number;
  duration: number;
  sampleRate: number;
  channels: number;
  bitrate: number;
  peakAmplitude: number;
  estimatedLUFS: number;
  waveformData: number[];
}

export interface PlatformRequirements {
  name: string;
  minBitrate: number;
  recommendedBitrate: number;
  targetLUFS: number;
  lufsRange: [number, number];
  minSampleRate: number;
  recommendedSampleRate: number;
  formats: string[];
}

export const PLATFORM_REQUIREMENTS: Record<string, PlatformRequirements> = {
  spotify: {
    name: "Spotify",
    minBitrate: 96,
    recommendedBitrate: 320,
    targetLUFS: -14,
    lufsRange: [-16, -12],
    minSampleRate: 44100,
    recommendedSampleRate: 44100,
    formats: ["WAV", "FLAC", "OGG"],
  },
  youtube: {
    name: "YouTube",
    minBitrate: 128,
    recommendedBitrate: 256,
    targetLUFS: -14,
    lufsRange: [-16, -12],
    minSampleRate: 44100,
    recommendedSampleRate: 48000,
    formats: ["WAV", "MP3", "AAC"],
  },
  apple: {
    name: "Apple Music",
    minBitrate: 256,
    recommendedBitrate: 320,
    targetLUFS: -16,
    lufsRange: [-18, -14],
    minSampleRate: 44100,
    recommendedSampleRate: 96000,
    formats: ["WAV", "AIFF", "ALAC"],
  },
  instagram: {
    name: "Instagram",
    minBitrate: 128,
    recommendedBitrate: 192,
    targetLUFS: -14,
    lufsRange: [-16, -12],
    minSampleRate: 44100,
    recommendedSampleRate: 44100,
    formats: ["MP3", "AAC"],
  },
  tidal: {
    name: "TIDAL",
    minBitrate: 320,
    recommendedBitrate: 1411,
    targetLUFS: -14,
    lufsRange: [-16, -12],
    minSampleRate: 44100,
    recommendedSampleRate: 96000,
    formats: ["WAV", "FLAC", "MQA"],
  },
};

export async function analyzeAudio(file: File): Promise<AudioMetadata> {
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const duration = audioBuffer.duration;
  const sampleRate = audioBuffer.sampleRate;
  const channels = audioBuffer.numberOfChannels;
  const bitrate = Math.round((file.size * 8) / duration / 1000);

  // Get waveform data
  const channelData = audioBuffer.getChannelData(0);
  const samples = 200;
  const blockSize = Math.floor(channelData.length / samples);
  const waveformData: number[] = [];

  for (let i = 0; i < samples; i++) {
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(channelData[i * blockSize + j]);
    }
    waveformData.push(sum / blockSize);
  }

  // Peak amplitude
  let peak = 0;
  for (let i = 0; i < channelData.length; i++) {
    const abs = Math.abs(channelData[i]);
    if (abs > peak) peak = abs;
  }

  // Estimated LUFS (simplified RMS-based estimation)
  let sumSquares = 0;
  for (let i = 0; i < channelData.length; i++) {
    sumSquares += channelData[i] * channelData[i];
  }
  const rms = Math.sqrt(sumSquares / channelData.length);
  const estimatedLUFS = 20 * Math.log10(rms + 1e-10) - 0.691;

  audioContext.close();

  return {
    fileName: file.name,
    fileSize: file.size,
    duration,
    sampleRate,
    channels,
    bitrate,
    peakAmplitude: peak,
    estimatedLUFS,
    waveformData,
  };
}

export interface PlatformReport {
  platform: string;
  qualityScore: number;
  bitratePass: boolean;
  bitrateValue: number;
  loudnessOk: boolean;
  measuredLUFS: number;
  targetLUFS: number;
  sampleRatePass: boolean;
  compressionRisk: "low" | "medium" | "high";
  readinessPercent: number;
}

export function generateReport(
  metadata: AudioMetadata,
  platformId: string
): PlatformReport {
  const req = PLATFORM_REQUIREMENTS[platformId];
  if (!req) throw new Error(`Unknown platform: ${platformId}`);

  const bitratePass = metadata.bitrate >= req.minBitrate;
  const sampleRatePass = metadata.sampleRate >= req.minSampleRate;
  const loudnessOk =
    metadata.estimatedLUFS >= req.lufsRange[0] &&
    metadata.estimatedLUFS <= req.lufsRange[1];

  const compressionRisk: "low" | "medium" | "high" =
    metadata.bitrate >= req.recommendedBitrate
      ? "low"
      : metadata.bitrate >= req.minBitrate
      ? "medium"
      : "high";

  let score = 100;
  if (!bitratePass) score -= 30;
  else if (metadata.bitrate < req.recommendedBitrate) score -= 10;
  if (!sampleRatePass) score -= 20;
  if (!loudnessOk) score -= 20;
  if (compressionRisk === "high") score -= 15;
  else if (compressionRisk === "medium") score -= 5;

  score = Math.max(0, Math.min(100, score));

  const readiness = Math.round(
    (Number(bitratePass) * 30 +
      Number(sampleRatePass) * 25 +
      Number(loudnessOk) * 25 +
      Number(compressionRisk === "low") * 20) 
  );

  return {
    platform: platformId,
    qualityScore: score,
    bitratePass,
    bitrateValue: metadata.bitrate,
    loudnessOk,
    measuredLUFS: Math.round(metadata.estimatedLUFS * 10) / 10,
    targetLUFS: req.targetLUFS,
    sampleRatePass,
    compressionRisk,
    readinessPercent: readiness,
  };
}
