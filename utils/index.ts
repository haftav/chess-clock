import {TimeCounter} from 'easytimer.js';

export function getIncrementedTime(values: TimeCounter, increment: number): TimeCounter {
  const newValues = {...values};
  newValues.seconds = newValues.seconds += increment;

  return newValues;
}
