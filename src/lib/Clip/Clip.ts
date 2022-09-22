import { v4 as uuid } from 'uuid';

export abstract class Clip {
  
  public readonly id: string;

  constructor(
    public start: number,
    public name: string,
  ) {
    this.id = uuid();
  }

  public abstract loadFromData(clipData: SerializedClip): void;

  public abstract serialize(): SerializedClip;
  
  public setStart(start: number): void {
    this.start = start;
  }

}

export interface SerializedClip {
  name: string;
  start: number;
  length: number;
}