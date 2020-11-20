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

  private static readonly swipeThreshold = 60;
  public start!: Point;
  public current!: Point;
  public state!: 'start' | 'move' | 'end';
  private readonly history!: Point[];
  private touchDirection!: 'y' | 'x';

  static create(json: ITouchMove): TouchMove {
    return Object.assign(new TouchMove(), json);
  }

  public getDirection(): TDirection {
    if (this.touchDirection === 'x') {
      return this.getHorizontalDirection();
    } else {
      return this.getVerticalDirection();
    }
  }

  private getHorizontalDirection(): TDirection {
    const history = this.getHistorySinceLastDirectionChange();
    const historyLength = history.length;
    if (historyLength === 0) {
      return 'none';
    }
    const offset = history[0] - history[historyLength - 1];
    if (Math.abs(offset) < TouchMove.swipeThreshold) {
      return 'none';
    }
    return this.getMoveDirection(offset);
  }

  private getVerticalDirection(): TDirection {
    const difference = this.start.y - this.current.y;
    let direction: TDirection = 'none';
    if (difference > TouchMove.swipeThreshold) {
      direction = 'up';
    } else if (Math.abs(difference) > TouchMove.swipeThreshold) {
      direction = 'down';
    }
    return direction;
  }

  /**
   * Get the history since the last time the user changed the swipe direction
   */
  private getHistorySinceLastDirectionChange(): number[] {
    const history = new Array(this.history.length);

    // Get only the x or y coordinate
    this.history.forEach((v, i) => {
      history[i] = v[this.touchDirection];
    });

    let old: number = history[history.length - 1];
    let oldIsLarger: boolean | null = null;

    const returnHistory: number[] = [];
    for (let i = history.length - 2; i >= 0; i -= 1) {
      const point = history[i];

      let isLarger: boolean | null = false;
      if (point > old) {
        isLarger = true;
      } else if (point === old) {
        isLarger = null;
      }

      // Check if the direction of the swipe changed
      if (oldIsLarger !== null && isLarger !== null && oldIsLarger !== isLarger) {
        break;
      }

      returnHistory.push(point);
      oldIsLarger = isLarger;
      old = point;
    }

    return returnHistory;
  }

  private getMoveDirection(offset: number): 'left' | 'right' | 'up' | 'down' {
    if (this.touchDirection === 'x') {
      return offset > 0 ? 'left' : 'right';
    }
    return offset > 0 ? 'up' : 'down';
  }
}
