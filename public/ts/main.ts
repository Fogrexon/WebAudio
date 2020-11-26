/* eslint-disable array-callback-return */
import Instrument from './instruments/instrument';
import { range } from './utils';

const inst = new Instrument(261.626, 120);
inst.volume = 0.2;

document.getElementById('button').addEventListener('click', () => {
  let chain = inst.play(-7, 0);
  range(-7, 14).map((index) => {
    chain = chain.then(() => inst.play(index, 1));
  });
});
