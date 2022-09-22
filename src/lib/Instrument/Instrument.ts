import { v4 as uuid } from 'uuid';
import { Note } from '../Note/Note';

export abstract class Instrument {

  public readonly id: string;

  constructor(
    protected audioContext: AudioContext
  ) {
    this.id = uuid();
  }

  public abstract scheduleSound(time: number, notes: Note[], timeValueOf16th: number): void;

  public abstract serialize(): any;

  public abstract loadFromData(data: SerializedInstrument): void;

  public abstract connectGainNode(gainNode: GainNode): void;

}

export interface SerializedInstrument {
  type: 'StandardSynth';
}