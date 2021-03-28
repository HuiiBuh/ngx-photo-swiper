/**
 * Version 3.0.3
 * Copyright george byte (https://github.com/georgebyte/rxjs-observable-store)
 * MIT licenced
 * Copied because the library caused angular not to build.
 * Not removed to avoid the ts-toolkit dependency.
 */

import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

type Index = string | number | symbol;

export class Store<S extends object> {
  public state$: BehaviorSubject<S>;

  protected constructor(initialState: S) {
    this.state$ = new BehaviorSubject(initialState);
  }

  public get state(): S {
    return this.state$.getValue();
  }

  public setState(nextState: S): void {
    this.state$.next(nextState);
  }

  public onChanges<T>(...path: Index[]): Observable<T> {
    return this.state$.pipe(
      map(state =>
        path.reduce((result, part) => {
          if (result === undefined || result === null) {
            return undefined;
          }
          // @ts-ignore
          return result[part];
        }, state),
      ),
      distinctUntilChanged(),
    ) as unknown as Observable<T>;
  }

  public patchState<T>(value: T, ...path: Index[]): void {
    if (path.length < 1) {
      return;
    }
    this.setState(this.getUpdatedState(value, this.state, path));
  }

  // tslint:disable-next-line:no-any
  private getUpdatedState(value: any, stateSubtree: any, path: Index[]): any {
    const key = path[0];
    if (path.length === 1) {
      return {
        ...stateSubtree,
        [key]: value,
      };
    }
    if (stateSubtree[key] === undefined || stateSubtree[key] === null) {
      return {
        ...stateSubtree,
        [key]: this.createStateSubtree(value, path.slice(1)),
      };
    }
    return {
      ...stateSubtree,
      [key]: this.getUpdatedState(
        value,
        stateSubtree[key],
        path.slice(1),
      ),
    };
  }

  // tslint:disable-next-line:no-any
  private createStateSubtree(value: any, path: Index[]): any {
    const key = path[0];
    if (path.length === 1) {
      return {
        [key]: value,
      };
    }
    return {
      [key]: this.createStateSubtree(value, path.slice(1)),
    };
  }
}
