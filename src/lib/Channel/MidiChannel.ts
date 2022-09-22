import { Clip, SerializedClip } from "../Clip/Clip";
import { MidiClip, SerializedMidiClip } from "../Clip/MidiClip";
import { Instrument, SerializedInstrument } from "../Instrument/Instrument";
import { SerializedStandardSynth, StandardSynth } from "../Instrument/StandardSynth";
import { Note, ScheduledNotes } from "../Note/Note";
import { Channel, SerializedChannel } from "./Channel";

export class MidiChannel extends Channel {

  public instrument: StandardSynth | undefined;
  public clips: MidiClip[] = [];

  private notes: ScheduledNotes = {};

  constructor(audioContext: AudioContext, name: string) {
    super(audioContext, name);
    this.addInstrument(new StandardSynth(this.audioContext));
  }

  public scheduler(next16th: number, nextTickTime: number, timeValueOf16th: number): void {
    if (this.notes[next16th] && this.notes[next16th].length) {
      this.instrument?.scheduleSound(nextTickTime, this.notes[next16th], timeValueOf16th);
    }
  }

  public addInstrument(instrument: StandardSynth): void {
    this.instrument = instrument;
    instrument.connectGainNode(this.volume);
  }

  public setNotes(notes: ScheduledNotes): void {
    this.notes = notes;
  }

  public setClips(clips: MidiClip[]): void {
    this.clips = clips;
  }

  public loadFromData(channelData: SerializedMidiChannel) {
    
    if (channelData.clips && channelData.clips.length) {
      this.clips = channelData.clips.map(clipData=> {
        const clip = new MidiClip(clipData.start, clipData.name, clipData.length);
        clip.loadFromData(clipData);
        return clip;
      });
    }
    if (channelData.instrument && channelData.instrument.type === 'StandardSynth') {
      const loadedInstrument = new StandardSynth(this.audioContext);
      loadedInstrument.loadFromData((channelData.instrument as SerializedStandardSynth));
      this.addInstrument(loadedInstrument);
    }
  }

  public serialize(): SerializedMidiChannel {
    return {
      name: this.name,
      type: 'MidiChannel',
      clips: this.clips.map(clip => clip.serialize()),
      instrument: this.instrument?.serialize()
    };
  }

}

export interface SerializedMidiChannel extends SerializedChannel {
  clips: SerializedMidiClip[];
  instrument: SerializedInstrument | undefined;
}