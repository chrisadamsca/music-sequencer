import create from "zustand";
import { Channel } from "../lib/Channel/Channel";
import { AudioClip } from "../lib/Clip/AudioClip";
import { MidiClip } from "../lib/Clip/MidiClip";

export const useStore = create<{
  channels: Channel[],
  setChannels: (channels: Channel[]) => void,
  selectedMidiClip: MidiClip | null,
  setSelectedMidiClip: (selectedMidiClip: MidiClip | null) => void,
  selectedAudioClip: AudioClip | null,
  setSelectedAudioClip: (selectedMidiClip: AudioClip | null) => void,
  selectedChannel: Channel | null,
  setSelectedChannel: (selectedMidiClip: Channel | null) => void,
}>((set: any) => ({
  channels: [],
  setChannels: async (channels: Channel[]) => {
    set((state) => {
      return { ...state, channels }
    })
  },
  selectedMidiClip: null,
  setSelectedMidiClip: async (selectedMidiClip: MidiClip | null) => {
    set((state) => {
      return { ...state, selectedMidiClip, selectedAudioClip: null }
    })
  },
  selectedAudioClip: null,
  setSelectedAudioClip: async (selectedAudioClip: AudioClip | null) => {
    set((state) => {
      return { ...state, selectedAudioClip, selectedMidiClip: null }
    })
  },
  selectedChannel: null,
  setSelectedChannel: async (selectedChannel: Channel | null) => {
    set((state) => {
      return { ...state, selectedChannel }
    })
  }
}));