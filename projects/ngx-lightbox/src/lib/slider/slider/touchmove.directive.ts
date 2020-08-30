import {Directive, DoCheck, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';


export interface Point {
  x: number;
  y: number;
}

export interface TouchMove {
  start: Point;
  current: Point;
}

@Directive({
  selector: '[libTouchmove]',
})
export class TouchmoveDirective implements OnInit, OnDestroy, DoCheck {

  private static touchThreshold: number = 20;

  @Output() hSwipe: EventEmitter<TouchMove> = new EventEmitter();
  @Output() vSwipe: EventEmitter<TouchMove> = new EventEmitter();

  // The element
  private readonly element: ElementRef;

  // The starting point of the touch
  private touchStart: Point = {x: 0, y: 0};

  // Events to unsubscribe
  private touchStartUnsubscribe: () => void;
  private touchMoveUnsubscribe: () => void;
  private touchEndUnsubscribe: () => void;

  // Handler placeholder which handles the touches if it is clear what type they have
  private touchHandler: (e: TouchEvent) => void;

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

  public ngDoCheck(): void {
    console.log('change detection');
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
      e.preventDefault();
      this.touchMoveUnsubscribe = this.renderer2.listen(this.element.nativeElement, 'touchmove', this.handleTouchMove.bind(this));
      this.touchStart.x = e.touches[0].clientX;
      this.touchStart.y = e.touches[0].clientY;
    }
  }

  /**
   * Handle the mouse move event
   * Only gets called if the touch start was not a multitouch
   */
  private handleTouchMove(e: TouchEvent): void {
    e.preventDefault();

    // Get the fist touch
    const touch = e.touches[0];
    const xDiff: number = Math.abs(touch.clientX - this.touchStart.x);
    const yDiff: number = Math.abs(touch.clientY - this.touchStart.y);

    // Get the max of the touch
    const max = Math.max(xDiff, yDiff);

    // Check if the move is over the threshold
    if (max > TouchmoveDirective.touchThreshold) {
      // Check if it is a vertical or a horizontal touch
      if (max === yDiff) {
        this.touchHandler = this.handleVertical.bind(this);
      } else if (max === xDiff) {
        this.touchHandler = this.handleHorizontal.bind(this);
      }
      // Unsubscribe the touchMove handler
      this.touchMoveUnsubscribe();
      // And add the handler which is responsible for the vertical or the horizontal event binding
      this.touchMoveUnsubscribe = this.renderer2.listen(this.element.nativeElement, 'touchmove', this.touchHandler.bind(this));
    }
  }

  /**
   * Remove the touch move subscription
   */
  private handleTouchEnd(e: TouchEvent): void {
    e.preventDefault();
    this.touchMoveUnsubscribe();
    this.touchStartUnsubscribe = () => null;
  }


  /**
   * Handle the vertical touch event
   */
  private handleVertical(e: TouchEvent): void {
    this.hSwipe.emit({
      current: {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      },
      start: {...this.touchStart},
    });
  }

  /**
   * Handle the horizontal touch event
   */
  private handleHorizontal(e: TouchEvent): void {
    this.vSwipe.emit({
      current: {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      },
      start: {...this.touchStart},
    });
  }
}
