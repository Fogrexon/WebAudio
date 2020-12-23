export default class LFO {
  frequency: number = 2;

  depth: number = 5;

  context: AudioContext;

  oscillator: OscillatorNode;

  gain: GainNode;

  constructor(context: AudioContext) {
    this.context = context;
    this.oscillator = this.context.createOscillator();
    this.oscillator.type = 'sine';
    this.gain = this.context.createGain();
    this.oscillator.connect(this.gain);
    this.oscillator.start(0);
  }

  setFreqency(freq: number) {
    this.frequency = freq;
    this.oscillator.frequency.value = this.frequency;
  }

  connectFrequency(oscillatorFreq: AudioParam) {
    this.oscillator.frequency.value = this.frequency;
    this.gain.gain.value = this.depth;
    this.gain.connect(oscillatorFreq);
  }
}