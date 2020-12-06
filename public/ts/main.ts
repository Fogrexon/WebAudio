/* eslint-disable array-callback-return */
import Envelope from './instruments/envelope';
import Instrument from './instruments/instrument';
import * as musicData from './music';

const envelope = new Envelope(false);
envelope.addPoint(0, 1);
envelope.addPoint(0.1, 0);

const inst = new Instrument(261.626, 120, envelope);

document.getElementById('button').addEventListener('click', () => {
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
