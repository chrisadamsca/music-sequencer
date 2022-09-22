import { useEffect, useState } from 'react';
import { StandardSynth } from '../../../lib/Instrument/StandardSynth';
import Dial from '../../Dial/Dial';
import PanDial from '../../PanDial/PanDial';
import './StandardSynthOscillatorComponent.scss';

interface OscillatorSettings {
  detune: number;
  waveform: OscillatorType;
  volume: number;
}

const StandardSynthOscillatorComponent = ({
  instrument, 
  oscillatorIndex,
  changeVolumeHandler,
  detuneHandler,
  switchWaveformHandler
}: {
  instrument: StandardSynth,
  oscillatorIndex: number,
  changeVolumeHandler: Function,
  detuneHandler: Function,
  switchWaveformHandler: Function,
}) => {

  const [oscillatorSettings, setOscillatorSettings] = useState<OscillatorSettings>({
      detune: instrument.oscillators[oscillatorIndex].detuneValue, 
      waveform: instrument.oscillators[oscillatorIndex].oscillatorType,
      volume: instrument.oscillators[oscillatorIndex].volume.gain.value
  });

  useEffect(() => {
    setOscillatorSettings({
      detune: instrument.oscillators[oscillatorIndex].detuneValue, 
      waveform: instrument.oscillators[oscillatorIndex].oscillatorType,
      volume: instrument.oscillators[oscillatorIndex].volume.gain.value
    })
  }, [])
  
  
  const changeVolume = (volume: number) => {
    setOscillatorSettings({
      ...oscillatorSettings,
      volume
    });
    changeVolumeHandler(volume);
  }

  const detune = (detune: number) => {
    setOscillatorSettings({
      ...oscillatorSettings,
      detune
    });
    detuneHandler(detune);
  }
  
  const switchWaveform = (waveform: OscillatorType) => {
    setOscillatorSettings({
      ...oscillatorSettings,
      waveform
    });
    switchWaveformHandler(waveform);
  }

  const WaveformImage = () => {
    switch (oscillatorSettings.waveform) {
      case 'sawtooth':
        return <img className="waveform-image" src={'svg/saw.svg'} alt="" />
      case 'square':
        return <img className="waveform-image" src={'svg/squ.svg'} alt="" />
      default:
        return <img className="waveform-image" src={'svg/sin.svg'} alt="" />
    }
  }

  return (
    <>
    { !!oscillatorSettings ? 
      <div className="oscillator">
        <strong className='oscillator__title'>Oscillator {oscillatorIndex + 1}</strong>
        <div className="oscillator__settings">
          <PanDial label='Detune'  value={oscillatorSettings.detune} onChange={(value) => detune(value)} max={100}></PanDial>
          <div className="waveform-select">
            <div className="waveform-select-preview">
              <WaveformImage />
            </div>
            <div className="waveform-select-buttons">
              <button 
                onClick={() => switchWaveform('sine')}
                className={(oscillatorSettings.waveform === 'sine' ? 'selected' : '')}>
                  Sin
              </button>
              <button 
                onClick={() => switchWaveform('square')}
                className={(oscillatorSettings.waveform === 'square' ? 'selected' : '')}>
                  Squ
              </button>
              <button 
                onClick={() => switchWaveform('sawtooth')}
                className={(oscillatorSettings.waveform === 'sawtooth' ? 'selected' : '')}>
                  Saw
              </button>
            </div>
          </div>
          <Dial label='Volume' value={oscillatorSettings.volume} onChange={(value) => changeVolume(value)} min={0} max={1}></Dial>
        </div>
      </div>
      : ''}
    </>
  )

}

export default StandardSynthOscillatorComponent;