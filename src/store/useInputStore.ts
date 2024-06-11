import { create } from 'zustand';
import { logger } from './logger';
import { Autocomplete } from '@/types/autocomplete';

export interface InputState {
  inputs: Autocomplete[]
}

export interface InputStore extends InputState {
  loadInputs: (args: InputState['inputs']) => void;
}

const initialState: Pick<InputStore, keyof InputState> = {
  inputs: []
};

const useInputStore = create<InputStore>()(
  logger<InputStore>(
    (set) => ({
      ...initialState,
      loadInputs: (inputs) => {
        set({ inputs })
      }
    }),
    'calcStore'
  )
);

export default useInputStore;
