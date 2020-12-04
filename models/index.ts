import EasyTimer from 'easytimer.js';

export enum Players {
  p1,
  p2,
}

export interface SwitchTurnParams {
  currentTimer: EasyTimer;
  nextTimer: EasyTimer;
  updateTimer: (newTimer: EasyTimer) => void;
  nextPlayer: Players;
}

export enum GameStates {
  Menu,
  Playing,
  Paused,
  Ended,
}
