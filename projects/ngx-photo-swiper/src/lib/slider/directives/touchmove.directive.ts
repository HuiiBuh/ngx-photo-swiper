import { Directive, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { MovePosition } from '../../models/touchmove';
import { TouchMove } from './touchmove.directive.event';

@Directive({
  selector: '[photoTouchmove]',
})
export class TouchmoveDirective implements OnInit, OnDestroy {
  private static moveThreshold: number = 5;

  @Output() public vSwipe: EventEmitter<TouchMove> = new EventEmitter();
  @Output() public hSwipe: EventEmitter<TouchMove> = new EventEmitter();

  private destroy$: Subject<boolean> = new Subject<boolean>();
  private moveHistory: MovePosition[] = [];

  // The starting point of the move
  private moveStartPosition: MovePosition = {clientX: 0, clientY: 0};
  private moveState: 'start' | 'move' | 'end' = 'start';

  // Handler placeholder which handles the touches if it is clear what type they have
  private moveHandler: (e: MovePosition, b?: undefined | 'end') => void;

  private touchMoveSubscription!: Subscription | null;
  private mouseMoveSubscription!: Subscription | null;

  constructor(
    private element: ElementRef,
    private ngZone: NgZone) {

    // Handler
    this.moveHandler = () => null;
  }

  /**
   * Subscribe to move events of this element
   */
  public ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent<TouchEvent>(this.element.nativeElement, 'touchstart', {passive: false}).pipe(
        filter(e => e.touches.length === 1),
        tap(e => e.preventDefault()),
        map(e => e.touches[0]),
        takeUntil(this.destroy$)
      ).subscribe(this.handleMoveStart.bind(this));

      fromEvent<TouchEvent>(this.element.nativeElement, 'touchend', {passive: false}).pipe(
        filter(e => e.changedTouches.length > 0),
        tap(e => e.preventDefault()),
        map(e => e.changedTouches[0]),
        takeUntil(this.destroy$)
      ).subscribe(this.handleMoveEnd.bind(this));
    });

    fromEvent<MouseEvent>(this.element.nativeElement, 'mousedown').pipe(
      tap(e => e.stopPropagation()),
      takeUntil(this.destroy$)
    ).subscribe(this.handleMoveStart.bind(this));
    fromEvent<MouseEvent>(this.element.nativeElement, 'mouseup').pipe(
      tap(e => e.stopPropagation()),
      takeUntil(this.destroy$)
    ).subscribe(this.handleMoveEnd.bind(this));
  }

  /**
   * Remove all listeners
   */
  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * Handler the move start (only react to wipe not to zoom, ...)
   */
  private handleMoveStart(event: MovePosition): void {
    this.moveStartPosition.clientX = event.clientX;
    this.moveStartPosition.clientY = event.clientY;

    if (this.touchMoveSubscription) this.touchMoveSubscription.unsubscribe();
    if (this.mouseMoveSubscription) this.mouseMoveSubscription.unsubscribe();

    this.touchMoveSubscription = fromEvent<TouchEvent>(this.element.nativeElement, 'touchmove', {passive: false}).pipe(
      map(e => e.touches[0]),
      takeUntil(this.destroy$)
    ).subscribe(this.handleMove.bind(this));

    this.mouseMoveSubscription = fromEvent<MouseEvent>(this.element.nativeElement, 'mousemove').pipe(
      takeUntil(this.destroy$)
    ).subscribe(this.handleMove.bind(this));
  }

  /**
   * Handle the mouse move event
   * Only gets called if the move start was not a multi-touch
   */
  private handleMove(event: MovePosition): void {
    // Get the fist touch
    const xDiff: number = Math.abs(event.clientX - this.moveStartPosition.clientX);
    const yDiff: number = Math.abs(event.clientY - this.moveStartPosition.clientY);

    // Get the max of the touch
    const max = Math.max(xDiff, yDiff);

    // Check if the move is over the threshold
    if (max > TouchmoveDirective.moveThreshold) {
      this.moveState = 'start';

      // Check if it is a vertical or a horizontal touch
      this.moveHandler = max === yDiff ? this.handleVertical.bind(this) : this.handleHorizontal.bind(this);

      // Unsubscribe the touchMove handler
      this.touchMoveSubscription && this.touchMoveSubscription.unsubscribe();
      this.mouseMoveSubscription && this.mouseMoveSubscription.unsubscribe();

      // Pass the current event to the touch handler
      this.moveHandler(event);
      this.moveHistory.push(event);
      this.moveState = 'move';

      // And add the handler which is responsible for the vertical or the horizontal event binding
      this.touchMoveSubscription = fromEvent<TouchEvent>(this.element.nativeElement, 'touchmove', {passive: false}).pipe(
        map(e => e.touches[0]),
        takeUntil(this.destroy$)
      ).subscribe(this.moveHandler.bind(this));

      this.mouseMoveSubscription = fromEvent<MouseEvent>(this.element.nativeElement, 'mousemove').pipe(
        takeUntil(this.destroy$)
      ).subscribe(this.moveHandler.bind(this));
    }
  }

  /**
   * Remove the move subscription
   */
  private handleMoveEnd(event: MovePosition): void {
    this.moveState = 'end';
    this.moveHandler(event);
    this.moveHistory = [];
    this.moveHandler = () => null;
    this.touchMoveSubscription && this.touchMoveSubscription.unsubscribe();
    this.touchMoveSubscription = null;
    this.mouseMoveSubscription && this.mouseMoveSubscription.unsubscribe();
    this.mouseMoveSubscription = null;
  }

  /**
   * Handle the vertical move event
   */
  private handleVertical(event: MovePosition): void {
    this.moveHistory.push(event);
    this.vSwipe.emit(this.createEventObject(event, 'y'));
  }

  /**
   * Handle the horizontal move event
   */
  private handleHorizontal(event: MovePosition): void {
    this.moveHistory.push(event);
    this.hSwipe.emit(this.createEventObject(event, 'x'));
  }

  /**
   * Create the event object
   * @param event The move event
   * @param moveDirection The direction of the move
   */
  private createEventObject(event: MovePosition, moveDirection: 'y' | 'x'): TouchMove {
    return TouchMove.create({
      history: this.moveHistory,
      touchDirection: moveDirection,
      current: event,
      start: {...this.moveStartPosition},
      state: this.moveState,
    });
  }
}
