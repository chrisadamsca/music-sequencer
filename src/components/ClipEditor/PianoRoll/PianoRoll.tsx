import { useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import { Note, ScheduledNotes } from '../../../lib/Note/Note';
import { useStore } from '../../../state/AppStore';
import './PianoRoll.scss';


// Todo: 
// [ ] Multiple notes per 16th
// [ ] On resize end / On drag end: update note values

const PianoRoll = ({width, notes}: {
  width: number,
  notes: Note[]
}) => {

  const rollEl = useRef<HTMLDivElement>(null);
  const scrollEl = useRef<HTMLDivElement>(null);

  const selectedMidiClip = useStore((state) => state.selectedMidiClip);
  const setSelectedMidiClip = useStore((state) => state.setSelectedMidiClip)

  const [grid, setGrid] = useState<number>(0);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [writtenNotes, setWrittenNotes] = useState<ScheduledNotes>({})

  useEffect(() => {
    const handleResize = () => {
      updateGridSize();
    }
    window.addEventListener('resize', handleResize)
  });

  useEffect(() => {
    if (selectedMidiClip) {
      setWrittenNotes(selectedMidiClip.notes);
      if (scrollEl?.current) {
        scrollEl.current.scrollTop = scrollEl.current.scrollHeight / 2.3;
      }
    }
  }, [selectedMidiClip])

  useEffect(() => {
    if (selectedMidiClip) {
      selectedMidiClip.notes = writtenNotes;
      setSelectedMidiClip(selectedMidiClip);
    }
  }, [writtenNotes])

  useEffect(() => {
    updateGridSize();
  }, [rollEl])

  const updateGridSize = () => {
    if (rollEl && rollEl.current && selectedMidiClip) {
      setGrid(rollEl.current.offsetWidth / (16 * selectedMidiClip.length));
    }
  }

  const getYPos = (note: Note) => {
    const yPos = notes.findIndex(nthNote => nthNote.name === note.name) * 24;
    return yPos;
  }
  
  const getXPos = (at16th: string) => {
    return parseInt(at16th) * grid;
  }

  const getWidth = (note: Note) => {
    return note.length * grid;
  }

  const onRollKeyClick = (note: Note, event) => {
    if (event.detail === 2) {
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const at16th = Math.floor(x / grid);
      const newNote = new Note(note.name, 1);
      
      const notesAt16th = !writtenNotes[at16th] ? [] : writtenNotes[at16th];
      notesAt16th.push(newNote);

      setWrittenNotes({
        ...writtenNotes,
        [at16th]: notesAt16th
      })
      
    }
  }

  const onResizeStop = (at16th: number, note: Note, ref) => {
    const width = ref.offsetWidth;
    const noteLength = Math.round(width / grid);

    const notesAt16th = writtenNotes[at16th].filter(writtenNote => writtenNote !== note);
    note.length = noteLength;
    notesAt16th.push(note);

    setWrittenNotes({
      ...writtenNotes,
      [at16th]: notesAt16th
    })
  }

  const onDragStop = (beforeAt16th: number, note: Note, {x, y}) => {

    const noteAfterAt16th = Math.round(x / grid);
    const notesBeforeAt16th = writtenNotes[beforeAt16th].filter(writtenNote => writtenNote !== note);
    if (!notesBeforeAt16th || !notesBeforeAt16th.length) {
      delete writtenNotes[beforeAt16th];
    }
    const notesAfterAt16th = !writtenNotes[noteAfterAt16th] ? [] : writtenNotes[noteAfterAt16th];
    notesAfterAt16th.push(note);

    setWrittenNotes({
      ...writtenNotes,
      [beforeAt16th]: notesBeforeAt16th,
      [noteAfterAt16th]: notesAfterAt16th
    })
  }

  const onNoteClick = (at16th: number, note: Note, event) => {
    if (event.detail === 2) {
      const filteredNotesAt16th = writtenNotes[at16th].filter(writtenNote => writtenNote.uuid !== note.uuid);
      if (!filteredNotesAt16th || !filteredNotesAt16th.length) {
        delete writtenNotes[at16th];
      }
      setWrittenNotes({
        ...writtenNotes,
        [at16th]: filteredNotesAt16th
      })
    } else {
      setSelectedNote(note);
    }
  }

  const backgroundGridSize = () => {
    if (!selectedMidiClip) {
      return 100 / 16;
    }
    return 100 / (16 * selectedMidiClip.length);
  }

  return (
    <div className='piano-roll' ref={scrollEl}>
      <div className='keyboard'
        style={{width: `${width}rem`}}>
          {notes.map((note, index) => (
            <div key={'piano-key-' + index} className={'piano-key ' + (note.name.includes('#') ? 'black-key' : 'white-key')}>
              {note.name}
            </div>
          ))}
      </div>
      <div className='roll'
        style={{
          width: `calc(100% - ${width}rem)`
        }}
        ref={rollEl}>
          {notes.map((note, index) => (
            <div key={'roll-key-' + index} className={'roll-key ' + (note.name.includes('#') ? 'black-key' : 'white-key')}
              onClick={(event) => onRollKeyClick(note, event)}
              style={{
                backgroundSize: `${(backgroundGridSize())}%`
              }}></div>
          ))}
          {
            Object.keys(writtenNotes).map((at16th, index) => {
              return writtenNotes[at16th].map((note, index) => (
                grid && <Rnd
                  key={`rnd-${at16th}-${index}`}
                  dragAxis='x'
                  dragGrid={[grid, 0]}
                  resizeGrid={[grid, 0]}
                  bounds='parent'
                  minWidth={grid}
                  position={{
                    x: getXPos(at16th),
                    y: getYPos(note)
                  }}
                  size={{
                    width: getWidth(note),
                    height: '1.5rem'
                  }}
                  enableResizing={{
                    right:true, 
                    left:true, 
                    top:false, 
                    bottom:false, 
                    topRight:false, 
                    bottomRight:false, 
                    bottomLeft:false, 
                    topLeft:false
                  }}
                  onClick={(event) => onNoteClick(Number(at16th), note, event)}
                  onResizeStop={(event, direction, ref) => onResizeStop(Number(at16th), note, ref)}
                  onDragStop={(event, pos) => onDragStop(Number(at16th), note, pos)}>
                  <div className={'note ' + (selectedNote?.uuid === note.uuid ? 'selected' : '')} key={`note-${index}`} ></div>
                </Rnd>
              ))  
            })

          }
      </div>
    </div>
  )

}

export default PianoRoll;