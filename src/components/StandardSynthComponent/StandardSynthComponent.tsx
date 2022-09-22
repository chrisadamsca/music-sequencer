import { useEffect, useState } from 'react';
import { MidiChannel } from '../../lib/Channel/MidiChannel';
import { StandardSynth } from '../../lib/Instrument/StandardSynth';
import { useStore } from '../../state/AppStore';
import StandardSynthOscillatorComponent from './StandardSynthComponent copy/StandardSynthOscillatorComponent';
import './StandardSynthComponent.scss';
import StandardSynthFilterComponent from './StandardSynthFilterComponent/StandardSynthFilterComponent';

interface OscillatorSettings {
  detune: number;
  waveform: OscillatorType;
  volume: number;
}

const StandardSynthComponent = ({instrument}: {instrument: StandardSynth}) => {

  const channel: MidiChannel | null = useStore((state) => (state.selectedChannel as MidiChannel));
  
  const changeVolume = (volume: number, index: number) => {
    channel.instrument?.setOscillatorVolume(index, volume);
  }

  const detune = (detune: number, index: number) => {
    channel.instrument?.detune(detune, index);
  }
  
  const switchWaveform = (waveform: OscillatorType, index: number): void => {
    channel.instrument?.changeWaveform(waveform, index);
  }

  const changeFilterFrequency = (frequency: number): void => {
    channel.instrument?.setFilterValue(frequency);
  }

  const changeFilterQ = (q: number): void => {
    channel.instrument?.setFilterQ(q);
  }

  return (
    <div className='instrument standard-synth'>

      <StandardSynthOscillatorComponent 
        instrument={channel.instrument!} 
        oscillatorIndex={0}
        switchWaveformHandler={(value) => switchWaveform(value, 0)}
        changeVolumeHandler={(value) => changeVolume(value, 0)}
        detuneHandler={(value) => detune(value, 0)} />

      <StandardSynthOscillatorComponent 
        instrument={channel.instrument!} 
        oscillatorIndex={1}
        switchWaveformHandler={(value) => switchWaveform(value, 1)}
        changeVolumeHandler={(value) => changeVolume(value, 1)}
        detuneHandler={(value) => detune(value, 1)} />

      <StandardSynthFilterComponent 
        instrument={channel.instrument!} 
        changeFilterFrequencyHandler={(value) => changeFilterFrequency(value)}
        changeFilterQHandler={(value) => changeFilterQ(value)} />
        
    </div>
  )

}

export default StandardSynthComponent;