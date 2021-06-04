import { TDirection } from '../../models/slider';
import { ITouchMove, MovePosition } from '../../models/touchmove';

export class TouchMove {

  private static readonly swipeThreshold = 60;
  public start!: MovePosition;
  public current!: MovePosition;
  public state!: 'start' | 'move' | 'end';
  private readonly history!: MovePosition[];
  private touchDirection!: 'y' | 'x';

  public static create(json: ITouchMove): TouchMove {
    return Object.assign(new TouchMove(), json);
  }

  public getDirection(): TDirection {
    if (this.touchDirection === 'x') {
      return this.getHorizontalDirection();
    }
    return this.getVerticalDirection();
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
    const difference = this.start.clientY - this.current.clientY;
    let direction: TDirection = 'none';
    if (difference > TouchMove.swipeThreshold) {
      direction = 'open';
    } else if (Math.abs(difference) > TouchMove.swipeThreshold) {
      direction = 'close';
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
      history[i] = v[('client' + this.touchDirection.toUpperCase()) as 'clientX' | 'clientY'];
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

  private getMoveDirection(offset: number): 'left' | 'right' | 'open' | 'close' {
    if (this.touchDirection === 'x') {
      return offset > 0 ? 'left' : 'right';
    }
    return offset > 0 ? 'open' : 'close';
  }
}
