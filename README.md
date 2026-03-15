

# 🎧 Music Platform Drawback & Distribution Checker

## Overview
A futuristic AI-powered web app that analyzes audio files and generates optimization + risk reports for major music platforms. Ultra-premium dark UI with glassmorphism, neon gradients, and cinematic animations.

---

## 🎨 Design System
- **Theme**: Deep black (#0a0a0f) base with glassmorphism cards (frosted glass, backdrop blur)
- **Colors**: Neon purple (#8B5CF6), electric blue (#3B82F6), cyan (#06B6D4), green (#10B981) gradients
- **Font**: Inter throughout
- **Effects**: Glow shadows, soft reflections, floating particle background, smooth transitions on every interaction
- **Quality Target**: Dolby/Spotify internal software aesthetic

---

## Page 1: Main Dashboard (Single Page App)

### Section 1 — Audio Upload Zone
- Large centered glassmorphism card with drag & drop area
- Accepts MP3 and WAV files
- On upload: shows waveform visualization (Web Audio API), filename, duration, file size
- Glowing animated upload button with pulse effect

### Section 2 — Platform Selection
- Row of circular platform icons: **Spotify, YouTube, Apple Music, Instagram, TIDAL**
- Default state: dimmed with subtle border
- On click: neon glow ring, scale-up animation, selected state
- Multiple selection allowed
- Each icon uses the platform's brand color accent

### Section 3 — Start Analysis Button
- Large glowing "Start AI Analysis" button with gradient animation
- Disabled until file uploaded + at least one platform selected

### Section 4 — AI Processing Animation
- When analysis starts: animated glowing neural lines flow from upload card to each selected platform icon
- Moving particle trails along the lines
- Each platform icon gets a circular spinner border
- Pulsing glow effect during processing
- On completion: spinner stops, green checkmark appears, success glow burst

### Section 5 — Analysis Report
- Below the platforms, glass cards appear for each selected platform
- Each card shows:
  - **Audio Quality Score** (animated circular progress)
  - **Bitrate Check** (pass/fail with value)
  - **Loudness Analysis** (LUFS measurement vs platform target)
  - **Sample Rate Check**
  - **Compression Risk** indicator
  - **Platform Readiness %** (animated progress bar)
  - **AI Optimization Suggestions** (tips from AI for that specific platform)
- Cards animate in with staggered fade-in

---

## Backend (Edge Functions)

### Audio Analysis (Client-Side)
- Web Audio API decodes uploaded file
- Extracts: duration, sample rate, channel count, peak loudness (estimated LUFS)
- Bitrate calculated from file size / duration
- Compared against each platform's known requirements

### AI Suggestions (Edge Function)
- Edge function receives audio metadata + selected platforms
- Calls your AI provider (OpenAI/Gemini) with your API key
- Returns platform-specific optimization tips, quality improvements, and algorithm recommendations
- No data stored — everything in-memory per request

---

## ✨ Premium Effects & Animations
- Animated waveform particles in the background (subtle, ambient)
- Glassmorphism on all cards with blur + border glow
- Micro-interactions: hover scales, button ripples, icon bounces
- Neural flow animation with SVG paths + CSS animations
- Staggered report card reveals
- Smooth scroll transitions
- Loading states with premium skeleton shimmer
