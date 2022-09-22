import { v4 as uuid } from 'uuid';
import { Note, ScheduledNotes } from '../Note/Note';
import { Clip, SerializedClip } from './Clip';

export class MidiClip extends Clip {
  
  public notes: ScheduledNotes = [];

  constructor(
    start: number,
    name: string,
    public length: number,
  ) {
    super(start, name);
  }

  public loadFromData(clipData: SerializedMidiClip) {
    Object.keys(clipData.notes).forEach(at16th => {
      if (clipData.notes[at16th] && clipData.notes[at16th].length) {
        const notesAt16th = clipData.notes[at16th].map(note => {
          return new Note(note.name, note.length);
        })
        this.notes[at16th] = notesAt16th;
      }
    })
  }

  public serialize(): SerializedMidiClip {
    return {
      name: this.name,
      start: this.start,
      length: this.length,
      notes: this.notes,
    }
  }
  
}

export interface SerializedMidiClip extends SerializedClip {
  notes: ScheduledNotes;
}