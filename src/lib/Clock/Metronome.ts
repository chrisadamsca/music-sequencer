export class Metronome {


  private isInitialized: boolean = false;

  private audioContext: AudioContext;

  private osc: OscillatorNode;
  private volume: GainNode;

  private isPlaying: boolean = false;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.osc = audioContext.createOscillator();
    this.volume = audioContext.createGain();
    this.osc.connect(this.volume);
    this.volume.connect(audioContext.destination);
    this.volume.gain.value = 0;
    this.osc.frequency.value = 440;
  }

  public init(): void {
    if (!this.isInitialized) {
      this.osc.start(this.audioContext.currentTime);
      this.isInitialized = true;
    }
  }

  public start(): void {
    this.isPlaying = true;
  }
  
  public stop(): void {
    this.isPlaying = false;
  }

  public playClick(time: number): void {
    if (this.isPlaying) {
      this.volume.gain.setValueAtTime(0.1, time);
      this.volume.gain.setValueAtTime(0, time + 0.05);
    }
  }

  public setFrequency(value: number): void {
    this.osc.frequency.value = value;
  }

}