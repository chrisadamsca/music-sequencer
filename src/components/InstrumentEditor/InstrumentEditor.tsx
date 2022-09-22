import { Channel } from '../../lib/Channel/Channel';
import { MidiChannel } from '../../lib/Channel/MidiChannel';
import { useStore } from '../../state/AppStore';
import Dial from '../Dial/Dial';
import StandardSynthComponent from '../StandardSynthComponent/StandardSynthComponent';
import './InstrumentEditor.scss';

const InstrumentEditor = () => {

  const channel: Channel | null = useStore((state) => state.selectedChannel);

  return (
    <div className='instrument-editor'>
      {channel && channel instanceof MidiChannel ? 
        <div className="instrument-rack">
          <StandardSynthComponent instrument={channel.instrument!} />
        </div>
      : ''}
    </div>
  )

}

export default InstrumentEditor;