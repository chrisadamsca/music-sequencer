import { AudioChannel, SerializedAudioChannel } from "./Channel/AudioChannel";
import { Channel, SerializedChannel } from "./Channel/Channel";
import { MidiChannel, SerializedMidiChannel } from "./Channel/MidiChannel";
import { AudioClip } from "./Clip/AudioClip";
import { Clip } from "./Clip/Clip";
import { MidiClip } from "./Clip/MidiClip";
import { Clock } from "./Clock/Clock";
import { ScheduledNotes } from "./Note/Note";


export class Core {

  private audioContext: AudioContext;
  
  public readonly clock: Clock;

  public channels: Channel[] = [];

  public masterVolume: GainNode;

  constructor() {
    this.audioContext = new AudioContext();
    this.clock = new Clock(this.audioContext, 120, [4, 4]);
    this.masterVolume = this.audioContext.createGain();
    this.masterVolume.connect(this.audioContext.destination);
    this.masterVolume.gain.value = 0.8;
  }

  public setVolume(value: number): void {
    this.masterVolume.gain.value = value;
  }

  public deleteAllChannels(): void {
    this.channels = [];
  }

  public addMidiChannel(name: string): MidiChannel {
    const newChannel = new MidiChannel(this.audioContext, name)
    this.channels.push(newChannel);
    return newChannel
  }

  public addAudioChannel(name: string): AudioChannel {
    const newChannel = new AudioChannel(this.audioContext, name)
    this.channels.push(newChannel);
    return newChannel;
  }

  public deleteChannel(channelToDelete: Channel): void {
    this.channels = this.channels.filter(channel => channel.id !== channelToDelete.id);
  }

  public loadMidiChannel(channelData: SerializedMidiChannel): MidiChannel {
    const newChannel = new MidiChannel(this.audioContext, channelData.name);
    newChannel.loadFromData(channelData);
    this.channels.push(newChannel);
    return newChannel;
  }

  public loadAudioChannel(channelData: SerializedAudioChannel): AudioChannel {
    const newChannel = new AudioChannel(this.audioContext, channelData.name);
    newChannel.loadFromData(channelData);
    this.channels.push(newChannel);
    return newChannel;
  }

  public addChannel(channel: Channel): void {
    this.channels.push(channel);
  }

  public updateChannelClips(channelToUpdate: Channel, clips: Clip[]): void {
    const foundChannelToUpdate = this.channels.find(channel => channel.id === channelToUpdate.id);
    if (foundChannelToUpdate) {
      if (foundChannelToUpdate instanceof MidiChannel) {
        foundChannelToUpdate.setClips((clips as MidiClip[]));
      } else if (foundChannelToUpdate instanceof AudioChannel) {
        foundChannelToUpdate.setClips((clips as AudioClip[]));
      }
    }
  }

  public updateChannelNotes(channelToUpdate: MidiChannel, notes: ScheduledNotes): void {
    const foundChannelToUpdate = this.channels.find(channel => channel.id === channelToUpdate.id);
    if (foundChannelToUpdate && foundChannelToUpdate instanceof MidiChannel) {
      foundChannelToUpdate.setNotes(notes);
    }
  }

  public readAudioFile(file: Blob): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
          var audioContext = new (window.AudioContext)();
          const buffer = await audioContext.decodeAudioData((event as any).target.result);
          return resolve(buffer);
      };
      reader.onerror = () => {
        reject();
      }
      reader.readAsArrayBuffer(file);
    })
  }

  public readMidiFile(file: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event: ProgressEvent<FileReader>) => {
        const arrayBuffer: ArrayBuffer = (event.target?.result as ArrayBuffer);
        if (!arrayBuffer) {
          return reject();
        }

        const byteArray = new Uint8Array(arrayBuffer);
        return resolve(byteArray);
      };
      reader.onerror = () => {
        return reject();
      }
      reader.readAsArrayBuffer(file);
    })
  }

  public serialize(): SerializedSaveData {
    const channels = this.channels.map(channel => {
      return channel.serialize();
    });
    return channels;
  }

}

export type SerializedSaveData = SerializedChannel[];