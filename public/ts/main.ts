const startSound = () => {
  const context = new AudioContext();

  const oscillator = context.createOscillator();

  window.setTimeout(() => {
    oscillator.stop(0);
  }, 60 * 1000);
  
  const gain = context.createGain();
  
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(0);
};

document.getElementById('button').addEventListener('click', startSound, false);
