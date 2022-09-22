import { v4 as uuid } from 'uuid';
import { Note, ScheduledNotes } from '../Note/Note';
import { Clip } from './Clip';

export class AudioClip extends Clip {

  public length: number = 1;

  public waveformData: number[] = [];

  constructor(
    public start: number,
    public name: string,
    public buffer: AudioBuffer
  ) {
    super(start, name);
    this.buffer = buffer;
    this.length = this.analyzeLength();
    this.waveformData = this.analyzeWaveform();
  }

  private analyzeLength(): number {
    const lengthIn16th = this.buffer.duration / core.clock.timeValueOf16th;
    return Math.floor(lengthIn16th / 16);
  }

  private analyzeWaveform(): number[] {
    const rawData = this.buffer.getChannelData(0);
    const sampleCount = 20 * this.length;
    const chunkSize = Math.floor(rawData.length / sampleCount);
    const waveformData: number[] = [];
    for (let i = 0; i < sampleCount; i++) {
      const chunkStart = chunkSize * i;
      let sum = 0;
      for (let j = 0; j < chunkSize; j++) {
        sum += Math.abs(rawData[chunkStart + j]);
      }
      waveformData.push(sum / chunkSize);
    }
    const normalizeValue = Math.pow(Math.max(...waveformData), -1);
    return waveformData.map(n => n * normalizeValue);
  }

  public loadFromData(clipData: SerializedAudioClip) {
    
  }

  public serialize(): SerializedAudioClip {
    return {
      name: this.name,
      start: this.start,
      length: this.length,
      waveformData: this.waveformData
    }
  }
  
}

export interface SerializedAudioClip {
  name: string;
  start: number;
  length: number;
  waveformData: number[];
}