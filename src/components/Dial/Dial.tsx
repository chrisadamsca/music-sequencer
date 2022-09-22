import { useEffect, useRef, useState } from 'react';
import './Dial.scss';


const Dial = ({value, min, max, label, onChange}: {
  value: number, 
  min: number, 
  max: number, 
  label: string,
  onChange: Function
}) => {

  const [deg, setDeg] = useState<number>(0);
  const [_value, setValue] = useState(0);
  // const [dialCenter, setDialCenter] = useState(0);

  const dialCenter = useRef(0)

  let startDelta = 0;
  
  const updateValue = (deg: number): void => {
    const newValue = (min + (max - min)) / 340 * deg;
    setValue(newValue);
    onChange(newValue);
  }

  useEffect(() => {
    const deg = (value / max) * 340;
    setDeg(deg);
  }, [value])
  
  

  const onMouseDown = (event) => {
    event.preventDefault();
    const dialElementBounding = event.target.getBoundingClientRect();
    const center = dialElementBounding.top + (dialElementBounding.height / 2)
    const delta = center - event.clientY;
    startDelta = delta;
    dialCenter.current = center;

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", e => {
      document.removeEventListener("mousemove", onDrag);
    });
  }

  const onDrag = (event) => {
    
    const delta = dialCenter.current - event.clientY;
    const distance =  delta - startDelta;
    let newDeg = deg + distance > 340 ? 340 : deg + distance;
    newDeg = newDeg < 0 ? 0 : newDeg;
    updateValue(newDeg);
  }

  const trunc = (n: number) => {
    if (n < 10) {
      return Math.round(n * 10) / 10;
    }
    return Math.round(n);
  }
  
  return (
    <div className='dial'>
      <div className="knob"
        onMouseDown={onMouseDown}
        style={{transform: `rotateZ(${deg}deg)`}} />
      <label>{trunc(value)}</label>
      <label>{label}</label>
    </div>
  )

}

export default Dial;