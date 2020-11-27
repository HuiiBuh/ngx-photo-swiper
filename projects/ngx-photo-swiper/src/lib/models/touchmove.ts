export interface Point {
  x: number;
  y: number;
}

export interface ITouchMove {
  touchDirection: 'y' | 'x';
  start: Point;
  current: Point;
  history: Point[];
  state: 'start' | 'move' | 'end';
}
