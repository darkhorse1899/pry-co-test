import { create } from 'zustand';
// import { getItem, setItem } from '@/lib/localStorage';
import { logger } from './logger';

export enum FactorType {
  WIDGET = 'widget',
  VARIABLE = 'variable',
  NUMBER = 'number',
  OPERATOR = 'operator',
  PLAIN = 'text'
}

export interface Factor {
  id: string;
  variableID?: string;
  type: FactorType;
  value: string;
}

export interface Calculation {
  name: string;
  expressions: Factor[];
}

export interface CalcState {
  calculations: Calculation[];
}

export interface CalcStore extends CalcState {
  updateName: (search: string) => (value: string) => void;
  updateExps: (search: string) => (exps: Factor[]) => void;
  createFormula: () => void;
}

const initialState: Pick<CalcStore, keyof CalcState> = {
  calculations: [{ name: 'Revenue', expressions: [] }]
};

const useCalcStore = create<CalcStore>()(
  logger<CalcStore>(
    (set) => ({
      ...initialState,
      updateName: (search: string) => (value: string) => {
        set((state) => {
          const results = state.calculations.map(item =>
            item.name === search ? { ...item, name: value } : item);
          return { calculations: results };
        });
      },
      updateExps: (search: string) => (exps: Factor[]) => {
        set((state) => {
          const results = state.calculations.map(item =>
            item.name === search ? { ...item, expressions: exps } : item);
          return { calculations: results }
        })
      },
      createFormula: () => {
        set((state) => {
          return {
            calculations: [...state.calculations,
            { name: '', expressions: [] }
            ]
          }
        })
      }
    }),
    'calcStore'
  )
);

export default useCalcStore;
