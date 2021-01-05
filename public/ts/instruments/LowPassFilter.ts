import Envelope from './Envelope';

export default class LowPassFilter {
  envelope: Envelope;

  context: AudioContext;

  filter: BiquadFilterNode;

  freq: number | Envelope;

  constructor(context: AudioContext) {
    this.context = context;
    this.filter = context.createBiquadFilter();
    this.filter.type = 'lowpass';
  }

  setFrequency(freq: number | Envelope) {
    this.freq = freq;
  }

  connect(destination: AudioNode, time: number) {
    this.filter.gain.setValueAtTime(10, this.context.currentTime);
    if (this.freq instanceof Envelope) {
      this.freq.setEnvelope(this.filter.frequency, this.context.currentTime, time);
    } else this.filter.frequency.setValueAtTime(this.freq, this.context.currentTime);
    this.filter.connect(destination);
  }
}
