export abstract class Observable<K, T> {
  private observers = new Map<K, Array<((data: T) => unknown)>>();

  public addObserver = (key: K, obs: (data: T) => unknown) => {
    let removeIndex = -1;

    if (this.observers.has(key)) removeIndex += this.observers.get(key)!.push(obs);
    else {
      this.observers.set(key, [obs]);
      removeIndex += 1;
    }

    return () => {
      this.observers.get(key)!.splice(removeIndex, 1);
    }
  };

  public notify = (key: K, data: T) => {
    this.observers.get(key)?.forEach((obs) => obs(data));
  };
}
