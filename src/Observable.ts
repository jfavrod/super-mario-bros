export class Observable<T> {
  private observers: Array<(data: T) => unknown> = [];

  public addObserver = (obs: (data: T) => unknown) => {
    const idx = (this.observers.push(obs) - 1);

    return () => this.observers.splice(idx, 1);
  };

  public notify = (data: T) => {
    this.observers.forEach((obs) => obs(data));
  }
}
