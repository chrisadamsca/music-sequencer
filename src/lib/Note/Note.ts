import { v4 as uuid } from 'uuid';

export class Note {

  public frequency: number;
  public uuid: string;

  constructor(
    public name: NoteName,
    public length: number
  ) {
    this.frequency = frequencyLookup[name];
    this.uuid = uuid();
  }

  public serialize(): SerializedNote {
    return {
      name: this.name,
      length: this.length
    }
  }

}
export interface SerializedNote {
  name: NoteName;
  length: number;
}

export type ScheduledNotes = {[key: number]: Note[]};

export type NoteName = 'C0' | 'C#0' | 'Db0' | 'D0' | 'D#0' | 'Eb0' | 'E0' | 'F0' | 'F#0' | 'Gb0' | 'G0' | 'G#0' | 'Ab0' | 'A0' | 'A#0' | 'Bb0' | 'B0' | 'C1' | 'C#1' | 'Db1' | 'D1' | 'D#1' | 'Eb1' | 'E1' | 'F1' | 'F#1' | 'Gb1' | 'G1' | 'G#1' | 'Ab1' | 'A1' | 'A#1' | 'Bb1' | 'B1' | 'C2' | 'C#2' | 'Db2' | 'D2' | 'D#2' | 'Eb2' | 'E2' | 'F2' | 'F#2' | 'Gb2' | 'G2' | 'G#2' | 'Ab2' | 'A2' | 'A#2' | 'Bb2' | 'B2' | 'C3' | 'C#3' | 'Db3' | 'D3' | 'D#3' | 'Eb3' | 'E3' | 'F3' | 'F#3' | 'Gb3' | 'G3' | 'G#3' | 'Ab3' | 'A3' | 'A#3' | 'Bb3' | 'B3' | 'C4' | 'C#4' | 'Db4' | 'D4' | 'D#4' | 'Eb4' | 'E4' | 'F4' | 'F#4' | 'Gb4' | 'G4' | 'G#4' | 'Ab4' | 'A4' | 'A#4' | 'Bb4' | 'B4' | 'C5' | 'C#5' | 'Db5' | 'D5' | 'D#5' | 'Eb5' | 'E5' | 'F5' | 'F#5' | 'Gb5' | 'G5' | 'G#5' | 'Ab5' | 'A5' | 'A#5' | 'Bb5' | 'B5' | 'C6' | 'C#6' | 'Db6' | 'D6' | 'D#6' | 'Eb6' | 'E6' | 'F6' | 'F#6' | 'Gb6' | 'G6' | 'G#6' | 'Ab6' | 'A6' | 'A#6' | 'Bb6' | 'B6' | 'C7' | 'C#7' | 'Db7' | 'D7' | 'D#7' | 'Eb7' | 'E7' | 'F7' | 'F#7' | 'Gb7' | 'G7' | 'G#7' | 'Ab7' | 'A7' | 'A#7' | 'Bb7' | 'B7' | 'C8' | 'C#8' | 'Db8' | 'D8' | 'D#8' | 'Eb8' | 'E8' | 'F8' | 'F#8' | 'Gb8' | 'G8' | 'G#8' | 'Ab8' | 'A8' | 'A#8' | 'Bb8' | 'B8';
export const frequencyLookup = {
  'C0': 16.35,
  'C#0': 17.32,
  'Db0': 17.32,
  'D0': 18.35,
  'D#0': 19.45,
  'Eb0': 19.45,
  'E0': 20.60,
  'F0': 21.83,
  'F#0': 23.12,
  'Gb0': 23.12,
  'G0': 24.50,
  'G#0': 25.96,
  'Ab0': 25.96,
  'A0': 27.50,
  'A#0': 29.14,
  'Bb0': 29.14,
  'B0': 30.87,
  'C1': 32.70,
  'C#1': 34.65,
  'Db1': 34.65,
  'D1': 36.71,
  'D#1': 38.89,
  'Eb1': 38.89,
  'E1': 41.20,
  'F1': 43.65,
  'F#1': 46.25,
  'Gb1': 46.25,
  'G1': 49.00,
  'G#1': 51.91,
  'Ab1': 51.91,
  'A1': 55.00,
  'A#1': 58.27,
  'Bb1': 58.27,
  'B1': 61.74,
  'C2': 65.41,
  'C#2': 69.30,
  'Db2': 69.30,
  'D2': 73.42,
  'D#2': 77.78,
  'Eb2': 77.78,
  'E2': 82.41,
  'F2': 87.31,
  'F#2': 92.50,
  'Gb2': 92.50,
  'G2': 98.00,
  'G#2': 103.83,
  'Ab2': 103.83,
  'A2': 110.00,
  'A#2': 116.54,
  'Bb2': 116.54,
  'B2': 123.47,
  'C3': 130.81,
  'C#3': 138.59,
  'Db3': 138.59,
  'D3': 146.83,
  'D#3': 155.56,
  'Eb3': 155.56,
  'E3': 164.81,
  'F3': 174.61,
  'F#3': 185.00,
  'Gb3': 185.00,
  'G3': 196.00,
  'G#3': 207.65,
  'Ab3': 207.65,
  'A3': 220.00,
  'A#3': 233.08,
  'Bb3': 233.08,
  'B3': 246.94,
  'C4': 261.63,
  'C#4': 277.18,
  'Db4': 277.18,
  'D4': 293.66,
  'D#4': 311.13,
  'Eb4': 311.13,
  'E4': 329.63,
  'F4': 349.23,
  'F#4': 369.99,
  'Gb4': 369.99,
  'G4': 392.00,
  'G#4': 415.30,
  'Ab4': 415.30,
  'A4': 440.00,
  'A#4': 466.16,
  'Bb4': 466.16,
  'B4': 493.88,
  'C5': 523.25,
  'C#5': 554.37,
  'Db5': 554.37,
  'D5': 587.33,
  'D#5': 622.25,
  'Eb5': 622.25,
  'E5': 659.25,
  'F5': 698.46,
  'F#5': 739.99,
  'Gb5': 739.99,
  'G5': 783.99,
  'G#5': 830.61,
  'Ab5': 830.61,
  'A5': 880.00,
  'A#5': 932.33,
  'Bb5': 932.33,
  'B5': 987.77,
  'C6': 1046.50,
  'C#6': 1108.73,
  'Db6': 1108.73,
  'D6': 1174.66,
  'D#6': 1244.51,
  'Eb6': 1244.51,
  'E6': 1318.51,
  'F6': 1396.91,
  'F#6': 1479.98,
  'Gb6': 1479.98,
  'G6': 1567.98,
  'G#6': 1661.22,
  'Ab6': 1661.22,
  'A6': 1760.00,
  'A#6': 1864.66,
  'Bb6': 1864.66,
  'B6': 1975.53,
  'C7': 2093.00,
  'C#7': 2217.46,
  'Db7': 2217.46,
  'D7': 2349.32,
  'D#7': 2489.02,
  'Eb7': 2489.02,
  'E7': 2637.02,
  'F7': 2793.83,
  'F#7': 2959.96,
  'Gb7': 2959.96,
  'G7': 3135.96,
  'G#7': 3322.44,
  'Ab7': 3322.44,
  'A7': 3520.00,
  'A#7': 3729.31,
  'Bb7': 3729.31,
  'B7': 3951.07,
  'C8': 4186.01,
  'C#8': 4434.92,
  'Db8': 4434.92,
  'D8': 4698.63,
  'D#8': 4978.03,
  'Eb8': 4978.03,
  'E8': 5274.04,
  'F8': 5587.65,
  'F#8': 5919.91,
  'Gb8': 5919.91,
  'G8': 6271.93,
  'G#8': 6644.88,
  'Ab8': 6644.88,
  'A8': 7040.00,
  'A#8': 7458.62,
  'Bb8': 7458.62,
  'B8': 7902.13
}
export const midiNoteLookup = {
  119:	'B8',
  118:	'A#8',
  117:	'A8',
  116:	'G#8',
  115:	'G8',
  114:	'F#8',
  113:	'F8',
  112:	'E8',
  111:	'D#8',
  110:	'D8',
  109:	'C#8',
  108:	'C8',
  107:	'B7',
  106:	'A#7',
  105:	'A7',
  104:	'G#7',
  103:	'G7',
  102:	'F#7',
  101:	'F7',
  100:	'E7',
  99:	'D#7',
  98:	'D7',
  97:	'C#7',
  96:	'C7',
  95:	'B6',
  94:	'A#6',
  93:	'A6',
  92:	'G#6',
  91:	'G6',
  90:	'F#6',
  89:	'F6',
  88:	'E6',
  87:	'D#6',
  86:	'D6',
  85:	'C#6',
  84:	'C6',
  83:	'B5',
  82:	'A#5',
  81:	'A5',
  80:	'G#5',
  79:	'G5',
  78:	'F#5',
  77:	'F5',
  76:	'E5',
  75:	'D#5',
  74:	'D5',
  73:	'C#5',
  72:	'C5',
  71:	'B4',
  70:	'A#4',
  69:	'A4',
  68:	'G#4',
  67:	'G4',
  66:	'F#4',
  65:	'F4',
  64:	'E4',
  63:	'D#4',
  62:	'D4',
  61:	'C#4',
  60:	'C4',
  59:	'B3',
  58:	'A#3',
  57:	'A3',
  56:	'G#3',
  55:	'G3',
  54:	'F#3',
  53:	'F3',
  52:	'E3',
  51:	'D#3',
  50:	'D3',
  49:	'C#3',
  48:	'C3',
  47:	'B2',
  46:	'A#2',
  45:	'A2',
  44:	'G#2',
  43:	'G2',
  42:	'F#2',
  41:	'F2',
  40:	'E2',
  39:	'D#2',
  38:	'D2',
  37:	'C#2',
  36:	'C2',
  35:	'B1',
  34:	'A#1',
  33:	'A1',
  32:	'G#1',
  31:	'G1',
  30:	'F#1',
  29:	'F1',
  28:	'E1',
  27:	'D#1',
  26:	'D1',
  25:	'C#1',
  24:	'C1',
  23:	'B0',
  22:	'A#0',
  21:	'A0',
}
const notes = [
  'B',
  'A#',
  'A',
  'G#',
  'G',
  'F#',
  'F',
  'E',
  'D#',
  'D',
  'C#',
  'C',
]

export const getNoteNameFromMidiValue = (midi: any): NoteName => {
  return midiNoteLookup[midi];
}

export const getNotes = () => {

  const allNotes: NoteName[] = [];

  [8, 7, 6, 5, 4, 3, 2, 1, 0].forEach((octave) => {
    const mappedNoteNames: NoteName[] = notes.map(name => (name + octave) as NoteName);
    allNotes.push(...mappedNoteNames);
  });

  return allNotes.map(name => {
    return new Note(name, 1);
  });

}