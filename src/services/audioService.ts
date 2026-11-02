class SoundController {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playBeep(freq = 800, type: OscillatorType = 'sine', duration = 0.08) {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {}
  }

  playSafeSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.15, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.2);
      });
    } catch {}
  }

  playError() {
    this.playBeep(220, 'sawtooth', 0.25);
  }

  playScan() {
    this.playBeep(1200, 'sine', 0.05);
  }

  // Plays genuine Dialogue MP3 with voice fallback
  playNanaDialogue() {
    try {
      if (typeof window !== 'undefined') {
        const audio = new Audio('/nana_dialogue.mp3?t=' + Date.now());
        audio.volume = 1.0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Direct MP3 play failed, triggering speech fallback:", err);
            this.playSpeechFallback();
          });
        }
      } else {
        this.playSpeechFallback();
      }
    } catch (e) {
      console.warn("Audio creation failed:", e);
      this.playSpeechFallback();
    }
  }

  private playSpeechFallback() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("आ गए मेरी मौत का तमाशा देखने?!!");
      utterance.lang = 'hi-IN';
      utterance.pitch = 0.85;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  }
  // Character Text-to-Speech Voice Engine (Distinct voices for Panda, Maya, Suspects)
  speakDialogue(
    text: string, 
    character: 'panda' | 'maya' | 'evelyn' | 'marcus' | 'aria' | 'default' = 'default'
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    try {
      window.speechSynthesis.cancel(); // Stop previous voice
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();

      // Find the most natural/neural voice candidates
      // Modern browsers expose Natural / Online / Google / Neural voices
      const getBestVoice = (filterFn: (v: SpeechSynthesisVoice) => boolean) => {
        const matching = voices.filter(filterFn);
        // Prioritize Natural, Online, Google, or Premium neural voices
        const natural = matching.find(v => 
          v.name.includes('Natural') || 
          v.name.includes('Online') || 
          v.name.includes('Neural') || 
          v.name.includes('Google') ||
          v.name.includes('Premium')
        );
        return natural || matching[0];
      };
      
      switch (character) {
        case 'panda': {
          // Deep, gruff detective tone with authoritative cadence
          utterance.pitch = 0.76;
          utterance.rate = 0.94;
          const deepVoice = getBestVoice(v => 
            v.lang.startsWith('en') && 
            (v.name.includes('David') || v.name.includes('Guy') || v.name.includes('George') || v.name.includes('Male') || v.name.includes('James'))
          );
          if (deepVoice) utterance.voice = deepVoice;
          break;
        }

        case 'maya': {
          // Crisp, professional, warm female specialist tone
          utterance.pitch = 1.12;
          utterance.rate = 1.02;
          const femaleVoice = getBestVoice(v => 
            v.lang.startsWith('en') && 
            (v.name.includes('Jenny') || v.name.includes('Zira') || v.name.includes('Aria') || v.name.includes('Female') || v.name.includes('Samantha'))
          );
          if (femaleVoice) utterance.voice = femaleVoice;
          break;
        }

        case 'evelyn': {
          // Cold, sophisticated, British/Mid-Atlantic calculative female tone
          utterance.pitch = 0.98;
          utterance.rate = 0.92;
          const coldVoice = getBestVoice(v => 
            v.lang.startsWith('en') && 
            (v.name.includes('UK') || v.name.includes('British') || v.name.includes('Libby') || v.name.includes('Sonia') || v.name.includes('Susan') || v.name.includes('Female'))
          );
          if (coldVoice) utterance.voice = coldVoice;
          break;
        }

        case 'marcus': {
          // Anxious, slightly breathless, energetic male tech-lead tone
          utterance.pitch = 1.04;
          utterance.rate = 1.08;
          const maleVoice = getBestVoice(v => 
            v.lang.startsWith('en') && 
            (v.name.includes('Ryan') || v.name.includes('Christopher') || v.name.includes('Mark') || v.name.includes('Male'))
          );
          if (maleVoice) utterance.voice = maleVoice;
          break;
        }

        case 'aria': {
          // Robotic, sharp, synthesized AI assistant tone
          utterance.pitch = 1.35;
          utterance.rate = 1.15;
          const aiVoice = getBestVoice(v => 
            v.lang.startsWith('en') && 
            (v.name.includes('Desktop') || v.name.includes('Synthetic') || v.name.includes('Hazel') || v.name.includes('Google'))
          );
          if (aiVoice) utterance.voice = aiVoice;
          break;
        }

        default: {
          utterance.pitch = 1.0;
          utterance.rate = 1.0;
          break;
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }

  stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const sounds = new SoundController();
