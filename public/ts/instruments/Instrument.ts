import { range } from '../utils';
import Envelope from './Envelope';
import LFO from './LFO';
import LowPassFilter from './LowPassFilter';
import Wave from './Wave';

const pow12 = 2 ** (1 / 12);
const doremi = [0, 2, 4, 5, 7, 9, 11];
const sharp = [1, 3, 4, 6, 8, 10, 11];

// 音階を-12から36までの48段階分生成
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

  bpm: number;

  waveType: string = 'sine';

  gainEnvelope?: Envelope;

  lfo?: LFO;

  wave?: Wave;

  lowpassfilter?: LowPassFilter;

  volume: number = 0.2;

  scale: number = 1;

  constructor(_base: number, bpm: number) {
    this.notes = notesGenerator(_base);
    this.context = new AudioContext();
    this.bpm = bpm;
  }

  createLFO() {
    this.lfo = new LFO(this.context);
    return this.lfo;
  }

  createWave() {
    this.wave = new Wave(this.context);
    return this.wave;
  }

  createLowPassFilter() {
    this.lowpassfilter = new LowPassFilter(this.context);
    return this.lowpassfilter;
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

    if (this.wave) this.wave.setWave(oscillator);
    else oscillator.type = this.waveType;

    oscillator.frequency.value = this.notes(index) * this.scale;
    if (this.lfo) this.lfo.connectFrequency(oscillator.frequency);

    const gain = this.context.createGain();
    if (this.gainEnvelope) {
      this.gainEnvelope.setEnvelope(
        gain.gain,
        this.context.currentTime,
        (60000 / this.bpm) * length,
      );
    } else gain.gain.value = 1;

    const masterGain = this.context.createGain();
    masterGain.gain.value = this.volume;

    oscillator.connect(gain);
    gain.connect(masterGain);
    if (this.lowpassfilter) {
      gain.connect(this.lowpassfilter.filter);
      this.lowpassfilter.connect(masterGain, (60000 / this.bpm) * length);
    } else gain.connect(masterGain);
    masterGain.connect(this.context.destination);

    oscillator.start(0);
    return new Promise((resolve) => {
      setTimeout(() => {
        oscillator.stop(0);
        resolve();
      }, (60000 / this.bpm) * length);
    });
  }
}
