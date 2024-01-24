export default abstract class EventEmitter<
  M extends Record<PropertyKey, Record<PropertyKey, unknown>>,
> extends EventTarget {
  public emit<K extends Extract<keyof M, string>, D extends M[K] = M[K]>(
    event: K,
    detail: D,
  ): this {
    super.dispatchEvent(new CustomEvent<D>(event, { detail }));
    return this;
  }

  public on<K extends Extract<keyof M, string>, D extends M[K]>(
    event: K,
    listener: (evt: D) => void,
    options?: boolean | AddEventListenerOptions,
  ): this {
    super.addEventListener(
      event,
      (evt): void => {
        listener((evt as CustomEvent<D>).detail);
      },
      options,
    );
    return this;
  }

  public off<K extends Extract<keyof M, string>, D extends M[K]>(
    event: K,
    listener: (evt: D) => void,
    options?: boolean | EventListenerOptions,
  ): this {
    super.removeEventListener(
      event,
      (evt): void => {
        listener((evt as CustomEvent<D>).detail);
      },
      options,
    );
    return this;
  }
}
