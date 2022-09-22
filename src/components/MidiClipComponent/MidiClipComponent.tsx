import { useEffect, useRef, useState } from 'react';
import { Clip } from '../../lib/Clip/Clip';
import { MidiClip } from '../../lib/Clip/MidiClip';
import { frequencyLookup, getNotes, Note, ScheduledNotes } from '../../lib/Note/Note';
import { useStore } from '../../state/AppStore';
import './MidiClipComponent.scss';

interface NotePreview {
  length: number;
  noteIndex: number;
  at16th: number;
  lengthInPercent?: number;
  posXInPercent?: number;
  posYInPercent?: number;
  heightInPercent?: number;
}

const MidiClipComponent = ({ clip, onUpdate, selected, grid }: {
   clip: MidiClip, onUpdate: Function, selected?: boolean, grid: number
}) => {


  const [notePreviews, setNotePreviews] = useState<NotePreview[]>([])

  useEffect(() => {
    useStore.subscribe(state => {
      if (state && state.selectedMidiClip && state.selectedMidiClip.id === clip.id) {          
        updatePreviewNotes();
      }
    })
  }, []);

  useEffect(() => {
    updatePreviewNotes()
  }, [clip])

  const updatePreviewNotes = () => {
    const allNotes = getNotes();
    let lowestNote = 0;
    const notePs: NotePreview[] = [];

    Object.keys(clip.notes).forEach(at16th => {
      return clip.notes[at16th].forEach((note: Note) => {
        const noteIndex = allNotes.findIndex(foundNote => foundNote.name === note.name);
        lowestNote = noteIndex > lowestNote ? noteIndex : lowestNote;
        const notePreview =  {
          length: note.length,
          noteIndex,
          at16th: Number(at16th)
        }
        notePs.push(notePreview);
      })
    });
    const mappedNotePs = notePs.map((notePreview: NotePreview) => {
      const posYInPercent = (notePreview.noteIndex / lowestNote) * 100;
      const posXInPercent = (notePreview.at16th / (16 * clip.length)) * 100;
      const lengthInPercent = (notePreview.length / (16 * clip.length)) * 100
      const heightInPercent = 100 / allNotes.length;
      return {
        ...notePreview,
        posYInPercent,
        posXInPercent,
        lengthInPercent,
        heightInPercent
      }
    });

    setNotePreviews(mappedNotePs);
  }
  

  return (
    <div className={'midi-clip ' + (selected ? 'selected' : '')}>
      <header className="midi-clip__header">{clip.name || clip.id}</header>
      <div className="midi-clip__body">
        <div className="midi-clip__body__inner">
          {notePreviews.map((notePreview, index) => {
            return (
            <div 
              key={`noteprev${index}`}
              className='midi-clip__note'
              style={{
                top: `${notePreview.posYInPercent}%`,
                left: `${notePreview.posXInPercent}%`,
                width: `${notePreview.lengthInPercent}%`
              }}></div>
          )})}
        </div>
      </div>
    </div>
  )

}

export default MidiClipComponent;