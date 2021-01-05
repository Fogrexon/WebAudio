/* eslint-disable array-callback-return */
import Leap from 'leapjs';
import Envelope from './instruments/Envelope';
import Instrument from './instruments/Instrument';
import * as musicData from './music';
import { Template as WaveTemplate } from './instruments/Wave';

const envelope = new Envelope();
envelope.setPoint('attack', { time: 0.001, value: 1 });
envelope.setPoint('decay', { time: 10, value: 1 });
envelope.setPoint('release', { time: 0.01, value: 1 });

const lpenvelope = new Envelope();
lpenvelope.setPoint('attack', { time: 1, value: 1000 });
lpenvelope.setPoint('decay', { time: 1, value: 100 });
lpenvelope.setPoint('release', { time: 0.01, value: 100 });

const inst = new Instrument(261.626, 120);
inst.gainEnvelope = envelope;

// const lfo = inst.createLFO();
// lfo.depth = 20;

const wave = inst.createWave();
wave.setHarmonics(WaveTemplate.TIMPANI);
// inst.waveType = 'sawtooth';

const lowpassfilter = inst.createLowPassFilter();
lowpassfilter.setFrequency(10);

document.getElementById('button').addEventListener('click', () => {
  // oscillator.start(0);
  let chain = new Promise((resolve) => {
    setTimeout(() => resolve());
  });
  inst.play(musicData.notes[0] - 7, 100);
  // musicData.notes.map((_, index) => {
  //   chain = chain.then(() => {
  //     // inst.waveType = 'sine'; // ['sine', 'square', 'sawtooth', 'triangle'][Math.floor(Math.random() * 4)];
  //     return inst.play(musicData.notes[index] - 7, musicData.length[index]);
  //   });
  // });
});
// document.getElementById('playback').addEventListener('mousemove', (e) => {
//   // oscillator.start(0);
//   lfo.setFreqency(e.target.value * 20);
// });
Leap.loop({}, (frame) => {
  if (frame.pointables.length == 0) return;
  inst.scale = frame.pointables[0].direction[1] + 1;
  // if (frame.hands.length === 0) return;
  // const hand1 = frame.hands[0];
  // envelope.setPoint('attack', { time: (hand1.palmPosition[1] - 100) * 0.005, value: 1 });
  // if (frame.hands.length === 1) return;
  // const hand2 = frame.hands[1];
  // envelope.setPoint('decay', { time: (hand2.palmPosition[1] - 100) * 0.005, value: 0.6 });
  // envelope.setPoint('attack', {time: hand1[0].palmPosition[2], value: 1});
});
