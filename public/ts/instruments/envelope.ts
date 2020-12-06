import { range } from '../utils';

export interface EnvelopePoint {
  at: number
  gain: number
  isSustain: boolean
}

export default class Envelope {
  isSustain: boolean;

  points: EnvelopePoint[] = [];

  constructor(isSustain: boolean) {
    this.isSustain = isSustain;
  }

  addPoint(at: number, gain: number, isSustain?: boolean) {
    this.points.push(
      {
        at,
        gain,
        isSustain,
      },
    );
  }

  setEnvelope(gain: GainNode, current: number, time: number) {
    if (this.isSustain) {
      let index = 0;
      while (!this.points[index].isSustain) {
        gain.gain.setValueAtTime(this.points[index].gain, current + this.points[index].at);
        index += 1;
      }
      gain.gain.setValueAtTime(this.points[index].gain, current + this.points[index].at);
      index = this.points.length - 1;
      const base = this.points[index].at;
      while (!this.points[index].isSustain) {
        gain.gain.setValueAtTime(
          this.points[index].gain,
          current + time - (base - this.points[index].at),
        );
        index -= 1;
      }
      gain.gain.setValueAtTime(
        this.points[index].gain,
        current + time - (base - this.points[index].at),
      );
    } else {
      this.points.map((point) => gain.gain.setValueAtTime(point.gain, current + point.at));
    }
  }
}
