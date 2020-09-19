import {Directive, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {Point, TouchMove} from './touchmove.event';


@Directive({
  selector: '[libTouchmove]',
})
export class TouchmoveDirective implements OnInit, OnDestroy {

  private static touchThreshold: number = 5;

  @Output() vSwipe: EventEmitter<TouchMove> = new EventEmitter();
  @Output() hSwipe: EventEmitter<TouchMove> = new EventEmitter();

  // The element
  private readonly element: ElementRef;

  // The starting point of the touch
  private touchStartPosition: Point = {x: 0, y: 0};
  private touchState: 'start' | 'move' | 'end' = 'start';

  // Events to unsubscribe
  private touchStartUnsubscribe: () => void;
  private touchMoveUnsubscribe: () => void;
  private touchEndUnsubscribe: () => void;

  private touchHistory: Point[] = [];

  // Handler placeholder which handles the touches if it is clear what type they have
  private touchHandler: (e: TouchEvent, b?: undefined | 'end') => void;

  constructor(
    el: ElementRef,
    private renderer2: Renderer2,
    private ngZone: NgZone) {

    this.element = el;

    // Handler
    this.touchHandler = () => null;
    // Unsubscribe events
    this.touchStartUnsubscribe = () => null;
    this.touchMoveUnsubscribe = () => null;
    this.touchEndUnsubscribe = () => null;
  }

  /**
   * Subscribe to touch events of this element
   */
  public ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.touchStartUnsubscribe = this.renderer2.listen(this.element.nativeElement, 'touchstart', this.handleTouchStart.bind(this));
      this.touchEndUnsubscribe = this.renderer2.listen(this.element.nativeElement, 'touchend', this.handleTouchEnd.bind(this));
    });
  }

  /**
   * Remove all listeners
   */
  public ngOnDestroy(): void {
    this.touchStartUnsubscribe();
    this.touchMoveUnsubscribe();
    this.touchEndUnsubscribe();
  }

  /**
   * Handler the touch start (only react to wipe not to zoom, ...)
   */
  private handleTouchStart(e: TouchEvent): void {
    if (e.touches.length === 1) {
      this.touchMoveUnsubscribe = this.renderer2.listen(this.element.nativeElement, 'touchmove', this.handleTouchMove.bind(this));
      this.touchStartPosition.x = e.touches[0].clientX;
      this.touchStartPosition.y = e.touches[0].clientY;
    }
  }

  /**
   * Handle the mouse move event
   * Only gets called if the touch start was not a multitouch
   */
  private handleTouchMove(e: TouchEvent): void {
    // Get the fist touch
    const touch = e.touches[0];
    const xDiff: number = Math.abs(touch.clientX - this.touchStartPosition.x);
    const yDiff: number = Math.abs(touch.clientY - this.touchStartPosition.y);

    // Get the max of the touch
    const max = Math.max(xDiff, yDiff);

    // Check if the move is over the threshold
    if (max > TouchmoveDirective.touchThreshold) {
      this.touchState = 'start';
      // Check if it is a vertical or a horizontal touch
      if (max === yDiff) {
        this.touchHandler = this.handleVertical.bind(this);
      } else {
        this.touchHandler = this.handleHorizontal.bind(this);
      }
      // Unsubscribe the touchMove handler
      this.touchMoveUnsubscribe();

      // Pass the current event to the touch handler
      this.touchHandler(e);
      this.touchState = 'move';
      this.touchHistory.push({x: e.touches[0].clientX, y: e.touches[0].clientY});
      // And add the handler which is responsible for the vertical or the horizontal event binding
      this.touchMoveUnsubscribe = this.renderer2.listen(this.element.nativeElement, 'touchmove', this.touchHandler.bind(this));
    }
  }

  /**
   * Remove the touch move subscription
   */
  private handleTouchEnd(e: TouchEvent): void {
    const customEvent = {
      touches: [{
        clientX: e.changedTouches[0].clientX,
        clientY: e.changedTouches[0].clientY,
      }],
      preventDefault: () => null
    };

    this.touchState = 'end';
    this.touchHandler(customEvent as unknown as TouchEvent);
    this.touchHistory = [];
    this.touchHandler = () => null;
    this.touchMoveUnsubscribe();
  }

  /**
   * Handle the vertical touch event
   */
  private handleVertical(e: TouchEvent): void {
    e.preventDefault();
    this.touchHistory.push({x: e.touches[0].clientX, y: e.touches[0].clientY});
    this.vSwipe.emit(this.createEventObject(e, 'y'));
  }

  /**
   * Handle the horizontal touch event
   */
  private handleHorizontal(e: TouchEvent): void {
    e.preventDefault();
    this.touchHistory.push({x: e.touches[0].clientX, y: e.touches[0].clientY});
    this.hSwipe.emit(this.createEventObject(e, 'x'));
  }

  /**
   * Create the event object
   * @param e The touch event
   * @param touchDirection The direction of the touch
   */
  private createEventObject(e: TouchEvent, touchDirection: 'y' | 'x'): TouchMove {
    return TouchMove.create({
      history: this.touchHistory,
      touchDirection,
      current: {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      },
      start: {...this.touchStartPosition},
      state: this.touchState,
    });
  }
}
