// audio.js — tiny WebAudio sound effects, generated, no audio files.
// A short chime for a found difference, a low buzz for a miss, a little
// arpeggio for a round win, and a tick for a button click.
export function createAudio() {
  let ctx = null;
  let muted = false;

  function ensure() {
    if (ctx === null) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, at, dur, type, vol) {
    const ac = ensure();
    if (ac === null || muted) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ac.currentTime + at);
    gain.gain.exponentialRampToValueAtTime(vol, ac.currentTime + at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + at + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + at);
    osc.stop(ac.currentTime + at + dur + 0.05);
  }

  return {
    get muted() { return muted; },
    toggleMute() { muted = !muted; return muted; },
    unlock() { ensure(); },
    found() { tone(660, 0, 0.14, 'sine', 0.25); tone(880, 0.09, 0.2, 'sine', 0.25); },
    wrong() { tone(160, 0, 0.22, 'sawtooth', 0.12); },
    click() { tone(520, 0, 0.06, 'triangle', 0.15); },
    hint() { tone(440, 0, 0.1, 'sine', 0.18); tone(554, 0.08, 0.12, 'sine', 0.18); },
    win() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.22, 'triangle', 0.22));
    },
    lose() { tone(392, 0, 0.2, 'triangle', 0.2); tone(311, 0.18, 0.3, 'triangle', 0.2); },
  };
}
