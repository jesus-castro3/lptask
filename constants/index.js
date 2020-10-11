export const ADD = 'add';
export const SUBTRACT = 'subtract';
export const TIMES = 'times';
export const DIVIDE = 'divide';
export const RANDOM = 'random';
export const ROOT = 'root';
export const EQUATION = 'equation';

export const OPERATIONS_ENUM = Object.freeze({
  [ADD]: ADD ,
  [SUBTRACT]: SUBTRACT ,
  [TIMES]: TIMES ,
  [DIVIDE]: DIVIDE ,
  [RANDOM]: RANDOM ,
  [ROOT]: ROOT,
  [EQUATION]: EQUATION,
});

export const OPERATIONS_UI = {
  '+': ADD,
  '-': SUBTRACT,
  '*': TIMES,
  '/': DIVIDE,
  [RANDOM]: RANDOM,
  [ROOT]: ROOT,
  [EQUATION]: EQUATION
};