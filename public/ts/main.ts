/* eslint-disable array-callback-return */
import Envelope from './instruments/envelope';
import Instrument from './instruments/instrument';
import * as musicData from './music';

const envelope = new Envelope();
envelope.setPoint('attack', { time: 0.04, value: 1 });
envelope.setPoint('decay', { time: 0.1, value: 0.6 });
envelope.setPoint('release', { time: 0.1, value: 0 });

const inst = new Instrument(261.626, 120);
inst.gainEnvelope = envelope;

document.getElementById('button').addEventListener('click', () => {
  // oscillator.start(0);
  let chain = new Promise((resolve) => {
    setTimeout(() => resolve());
  });
  musicData.notes.map((_, index) => {
    chain = chain.then(() => {
      inst.waveType = 'sawtooth'; // ['sine', 'square', 'sawtooth', 'triangle'][Math.floor(Math.random() * 4)];
      return inst.play(musicData.notes[index] - 7, musicData.length[index]);
    });
  });
});
document.getElementById('playback').addEventListener('change', (e) => {
  // oscillator.start(0);
  inst.volume = e.target.value * 1;
});
