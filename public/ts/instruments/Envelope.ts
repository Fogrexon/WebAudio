const EPSILON = 10 ** -10;

// Envelopeの点
export interface EnvelopePoint {
  time: number // 継続時間
  value: number // 値
}

type ADSR = {
  attack: EnvelopePoint,
  decay: EnvelopePoint,
  release: EnvelopePoint,
}

// ADRの順に並べたときにtimeの時の値
const sequenceValue = (model: ADSR, time: number) => {
  if (time < 0) return 0;
  if (time < model.attack.time) return model.attack.value * (time / model.attack.time);
  if (time < model.attack.time + model.decay.time) {
    const a = (time - model.attack.time) - model.decay.time;
    return model.attack.value * (1 - a) + model.decay.value * a;
  }
  if (time < model.attack.time + model.decay.time + model.release.time) {
    const a = (time - model.attack.time - model.decay.time) - model.release.time;
    return model.decay.value * (1 - a) + model.release.value * a;
  }
  return 0;
};

type ADSRType = 'attack' | 'decay' | 'sustain' | 'release';

export default class Envelope {
  ADSR: ADSR = {
    attack: { time: 0.02, value: 1 },
    decay: { time: 0.02, value: 0.6 },
    release: { time: 0.02, value: 0 },
  };

  setPoint(type: ADSRType, point: EnvelopePoint): void {
    this.ADSR[type] = point;
  }

  setEnvelope(params: AudioParam, current: number, time: number): void {
    params.setValueAtTime(0, current);

    if (time < this.ADSR.attack.time) {
      // アタック途中でリリース
      params.linearRampToValueAtTime(
        sequenceValue(this.ADSR, time),
        current + time,
      );
      params.setValueAtTime(
        this.ADSR.release.value,
        current + time + EPSILON,
      );
      params.linearRampToValueAtTime(0, current + time + this.ADSR.release.time);
      return;
    }

    params.linearRampToValueAtTime(this.ADSR.attack.value, current + this.ADSR.attack.time);

    if (time < this.ADSR.attack.time + this.ADSR.decay.time) {
      // ディケイ途中でリリース
      params.linearRampToValueAtTime(
        sequenceValue(this.ADSR, time),
        current + time,
      );
      params.setValueAtTime(
        this.ADSR.release.value,
        current + time + EPSILON,
      );
      params.linearRampToValueAtTime(0, current + time + this.ADSR.release.time);
    }

    params.linearRampToValueAtTime(
      this.ADSR.decay.value,
      current + this.ADSR.attack.time + this.ADSR.decay.time,
    );
    params.linearRampToValueAtTime(
      this.ADSR.decay.value,
      current + time,
    );
    params.linearRampToValueAtTime(0, current + time + this.ADSR.release.time);
  }
}
