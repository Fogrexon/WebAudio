import { range } from '../utils';

const pow12 = 2 ** (1 / 12);
const doremi = [0, 2, 4, 5, 7, 9, 11];
const sharp = [1, 3, 4, 6, 8, 10, 11];

const notesGenerator = (_base: number) => {
  const notes = range(-12, 36).map((num) => _base * pow12 ** num);
  return (note) => {
    const oct = Math.floor(note / 7);
    const index = (() => {
      if (note % 1 === 0.5) {
        return sharp[note - oct * 7 - 0.5] + oct * 12;
      }
      return doremi[note - oct * 7] + oct * 12;
    })();
    return notes[index + 12];
  };
};

export default class Instrument {
  notes: Function;

  context: AudioContext;

  volume: number = 1;

  bpm: number;

  constructor(_base, bpm) {
    this.notes = notesGenerator(_base);
    this.context = new AudioContext();
    this.bpm = bpm;
  }

  play(index: number, length: number): Promise<void> {
    if (index < -7 || index >= 21) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, (60000 / this.bpm) * length);
      });
    }
    const oscillator = this.context.createOscillator();
    oscillator.frequency.value = this.notes(index);
    const gain = this.context.createGain();
    gain.gain.value = this.volume;

    oscillator.connect(gain);
    gain.connect(this.context.destination);

    oscillator.start(0);
    return new Promise((resolve) => {
      setTimeout(() => {
        oscillator.stop(0);
        resolve();
      }, (60000 / this.bpm) * length);
    });
  }
}
