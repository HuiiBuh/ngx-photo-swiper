import {TDirection} from '../slider/slider.types';

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

export class TouchMove {

  private static readonly directionCount = 20;
  private static readonly swipeThreshold = 80;

  private readonly history!: Point[];
  private touchDirection!: 'y' | 'x';

  public start!: Point;
  public current!: Point;
  public state!: 'start' | 'move' | 'end';

  static create(json: ITouchMove): TouchMove {
    return Object.assign(new TouchMove(), json);
  }

  public getDirection(): TDirection {
    const historyLength = this.history.length;
    const counter = historyLength > TouchMove.directionCount ? TouchMove.directionCount : historyLength;
    const offset = this.getPoint(historyLength - 1) - this.getPoint(historyLength - counter);

    if (Math.abs(offset) < TouchMove.swipeThreshold) {
      return 'none';
    }
    return this.getMoveDirection(offset);
  }

  private getPoint(index: number): number {
    return this.history[index][this.touchDirection];
  }

  private getMoveDirection(offset: number): 'left' | 'right' | 'up' | 'down' {
    if (this.touchDirection === 'x') {
      return offset > 0 ? 'left' : 'right';
    }
    return offset > 0 ? 'up' : 'down';
  }
}
