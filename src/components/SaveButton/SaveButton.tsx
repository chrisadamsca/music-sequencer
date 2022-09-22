import { useState } from 'react';
import './SaveButton.scss';
import localForage from "localforage";

const SaveButton = ({onLoad}: {onLoad: Function}) => {

  const save = async () => {
    const serializedData = await core.serialize();
    // localStorage.setItem('save', JSON.stringify(serializedData));
    await localForage.setItem('save', serializedData);
  }

  const load = async () => {
    try {
      // const loadedData = localStorage.getItem('save');
      const loadedData = await localForage.getItem('save');
      onLoad(loadedData);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='load-save-buttons'>
      <button onClick={save} className="default-button save-button">Save</button>
      <button onClick={load} className="default-button load-button">Load</button>
    </div>
  )

}

export default SaveButton;