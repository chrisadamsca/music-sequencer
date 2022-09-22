import { Core } from "../Core";
import { Metronome } from "./Metronome";


export type TimeSignature = [number, number];

export class Clock {

  public readonly metronome: Metronome;
  
  private audioContext: AudioContext;
  
  public tempo: number;
  private timeSignature: TimeSignature;
  
  private timeOut: number | undefined = undefined;
  private futureTickTime: number = 0;

  public timeValueOf16th: number = 0;
  private readonly numberOf16thInBar: number
  
  private _currentBar = 1;
  public get currentBar() : number {
    return this._currentBar;
  }

  private _next16th = 0;
  public get next16th() : number {
    return this._next16th;
  }

  public get time() : number {
    return this.audioContext.currentTime;
  }

  constructor(audioContext: AudioContext, tempo: number = 120.0, timeSignature: TimeSignature = [4, 4]) {
    this.audioContext = audioContext;
    this.futureTickTime = this.audioContext.currentTime;
    this.tempo = tempo;
    this.timeSignature = timeSignature;
    this.numberOf16thInBar = timeSignature[0] * timeSignature[0];

    this.updateTempoValues();

    this.metronome = new Metronome(this.audioContext);
  }
  
  private updateTempoValues(): void {
    const secondsPerBeat = 60.0 / this.tempo;
    this.timeValueOf16th = secondsPerBeat / this.timeSignature[1];
  }

  public start(): void {
    this.metronome.init();
    this.futureTickTime = this.audioContext.currentTime;
    this.scheduler();
  }

  public pause(): void {
    clearTimeout(this.timeOut);
  }

  public stop(): void {
    this._currentBar = 1;
    this._next16th = 0;
    clearTimeout(this.timeOut);
  }

  public setTempo(tempo: number): void {
    this.tempo = tempo;
    this.updateTempoValues();
  }

  public setTimeTo16th(timeAs16th: number): void {
    this._next16th = timeAs16th;
  }

  public startMetronome(): void {
    this.metronome.start();
  }
  
  public stopMetronome(): void {
    this.metronome.stop();
  }

  private scheduler(): void {
    if (this.futureTickTime < this.audioContext.currentTime + 0.01) {
      for (let i = 0; i < core.channels.length; i++) {
        const channel = core.channels[i];
        channel.scheduler(this.next16th, this.futureTickTime, this.timeValueOf16th);
      }
      if (this.next16th % 4 === 0) {
        if (this.next16th % 16 === 0) {
          this.metronome.setFrequency(880);
        } else {
          this.metronome.setFrequency(440);
        }
        this.metronome.playClick(this.futureTickTime);
      }
      this.nextTick();
    }
    this.timeOut = window.setTimeout(this.scheduler.bind(this), 0);
  }

  private nextTick(): void {
    if (this.next16th % this.numberOf16thInBar === 1) {
      this._currentBar++;
    }
    this._next16th += 1;
    this.futureTickTime += this.timeValueOf16th;
    
  }

}