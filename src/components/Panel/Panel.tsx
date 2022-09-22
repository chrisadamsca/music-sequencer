import { useEffect, useState } from 'react';
import { AudioChannel } from '../../lib/Channel/AudioChannel';
import { Channel } from '../../lib/Channel/Channel';
import { MidiChannel } from '../../lib/Channel/MidiChannel';
import { useStore } from '../../state/AppStore';
import ChannelMixer from '../ChannelMixer/ChannelMixer';
import ClipEditor from '../ClipEditor/ClipEditor';
import InstrumentEditor from '../InstrumentEditor/InstrumentEditor';
import './Panel.scss';

enum Tabs {
  'Clip',
  'Instrument',
  'Mixer'
}

const Panel = () => {

  const [openTab, setOpenTab] = useState<Tabs>(Tabs.Instrument)
  const selectedChannel = useStore((state) => state.selectedChannel)
  const selectedMidiClip = useStore((state) => state.selectedMidiClip)
  
  useEffect(() => {
    if (openTab === Tabs.Mixer) {
      return;
    }
    if (selectedChannel instanceof AudioChannel) {
      setOpenTab(Tabs.Clip);
    } else if (selectedChannel instanceof MidiChannel) {
      setOpenTab(Tabs.Clip);
    }
  }, [selectedChannel, selectedMidiClip]);

  const activeTab = () => {
    switch (openTab) {
      case Tabs.Clip:
        return <ClipEditor />
      case Tabs.Instrument:
        return <InstrumentEditor />
      case Tabs.Mixer:
        return <ChannelMixer />
    }
  }
  
  return (
    <div className='panel'>
      <div className="panel__content">
        { activeTab() }
      </div>
      <nav>
        <ul>
          <li className={`${(openTab === Tabs.Mixer ? 'selected' : '')}`}>
            <button onClick={() => setOpenTab(Tabs.Mixer)}>Mixer</button>
          </li>
          <li className={`${(openTab === Tabs.Instrument ? 'selected' : '')}`}>
            <button onClick={() => setOpenTab(Tabs.Instrument)}>Instrument</button>
          </li>
          <li className={`${(openTab === Tabs.Clip ? 'selected' : '')}`}>
            <button onClick={() => setOpenTab(Tabs.Clip)}>Clip</button>
          </li>
        </ul>
      </nav>
    </div>
  )

}

export default Panel;