import { FormEvent, useEffect, useState } from 'react';
import { Channel } from '../../../lib/Channel/Channel';
import { useStore } from '../../../state/AppStore';
import './ChannelStrip.scss';

const ChannelStrip = ({ channel, index }: { channel: Channel, index: number }) => {

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);

  useEffect(() => {
    setVolume(channel.volume.gain.value);
  }, [channel])
  
  
  const changeVolume = (event: FormEvent<HTMLInputElement>) => {
    const value = Number(event.currentTarget.value)
    setVolume(value);
    channel.setVolume(value);
  }

  const toggleMute = () => {
    const value = isMuted ? volume : 0;
    channel.setVolume(value);
    setIsMuted(!isMuted);
  }
  
  return (
    <div className='channel-strip'>
      <h3>Ch. {index + 1}</h3>
      <div className="volume-slider-wrapper">
        <input 
          className="volume-slider"
          type="range" 
          step={0.01}
          min="0" 
          max="1" 
          value={volume}
          onChange={(event) => changeVolume(event)}
          >
        </input>
      </div>
      <button 
        onClick={toggleMute}
        className={'mute-button ' + (isMuted ? 'is--muted' : '')}>M</button>
    </div>
  )

}

export default ChannelStrip;