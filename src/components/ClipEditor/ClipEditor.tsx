import { getNotes } from '../../lib/Note/Note';
import { useStore } from '../../state/AppStore';
import AudioClipComponent from '../AudioClipComponent/AudioClipComponent';
import './ClipEditor.scss';
import PianoRoll from './PianoRoll/PianoRoll';

const ClipEditor = () => {

  const selectedMidiClip = useStore((state) => state.selectedMidiClip);
  const selectedAudioClip = useStore((state) => state.selectedAudioClip);

  const notes = getNotes();
  

  return (
    <div className='clip-editor'>
      { selectedMidiClip ? (
        <PianoRoll width={3} notes={notes} />
      ) : ''}
      { selectedAudioClip ? (
        <div className="audio-clip-editor">
          <div className="audio-preview">
            { selectedAudioClip.waveformData ? selectedAudioClip.waveformData.map((datapoint, index) => (
              <div 
              key={`clipeditordatapoint${index}`}
              className="audio-preview__data-point"
              style={{
                maxWidth: `${100 / selectedAudioClip.waveformData.length}%`,
                height: `${datapoint * 80}%`
              }}></div>
              )) : ''}
          </div>
        </div>
      ) : ''}
    </div>
  )

}

export default ClipEditor;