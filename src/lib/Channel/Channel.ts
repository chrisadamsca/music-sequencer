import { v4 as uuid } from 'uuid';
export abstract class Channel {

  public id: string;
  public volume: GainNode;

  constructor(
    protected audioContext: AudioContext,
    public name: string
  ) {
    this.id = uuid();
    this.volume = audioContext.createGain();
    this.volume.connect(core.masterVolume);
    this.volume.gain.value = 1;
  }

  public abstract scheduler(currenTime: number, nextTickTime: number, timeValueOf16th: number): void;

  public abstract serialize(): SerializedChannel;

  public abstract loadFromData(data: SerializedChannel): void;

  public setVolume(value: number): void {
    this.volume.gain.value = value;
  }
  
}

export interface SerializedChannel {
  name: string;
  type: 'MidiChannel' | 'AudioChannel';
}