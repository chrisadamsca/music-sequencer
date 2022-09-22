import { useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import './MidiChannelComponent.scss';
import { useStore } from '../../state/AppStore';
import { getNoteNameFromMidiValue, Note, NoteName, ScheduledNotes } from '../../lib/Note/Note';
import { MidiChannel } from '../../lib/Channel/MidiChannel';
import MidiClipComponent from '../MidiClipComponent/MidiClipComponent';
import { MidiClip } from '../../lib/Clip/MidiClip';
import { Midi } from '@tonejs/midi'

const MidiChannelComponent = ({ channel, grid, onDelete }: {
    channel: MidiChannel,
    grid: number,
    onDelete: Function
  }) => {

  const setSelectedChannel = useStore((state) => state.setSelectedChannel)
  const selectedChannel = useStore((state) => state.selectedChannel)
  
  const [clips, setClips] = useState<MidiClip[]>([]);
  const clipsRef = useRef<MidiClip[]>([]);
  clipsRef.current = clips;
    
  const setSelectedMidiClip = useStore((state) => state.setSelectedMidiClip)
  const selectedMidiClip = useStore((state) => state.selectedMidiClip)
  const selectedMidiClipRef = useRef<MidiClip | null>();
  selectedMidiClipRef.current = (selectedMidiClip as MidiClip);

  useEffect(() => {
    setClips(channel.clips);
    
    useStore.subscribe(state => {
      const selectedMidiClip = state.selectedMidiClip;
      if (state && selectedMidiClip && clipsRef.current?.find(clip => clip.id === selectedMidiClip!.id)) {          
        combineAndUpdateAllNotes(clipsRef.current);
      }
    });    

    document.addEventListener('keydown', async (event: KeyboardEvent) => {
      if (event.code === 'KeyD') {  
        const clipToDuplicate = selectedMidiClipRef.current;
        if (!clipToDuplicate || !clipsRef.current) {
          return;
        }
        if (clipsRef.current.find(clip => clip.id === clipToDuplicate.id)) {
          const start = clipToDuplicate.start + (clipToDuplicate.length * 16);
          const duplicate = new MidiClip(0, `Clip ${clipsRef.current.length + 1}`, clipToDuplicate.length);
          const serializedOriginal = await clipToDuplicate.serialize();
          duplicate.loadFromData(serializedOriginal);
          duplicate.setStart(start);
          setSelectedMidiClip(duplicate);          
          setClips([
            ...clipsRef.current,
            duplicate
          ])
        }
      }
    });

  }, []);

  useEffect(() => {
    setClips(channel.clips);
  }, [channel])

  useEffect(() => {
    core.updateChannelClips(channel, clips);
    combineAndUpdateAllNotes(clipsRef.current);
  }, [clips]);

  const combineAndUpdateAllNotes = (clips: MidiClip[]): void => {
    const allNotes: ScheduledNotes = {};
    clips.forEach(clip => {
      Object.keys(clip.notes).forEach(at16th => {
        allNotes[Number(clip.start) + Number(at16th)] = [...clip.notes[at16th]];
      });
    });
    core.updateChannelNotes(channel, allNotes);
  }
  
  const onClipUpdate = (index: number, pos: number): void => {
    setClips(prevClips => {
      prevClips[index].start = pos;
      return  [...prevClips];
    })
  }

  const onResizeStop = (event: any, updatedClip: MidiClip, ref) => {
    const width = ref.offsetWidth;
    const clipLength = Math.round(width / grid) / 4;
    const updatedClips = clips.map(clip => {
      if (updatedClip.id === clip.id) {
        clip.length = clipLength;
      }
      return clip;
    });
    setClips([
      ...updatedClips
    ])
  }
  
  const onDragStop = (clip: MidiClip, {x, y}) => {
    const start = Math.round(x / grid);
    clip.start = start * 4;
    
    const updatedClips = clips.filter(oldClip => oldClip.id !== clip.id);
    updatedClips.push(clip);
    setClips(updatedClips);
    combineAndUpdateAllNotes(updatedClips)
  }

  const getPosOnTimeline = (startAt16th) => {
    return startAt16th * (grid / 4);
  }
  
  const onChannelStripClick = (event) => {
    const pos = event.clientX - 32;
    const at16th = (pos / grid) * 4;
    const atQuarter = Math.floor(at16th / 4) * 4;
    core.clock.setTimeTo16th(atQuarter);
    setSelectedMidiClip(null);
  }
  
  const onChannelStripDoubleClick = (event) => {
    const pos = event.clientX - 32;
    const at16th = pos / grid * 4;
    const atQuarter = Math.floor(at16th / 4) * 4;
    const newClip = new MidiClip(atQuarter, `Clip ${clips.length + 1}`, 1)
    setClips([
      ...clips,
      newClip
    ]);
    setSelectedMidiClip(newClip);
  }

  const onClipClick = (clip: MidiClip, event?: MouseEvent | TouchEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setSelectedMidiClip(clip);
    setSelectedChannel(channel)
  }

  const onClipDoubleClick = (event: MouseEvent | TouchEvent, clipToDelete: MidiClip) => {
    event.stopPropagation();
    const updatedClips = clips.filter(clip => clip.id !== clipToDelete.id);
    setClips(updatedClips);
    setSelectedMidiClip(null);
    combineAndUpdateAllNotes(updatedClips)
  }

  const onDragOver = (event: any) => {
    event.preventDefault();
  }
  const onDragEnter = (event: any) => {
    event.preventDefault();
  }
  const onDragleave = (event: any) => {
    event.preventDefault();
  }

  const onDrop = async (event: any) => {
    event.preventDefault();

    const pos = event.clientX - 32;
    const at16th = pos / grid * 4;
    const atQuarter = Math.floor(at16th / 4) * 4;

    const item = event.dataTransfer.items[0];
    if (item.kind === 'file') {

      if (item.type === 'audio/midi') {
        const file = item.getAsFile();
        const data = await core.readMidiFile(file);
        const midi = new Midi(data);

        if (midi) {

          
          const track = midi.tracks[0];
          const clipLength = Math.ceil((track.duration / core.clock.timeValueOf16th) / 16);

          const newClip = new MidiClip(atQuarter, 'New Clip', clipLength)

          track.notes.forEach(note => {
            const startInClip = note.time / core.clock.timeValueOf16th;
            const lengthIn16th = note.duration / core.clock.timeValueOf16th;
            const noteName = note.name as NoteName;
            const newNote = new Note(noteName, lengthIn16th);
            newClip.notes[startInClip] = !newClip.notes[startInClip] ? [newNote] : [...newClip.notes[startInClip], newNote];
            
          });

          setClips([
            ...clips,
            newClip
          ]);

        }

        

      }
    }

  }

  const selectChannel = () => {
    setSelectedChannel(channel);
  }

  const deleteChannel = () => {
    onDelete();
  }

  return (
    <div
      onClick={selectChannel}
      className={selectedChannel?.id === channel.id ? 'midi-channel selected' : 'midi-channel'}
      style={{ backgroundSize: `${grid}px` }}>
      <header className="midi-channel__header">
        {channel.name}<span>Midi</span>
        <button onClick={deleteChannel} className='midi-channel__header__delete'>Delete</button>
      </header>
      <div className="midi-channel__strip"
          onClick={onChannelStripClick}
          onDoubleClick={onChannelStripDoubleClick}
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragleave}
          onDrop={onDrop}
          >
          {
            clips.map((clip) => (
              <Rnd
                key={clip.id}
                dragAxis='x'
                dragGrid={[grid, 0]}
                resizeGrid={[grid * 4, 0]}
                bounds='parent'
                onClick={(e) => onClipClick(clip, e)}
                onDoubleClick={(e) => onClipDoubleClick(e, clip)}
                onDragStart={(e) => onClipClick(clip)}
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
                onResizeStop={(e, dir, ref) => onResizeStop(e, clip, ref)}
                onDragStop={(e, pos) => onDragStop(clip, pos)}
                position={{
                  x: getPosOnTimeline(clip.start),
                  y: 0
                }}
                size={{
                  width: clip.length * grid * 4,
                  height: '100%'
                }}
              >
                <MidiClipComponent grid={grid} clip={clip} selected={selectedMidiClipRef.current?.id === clip.id} onUpdate={onClipUpdate}></MidiClipComponent>
              </Rnd>
            ))

          }
      </div>
    </div>
  )

}

export default MidiChannelComponent;