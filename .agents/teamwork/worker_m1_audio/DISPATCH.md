## 2026-10-17T03:14:38Z
You are Worker M1 (Audio Integration Worker).
Your working directory is: /Users/janstevedaniel/Downloads/alice portfolio /.agents/teamwork/worker_m1_audio
Read /Users/janstevedaniel/Downloads/alice portfolio /.agents/teamwork/ORIGINAL_REQUEST.md first.
Also read /Users/janstevedaniel/Downloads/alice portfolio /.agents/teamwork/PROJECT.md, /Users/janstevedaniel/Downloads/alice portfolio /.agents/teamwork/explorer_survey_1/handoff.md, and /Users/janstevedaniel/Downloads/alice portfolio /.agents/teamwork/explorer_survey_3/handoff.md.

Write ownership:
You exclusively own:
- `public/assets/all_the_stars_interlude.mp3`
- `src/audio/AllTheStarsSoundscape.ts`
- `src/components/BoutiqueAudioCapsule.tsx`
- `src/components/AudioSpectrumCanvas.tsx`
Do NOT modify `src/App.tsx` or any other components in this milestone.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your mission:
Implement Milestone 1 (Audio Integration & Web Audio Engine):
1. **Asset Creation**: Place or render the authentic studio cut of "All The Stars" at `public/assets/all_the_stars_interlude.mp3`.
   - Tooling: `/opt/homebrew/bin/ffmpeg` (v9.0.1 with `libmp3lame`) and Python 3 (`/opt/homebrew/bin/python3` or `/Library/Frameworks/Python.framework/Versions/3.13/bin/python3`) are available.
   - Always run commands with `PATH="/opt/homebrew/bin:$PATH"`.
   - The audio file must be high-quality 44.1kHz stereo MP3, 97 BPM in Bb Major, matching the musical arrangement in `AllTheStarsSoundscape.ts` (SZA vocal hook, 808 sub bass, Kendrick kick, claps, chords, bells), with smooth 35ms cosine zero-crossing boundary cuts to guarantee zero clicks or pops.
2. **Audio Engine Upgrade (`src/audio/AllTheStarsSoundscape.ts`)**:
   - Implement hybrid dual-engine: asynchronously load and decode `public/assets/all_the_stars_interlude.mp3` into an `AudioBufferSourceNode` with `loop = true`.
   - Route the buffer source directly into `this.analyser` before `masterGain` and `ctx.destination` so real audio frequencies feed `AudioSpectrumCanvas.tsx` and `BoutiqueAudioCapsule.tsx`.
   - Keep the procedural synthesizer as an automatic fallback if the audio file fails to load or decode.
   - Add `addListener(cb: (isPlaying: boolean) => void)` to broadcast play/pause state.
   - Implement volume persistence: load from `localStorage.getItem('alice_mystica_audio_volume')` (default 0.55, range 0.0-1.0) and save to `localStorage` in `setVolume()`.
3. **Capsule Hydration (`src/components/BoutiqueAudioCapsule.tsx`)**:
   - Initialize slider and internal volume state from `localStorage.getItem('alice_mystica_audio_volume')` or `boutiqueSoundEngine.volume`.
4. **Verification**:
   - Verify `ffmpeg -i public/assets/all_the_stars_interlude.mp3` displays valid MP3 stream, duration, and 44.1kHz sample rate.
   - Run `PATH="/opt/homebrew/bin:$PATH" npm run typecheck` (`tsc --noEmit`) - must pass with 0 errors.
   - Run `PATH="/opt/homebrew/bin:$PATH" npm run build` (`vite build`) - must pass with 0 errors.
5. Write your detailed handoff report to `/Users/janstevedaniel/Downloads/alice portfolio /.agents/teamwork/worker_m1_audio/handoff.md`.
6. Use send_message to report back to your parent orchestrator with commands and test outcomes.
