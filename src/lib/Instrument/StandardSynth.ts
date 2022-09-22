import { Note } from "../Note/Note";
import { Instrument, SerializedInstrument } from "./Instrument";
import { PolyphonicOscillator, SerializedPolyphonicOscillator } from "./PolyphonicOscillator";

export class StandardSynth extends Instrument {

  public oscillators: PolyphonicOscillator[];

  public filter: BiquadFilterNode;
  
  private volume: GainNode;

  constructor(audioContext: AudioContext) { 
    super(audioContext);

    this.volume = audioContext.createGain();
    this.volume.gain.value = 1;

    this.filter = audioContext.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 22_000;
    this.filter.connect(this.volume);    

    this.oscillators = [
      new PolyphonicOscillator(audioContext, this.filter, 4),
      new PolyphonicOscillator(audioContext, this.filter, 4),
    ]


  }

  public connectGainNode(gainNode: GainNode): void {
    this.volume.connect(gainNode);
  };

  public scheduleSound(time: number, notes: Note[], timeValueOf16th: number): void {
    this.oscillators.forEach(oscillator => {
      oscillator.scheduleSound(time, notes, timeValueOf16th);
    });
  }

  public detune(value: number, index: number): void {
    this.oscillators[index].detune(value);
  }

  public changeWaveform(value: any, index: number): void {
    this.oscillators[index].changeWaveform(value);
  }

  public setOscillatorVolume(index: number, value: number): void {
    this.oscillators[index].setVolume(value);
  }

  public setFilterValue(value: number): void {
    this.filter.frequency.value = value;
  }

  public setFilterQ(value: number): void {
    this.filter.Q.value = value;
  }

  public loadFromData(instrumentData: SerializedStandardSynth) {
    this.oscillators = instrumentData.oscillators.map(polyphonicOscillatorData => {
      const polyphonicOscillator = new PolyphonicOscillator(this.audioContext, this.filter, 4);
      polyphonicOscillator.loadFromData(polyphonicOscillatorData);
      return polyphonicOscillator;
    });
    this.filter.frequency.value = instrumentData.filter.frequency;
  }

  public serialize(): SerializedStandardSynth {
    return {
      type: 'StandardSynth',
      oscillators: this.oscillators.map(polyphonicOscillator => {
        return polyphonicOscillator.serialize();
      }),
      filter: {
        frequency: this.filter.frequency.value
      }
    }
  }

}

export interface SerializedStandardSynth extends SerializedInstrument {
  oscillators: SerializedPolyphonicOscillator[];
  filter: {
    frequency: number
  }
}