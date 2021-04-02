export interface MovePosition {
  clientX: number;
  clientY: number;
}

export interface ITouchMove {
  touchDirection: 'y' | 'x';
  start: MovePosition;
  current: MovePosition;
  history: MovePosition[];
  state: 'start' | 'move' | 'end';
}
