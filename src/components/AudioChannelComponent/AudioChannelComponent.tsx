import { useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import './AudioChannelComponent.scss';
import { useStore } from '../../state/AppStore';
import { AudioClip } from '../../lib/Clip/AudioClip';
import { AudioChannel } from '../../lib/Channel/AudioChannel';
import AudioClipComponent from '../AudioClipComponent/AudioClipComponent';

const AudioChannelComponent = ({ channel, grid, onDelete }: {
  channel: AudioChannel,
  grid: number,
  onDelete: Function
}) => {

  const setSelectedChannel = useStore((state) => state.setSelectedChannel)
  const selectedChannel = useStore((state) => state.selectedChannel)
  
  const [clips, setClips] = useState<AudioClip[]>([]);
  const clipsRef = useRef<AudioClip[]>();
  clipsRef.current = clips;
  
  const selectedAudioClip = useStore((state) => state.selectedAudioClip)
  const setSelectedAudioClip = useStore((state) => state.setSelectedAudioClip)
  const selectedAudioClipRef = useRef<AudioClip | null>();
  selectedAudioClipRef.current = selectedAudioClip;
 
  useEffect(() => {
    setClips(channel.clips);

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.code === 'KeyD') {  
        const clipToDuplicate = selectedAudioClipRef.current;
        if (!clipToDuplicate || !clipsRef.current) {
          return;
        }
        if (clipsRef.current.find(clip => clip.id === clipToDuplicate.id)) {
          const start = clipToDuplicate.start + (clipToDuplicate.length * 16);
          const duplicate = new AudioClip(0, `Clip ${clipsRef.current.length + 1}`, clipToDuplicate.buffer);
          // duplicate.loadFromData(clipToDuplicate.serialize());
          duplicate.setStart(start);
          setSelectedAudioClip(duplicate);          
          setClips([
            ...clipsRef.current,
            duplicate
          ])
        }
      }
    });

  }, []);

  useEffect(() => {
    core.updateChannelClips(channel, clips);
  }, [clips]);

  const onDragOver = (event: any) => {
    event.preventDefault();
  }
  const onDragEnter = (event: any) => {
    event.preventDefault();
  }
  const onDragleave = (event: any) => {
    event.preventDefault();
  }

  const onDragStop = (clip: AudioClip, {x, y}) => {
    const start = Math.round(x / grid);
    clip.start = start * 4;
    
    const updatedClips = clips.filter(oldClip => oldClip.id !== clip.id);
    updatedClips.push(clip);
    setClips(updatedClips);
  }

  const onClipDoubleClick = (event: MouseEvent | TouchEvent, clipToDelete: AudioClip) => {
    event.stopPropagation();
    const updatedClips = clips.filter(clip => clip.id !== clipToDelete.id);
    setClips(updatedClips);
  }

  const onDrop = async (event: any) => {
    event.preventDefault();

    const pos = event.clientX - 32;
    const at16th = pos / grid * 4;
    const atQuarter = Math.floor(at16th / 4) * 4;

    const item = event.dataTransfer.items[0];
    if (item.kind === 'file') {
      const file = item.getAsFile();
      const buffer: AudioBuffer = await core.readAudioFile(file);
      const newClip = new AudioClip(atQuarter, `Clip ${clips.length + 1}`, buffer)
      setClips([
        ...clips,
        newClip
      ]);
      setSelectedAudioClip(newClip);
    }

  }

  const getPosOnTimeline = (startAt16th): number => {
    return startAt16th * (grid / 4);
  }

  const selectChannel = (): void => {
    setSelectedChannel(channel);
  }

  const deleteChannel = (): void => {
    onDelete();
  }

  const onChannelClick = (event): void => {
    const pos = event.clientX - 32;
    const at16th = (pos / grid) * 4;
    const atQuarter = Math.floor(at16th / 4) * 4;
    core.clock.setTimeTo16th(atQuarter);
    setSelectedAudioClip(null);
  }

  const onClipClick = (event, clip: AudioClip): void => {
    event.stopPropagation();
    setSelectedAudioClip(clip);
    setSelectedChannel(channel);
  }

  return (
    <div
      onClick={selectChannel}
      className={selectedChannel?.id === channel.id ? 'audio-channel selected' : 'audio-channel'}
      style={{ backgroundSize: `${grid}px` }}>
      <header className="audio-channel__header">
        {channel.name}<span>Audio</span>
        <button onClick={deleteChannel} className='audio-channel__header__delete'>Delete</button>
      </header>
      <div className="audio-channel__strip"
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragleave}
          onClick={onChannelClick}
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
                onDragStop={(e, pos) => onDragStop(clip, pos)}
                onDoubleClick={(e) => onClipDoubleClick(e, clip)}
                onDragStart={(e) => onClipClick(e, clip)}
                onClick={(e) => onClipClick(e, clip)}
                enableResizing={false}
                position={{
                  x: getPosOnTimeline(clip.start),
                  y: 0
                }}
                size={{
                  width: clip.length * grid * 4,
                  height: '100%'
                }}
              >
                <AudioClipComponent grid={grid} clip={clip} onUpdate={() => {}} selected={selectedAudioClip?.id === clip.id}></AudioClipComponent>
              </Rnd>
            ))

          }
      </div>
    </div>
  )

}

export default AudioChannelComponent;