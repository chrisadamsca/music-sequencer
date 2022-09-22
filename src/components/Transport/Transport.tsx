import { ChangeEventHandler, useEffect, useState } from 'react';
import { Clock } from '../../lib/Clock/Clock';
import './Transport.scss';

const Transport = () => {

  // const [clock, ] = useState(new Clock(new AudioContext()));
  const [isPlaying, setIsPlaying] = useState(false);
  const [metronomeIsPlaying, setMetronomeIsPlaying] = useState(false);
  const [bpm, setBpm] = useState<number>(120);

  useEffect(() => {
    setBpm(core.clock.tempo)
  }, [])
  
  
  const startClock = () => {
    setIsPlaying(true);
    core.clock.start();
  }

  const pauseClock = () => {
    setIsPlaying(false);
    core.clock.pause();
  }

  const stopClock = () => {
    setIsPlaying(false);
    core.clock.stop();
  }

  const changeBpm = (event: any) => {
    const tempo = event.target.value;
    setBpm(event.target.value);
    core.clock.setTempo(tempo);
  }

  const toggleMetronome = () => {
    metronomeIsPlaying ? core.clock.stopMetronome() : core.clock.startMetronome();
    setMetronomeIsPlaying(!metronomeIsPlaying);
  }

  return (
    <section id="Transport">
      <input className="bpm-input" type="number" value={bpm} onChange={changeBpm} />
      <button onClick={stopClock}><img src="svg/stop.svg" alt="stop button" /></button>
      <button onClick={isPlaying ? pauseClock : startClock}><img src={isPlaying ? 'svg/pause.svg' : 'svg/play.svg'} alt="play button" /></button>
      <button><img src="svg/record.svg" alt="record button" /></button>
      <button className={'metronome-button ' + (metronomeIsPlaying ? 'is--running' : '')} onClick={toggleMetronome}></button>
    </section>
  )

}

export default Transport;