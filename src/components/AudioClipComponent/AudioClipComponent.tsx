import { useEffect, useRef, useState } from 'react';
import { AudioClip } from '../../lib/Clip/AudioClip';
import { Clip } from '../../lib/Clip/Clip';
import { MidiClip } from '../../lib/Clip/MidiClip';
import { frequencyLookup, getNotes, Note, ScheduledNotes } from '../../lib/Note/Note';
import { useStore } from '../../state/AppStore';
import './AudioClipComponent.scss';


const AudioClipComponent = ({ clip, onUpdate, selected, grid }: {
   clip: AudioClip, onUpdate: Function, selected?: boolean, grid: number
}) => {

  

  return (
    <div className={'audio-clip ' + (selected ? 'selected' : '')}>
      <header className="audio-clip__header">{clip.name || clip.id}</header>
      <div className="audio-clip__body">
        <div className="audio-clip__preview">
          { clip.waveformData ? clip.waveformData.map((datapoint, index) => (
            <div 
              key={`datapoint-${index}`}
              className="audio-clip__preview__data-point"
              style={{
                width: `${100 / clip.waveformData.length}%`,
                height: `${datapoint * 80}%`
              }}></div>
          )) : ''}
        </div>
      </div>
    </div>
  )

}

export default AudioClipComponent;