/* eslint-disable array-callback-return */
import Envelope from './instruments/Envelope';
import Instrument from './instruments/Instrument';
import * as musicData from './music';
import { Template as WaveTemplate } from './instruments/Wave';

const envelope = new Envelope();
envelope.setPoint('attack', { time: 0.1, value: 1 });
envelope.setPoint('decay', { time: 0.6, value: 0 });
envelope.setPoint('release', { time: 1, value: 0 });

const inst = new Instrument(261.626, 120);
inst.gainEnvelope = envelope;

const lfo = inst.createLFO();
lfo.depth = 20;

const wave = inst.createWave();
wave.setHarmonics(WaveTemplate.TRUMPET);

document.getElementById('button').addEventListener('click', () => {
  // oscillator.start(0);
  let chain = new Promise((resolve) => {
    setTimeout(() => resolve());
  });
  musicData.notes.map((_, index) => {
    chain = chain.then(() => {
      inst.waveType = 'sine'; // ['sine', 'square', 'sawtooth', 'triangle'][Math.floor(Math.random() * 4)];
      return inst.play(musicData.notes[index] - 7, musicData.length[index]);
    });
  });
});
document.getElementById('playback').addEventListener('mousemove', (e) => {
  // oscillator.start(0);
  lfo.setFreqency(e.target.value * 20);
});
