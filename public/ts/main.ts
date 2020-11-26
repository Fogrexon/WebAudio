/* eslint-disable array-callback-return */
import Instrument from './instruments/instrument';
import * as musicData from './music';

const inst = new Instrument(261.626, 120);
inst.volume = 0.2;

document.getElementById('button').addEventListener('click', () => {
  let chain = new Promise((resolve) => {
    setTimeout(() => resolve());
  });
  musicData.notes.map((_, index) => {
    chain = chain.then(() => inst.play(musicData.notes[index], musicData.length[index]));
  });
});
