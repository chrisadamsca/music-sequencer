import { useEffect, useState } from 'react';
import { AudioChannel, SerializedAudioChannel } from '../../lib/Channel/AudioChannel';
import { Channel, SerializedChannel } from '../../lib/Channel/Channel';
import { MidiChannel, SerializedMidiChannel } from '../../lib/Channel/MidiChannel';
import { SerializedSaveData } from '../../lib/Core';
import { useStore } from '../../state/AppStore';
import AudioChannelComponent from '../AudioChannelComponent/AudioChannelComponent';
import MidiChannelComponent from '../MidiChannelComponent/MidiChannelComponent';
import ChannelComponent from '../MidiChannelComponent/MidiChannelComponent';
import SaveButton from '../SaveButton/SaveButton';
import './ArrangementView.scss';

const ArrangementView = () => {

  const channels: Channel[] = useStore((state) => state.channels);
  const setChannels = useStore((state) => state.setChannels);
  const [time, setTime] = useState(0);
  const [grid, setGrid] = useState(12);
  const setSelectedChannel = useStore((state) => state.setSelectedChannel)

  useEffect(() => {
    setChannels([
      core.addMidiChannel('Channel 1'),
      core.addAudioChannel('Channel 2')
    ]);
    update();
  }, []);
  
  const update = () => {
    const time = core.clock.next16th - 1;
    setTime(time);

    setTimeout(() => {
      update();
    }, 50);
  }

  const addMidiChannel = () => {
    const channel = core.addMidiChannel(`Channel ${channels.length + 1}`);
    setChannels([
      ...channels,
      channel
    ]);
    setSelectedChannel(channel);
  };

  const addAudioChannel = () => {
    const channel = core.addAudioChannel(`Channel ${channels.length + 1}`);
    setChannels([
      ...channels,
      channel
    ]);
    setSelectedChannel(channel);
  };

  const onSaveLoad = (data: SerializedSaveData) => {
    core.deleteAllChannels();
    const loadedChannels = data.map((channel: SerializedChannel, index: number) => {
      if (channel.type === 'MidiChannel') {
        return core.loadMidiChannel((channel as SerializedMidiChannel));
      } else if (channel.type === 'AudioChannel') {
        return core.loadAudioChannel((channel as SerializedAudioChannel));
      }
    });    
    setChannels(loadedChannels as (AudioChannel | MidiChannel)[])
  }

  const deleteChannel = (channelToDelete: Channel): void => {
    const updatedChannels = channels.filter(channel => channel.id !== channelToDelete.id);
    setChannels([
      ...updatedChannels
    ]);
    setSelectedChannel(null);
    core.deleteChannel(channelToDelete);
  }

  return (
    <section id="ArrangementView">
      <div className="save-button-container">
        <SaveButton onLoad={onSaveLoad} />
      </div>

      <div className="channels-scroll">
        <div className="channels-container">

          { time > 0 ? 
            <div className="timer"
              style={{ transform: `translateX(${time * (grid / 4)}px)` }}></div>
          : ''}
            
          {channels.map((channel, index) => {
            if (channel instanceof MidiChannel) {
              return <MidiChannelComponent 
                        key={index}
                        channel={channel} 
                        grid={grid} 
                        onDelete={() => deleteChannel(channel)} />
            } else if (channel instanceof AudioChannel) {
              return <AudioChannelComponent 
                        key={index}
                        channel={channel} 
                        grid={grid} 
                        onDelete={() => deleteChannel(channel)} />
            }
          })}

        </div>
      </div>


      <div className="add-buttons">
        <button className='default-button add-midi-button' onClick={() => addMidiChannel()}>Add Midi Channel</button>
        <button className='default-button add-audio-button' onClick={() => addAudioChannel()}>Add Audio Channel</button>
      </div>
      
    </section>
  )

}

export default ArrangementView;