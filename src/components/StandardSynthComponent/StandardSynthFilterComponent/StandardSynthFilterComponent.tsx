import { useEffect, useState } from 'react';
import { StandardSynth } from '../../../lib/Instrument/StandardSynth';
import Dial from '../../Dial/Dial';
import './StandardSynthFilterComponent.scss';

interface FilterSettings {
  frequency: number;
  q: number;
}

const StandardSynthFilterComponent = ({
  instrument, 
  changeFilterFrequencyHandler,
  changeFilterQHandler
}: {
  instrument: StandardSynth,
  changeFilterFrequencyHandler: Function,
  changeFilterQHandler: Function,
}) => {

  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
      frequency: instrument.filter.frequency.value, 
      q: instrument.filter.Q.value
  });

  useEffect(() => {
    setFilterSettings({
      frequency: instrument.filter.frequency.value, 
      q: instrument.filter.Q.value
    })
  }, [])
  
  
  const changeFrequency = (frequency: number) => {
    setFilterSettings({
      ...filterSettings,
      frequency
    });
    changeFilterFrequencyHandler(frequency);
  }

  const changeQ = (q: number) => {
    setFilterSettings({
      ...filterSettings,
      q
    });
    changeFilterQHandler(q);
  }

  return (
    <>
    { !!filterSettings ? 
      <div className="filter">
        <strong className='filter__title'>Lowpass Filter</strong>
        <div className="filter__settings">
          <Dial label='Freq'  value={filterSettings.frequency} onChange={(value) => changeFrequency(value)} min={0} max={22_000}></Dial>
          <div className="filter-type-select">
            <div className="filter-type-select-preview">
              <img 
                className="filter-type-image" 
                src={'svg/lowpass.svg'} 
                style={{
                  transform: `translateX(-${80 - ((filterSettings.frequency / 22_000) * 100)}%)`
                }} />
            </div>
          </div>
          <Dial label='Q' value={filterSettings.q} onChange={(value) => changeQ(value)} min={0} max={100}></Dial>
        </div>
      </div>
      : ''}
    </>
  )

}

export default StandardSynthFilterComponent;