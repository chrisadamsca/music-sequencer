import { Note } from "../Note/Note";

export class PolyphonicOscillator {

  private oscillatorBank: SingleOscillator[] = [];

  public oscillatorType: OscillatorType = 'sine';
  public detuneValue: number = 0;

  public volume: GainNode;

  constructor(
    audioContext: AudioContext,
    filterNode: BiquadFilterNode,
    voices: number
  ) {

    this.volume = audioContext.createGain();
    this.volume.connect(filterNode);
    this.volume.gain.value = 1;

    for (let voice = 0; voice < voices; voice++) {
      const volume = audioContext.createGain();
      volume.connect(this.volume);
      volume.gain.value = 0;

      const oscillatorNode = audioContext.createOscillator();
      oscillatorNode.connect(volume);
      oscillatorNode.start(audioContext.currentTime);

      this.oscillatorBank.push({
        oscillatorNode,
        volume
      });
    }
  }

  public scheduleSound(time: number, notes: Note[], timeValueOf16th: number): void {
    if (notes) {
      notes.forEach((note, index) => {
        this.oscillatorBank[index].oscillatorNode.frequency.setValueAtTime(note.frequency, time);
        // this.oscillatorBank[index].volume.gain.setValueCurveAtT  ime(new Float32Array([0, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0]), time, notes[0].length * timeValueOf16th);
        this.oscillatorBank[index].volume.gain.setValueAtTime(0.2, time);
        this.oscillatorBank[index].volume.gain.setValueAtTime(0, time +  (notes[0].length * timeValueOf16th));
      });
    }
  }

  public detune(value: number): void {
    this.detuneValue = value;
    this.oscillatorBank.forEach(singleOscillator => {
      singleOscillator.oscillatorNode.detune.value = this.detuneValue;
    });
  }

  public changeWaveform(value: any): void {
    this.oscillatorType = value;
    this.oscillatorBank.forEach(singleOscillator => {
      singleOscillator.oscillatorNode.type = this.oscillatorType;
    });
  }

  public setVolume(value: number): void {
    this.volume.gain.value = value;
  }

  public serialize(): SerializedPolyphonicOscillator {
    return {
      oscillatorType: this.oscillatorType,
      detuneValue: this.detuneValue,
      volume: this.volume.gain.value
    }
  }

  public loadFromData(data: SerializedPolyphonicOscillator): void {
    this.changeWaveform(data.oscillatorType);
    this.detune(data.detuneValue);
    this.volume.gain.value = data.volume;
  }

}

interface SingleOscillator {
  oscillatorNode: OscillatorNode;
  volume: GainNode;
}

export interface SerializedPolyphonicOscillator {
  oscillatorType: OscillatorType;
  detuneValue: number;
  volume: number;
}