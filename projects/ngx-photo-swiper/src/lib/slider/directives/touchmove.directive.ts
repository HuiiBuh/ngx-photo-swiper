import {Directive, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output} from '@angular/core';
import {fromEvent} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {MovePosition} from '../../models/touchmove';
import {TouchMove} from './touchmove.directive.event';

@Directive({
  selector: '[photoTouchmove]',
})
export class TouchmoveDirective implements OnInit, OnDestroy {

  private static touchThreshold: number = 5;

  @Output() public vSwipe: EventEmitter<TouchMove> = new EventEmitter();
  @Output() public hSwipe: EventEmitter<TouchMove> = new EventEmitter();

  // The element
  private readonly element: ElementRef;

  // The starting point of the touch
  private touchStartPosition: MovePosition = {clientX: 0, clientY: 0};
  private touchState: 'start' | 'move' | 'end' = 'start';

  // Events to unsubscribe
  private touchStartUnsubscribe: () => void;
  private touchMoveUnsubscribe: () => void;
  private touchEndUnsubscribe: () => void;

  private touchHistory: MovePosition[] = [];

  // Handler placeholder which handles the touches if it is clear what type they have
  private touchHandler: (e: MovePosition, b?: undefined | 'end') => void;

  constructor(
    el: ElementRef,
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
      fromEvent<TouchEvent>(this.element.nativeElement, 'touchstart', {passive: false}).pipe(
        filter(e => e.touches.length === 1),
        map(e => e.touches[0])
      ).subscribe(this.handleTouchStart.bind(this));

      fromEvent<TouchEvent>(this.element.nativeElement, 'touchend', {passive: false}).pipe(
        filter(e => e.changedTouches.length > 0),
        map(e => e.changedTouches[0])
      ).subscribe(this.handleTouchEnd.bind(this));
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
  private handleTouchStart(event: MovePosition): void {
    this.touchStartPosition.clientX = event.clientX;
    this.touchStartPosition.clientY = event.clientY;
    fromEvent<TouchEvent>(this.element.nativeElement, 'touchmove', {passive: false}).pipe(
      map(e => e.touches[0])
    ).subscribe(this.handleTouchMove.bind(this));
  }

  /**
   * Handle the mouse move event
   * Only gets called if the touch start was not a multi-touch
   */
  private handleTouchMove(event: MovePosition): void {
    // Get the fist touch
    const xDiff: number = Math.abs(event.clientX - this.touchStartPosition.clientX);
    const yDiff: number = Math.abs(event.clientY - this.touchStartPosition.clientY);

    // Get the max of the touch
    const max = Math.max(xDiff, yDiff);

    // Check if the move is over the threshold
    if (max > TouchmoveDirective.touchThreshold) {
      this.touchState = 'start';

      // Check if it is a vertical or a horizontal touch
      this.touchHandler = max === yDiff ? this.handleVertical.bind(this) : this.handleHorizontal.bind(this);

      // Unsubscribe the touchMove handler
      this.touchMoveUnsubscribe();

      // Pass the current event to the touch handler
      this.touchHandler(event);
      this.touchState = 'move';
      this.touchHistory.push(event);

      // And add the handler which is responsible for the vertical or the horizontal event binding
      fromEvent<TouchEvent>(this.element.nativeElement, 'touchmove', {passive: false}).pipe(
        map(e => e.touches[0])
      ).subscribe(this.touchHandler.bind(this));
    }
  }

  /**
   * Remove the touch move subscription
   */
  private handleTouchEnd(event: MovePosition): void {
    this.touchState = 'end';
    this.touchHandler(event);
    this.touchHistory = [];
    this.touchHandler = () => null;
    this.touchMoveUnsubscribe();
  }

  /**
   * Handle the vertical touch event
   */
  private handleVertical(event: MovePosition): void {
    this.touchHistory.push(event);
    this.vSwipe.emit(this.createEventObject(event, 'y'));
  }

  /**
   * Handle the horizontal touch event
   */
  private handleHorizontal(event: MovePosition): void {
    this.touchHistory.push(event);
    this.hSwipe.emit(this.createEventObject(event, 'x'));
  }

  /**
   * Create the event object
   * @param event The touch event
   * @param touchDirection The direction of the touch
   */
  private createEventObject(event: MovePosition, touchDirection: 'y' | 'x'): TouchMove {
    return TouchMove.create({
      history: this.touchHistory,
      touchDirection,
      current: {
        clientX: event.clientX,
        clientY: event.clientY,
      },
      start: {...this.touchStartPosition},
      state: this.touchState,
    });
  }
}
