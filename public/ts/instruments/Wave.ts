export const Template = {
  PIANO: [0, 0.631, 0.167, 0.104, 0.026, 0.036, 0, 0.035],
  TIMPANI: [
    0, 0, 0.012, 0.190, 0.014, 0.260, 0.108, 0.089, 0.062, 0.016,
    0.026, 0.000, 0.022, 0.010, 0.046, 0.052, 0.051, 0.020, 0.021,
  ],
  TRUMPET: [
    0, 0.18, 0.31, 0.35, 0.06, 0.1,
  ],
};

export default class Wave {
  context: AudioContext;

  real: Float32Array;

  imaginary: Float32Array;

  waveTable: PeriodicWave;

  constructor(context: AudioContext) {
    this.context = context;
    this.imaginary = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0]);
  }

  // 倍音指定(imaginaryはとりあえず0)
  setHarmonics(lis: number[]) {
    this.real = new Float32Array(lis);
    this.imaginary = new Float32Array(lis.map(() => 0));
    this.waveTable = this.context.createPeriodicWave(this.real, this.imaginary);
  }

  // オシレーターに波形をセット
  setWave(oscillator: OscillatorNode) {
    oscillator.setPeriodicWave(this.waveTable);
  }
}
