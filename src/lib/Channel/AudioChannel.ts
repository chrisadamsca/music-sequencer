
import { AudioClip, SerializedAudioClip } from "../Clip/AudioClip";
import { Channel, SerializedChannel } from "./Channel";

export class AudioChannel extends Channel {

  public clips: AudioClip[] = [];

  constructor(audioContext: AudioContext, name: string) {
    super(audioContext, name);
  }

  public scheduler(next16th: number, nextTickTime: number, timeValueOf16th: number): void {
    this.clips.forEach(clip => {
      if ( !!clip.buffer && clip.start === next16th) {
          const source = this.audioContext.createBufferSource();
          source.buffer = clip.buffer;
          source.playbackRate.value = core.clock.tempo / 120;
          source.connect(this.volume);
          source.start(nextTickTime);
      }
    });
  }

  public setClips(clips: AudioClip[]): void {
    this.clips = clips;
  }

  public loadFromData(channelData: SerializedAudioChannel) {
    
  }

  public serialize(): SerializedAudioChannel {
    return {
      name: this.name,
      type: 'AudioChannel',
      clips: this.clips.map(clip => clip.serialize())
    }
  }

}

export interface SerializedAudioChannel extends SerializedChannel {
  clips: SerializedAudioClip[];
}