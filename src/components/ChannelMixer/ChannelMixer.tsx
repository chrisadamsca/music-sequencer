import { Channel } from '../../lib/Channel/Channel';
import { useStore } from '../../state/AppStore';
import ChannelStrip from './ChannelStrip/ChannelStrip';
import './ChannelMixer.scss';
import MasterStrip from './MasterStrip/MasterStrip';

const ChannelMixer = () => {

  const channels: Channel[] = useStore((state) => state.channels);
  
  return (
    <div className='channels-mixer'>
      <div className="channels">
        {channels.map((channel, index) => (
          <ChannelStrip channel={channel} index={index} key={`ch-strip-${index}`} />
        ))}
      </div>
      <MasterStrip />
    </div>
  )

}

export default ChannelMixer;