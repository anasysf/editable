export default abstract class EventEmitter<
  EventMap extends Record<string, unknown>,
> extends EventTarget {
  public emit<E extends Extract<keyof EventMap, string>, D extends EventMap[E]>(
    evt: E,
    details: D,
  ): this {
    super.dispatchEvent(new CustomEvent<D>(evt, { detail: details }));

    return this;
  }

  protected on<E extends Extract<keyof EventMap, string>, D extends EventMap[E]>(
    evt: E,
    listener: (evt: D) => void,
    options?: AddEventListenerOptions,
  ): this {
    super.addEventListener(
      evt,
      (evt): void => {
        listener((evt as CustomEvent<D>).detail);
      },
      options,
    );

    return this;
  }

  protected off<E extends Extract<keyof EventMap, string>, D extends EventMap[E]>(
    evt: E,
    listener: (evt: D) => void,
    options?: AddEventListenerOptions,
  ): this {
    super.removeEventListener(
      evt,
      (evt): void => {
        listener((evt as CustomEvent<D>).detail);
      },
      options,
    );

    return this;
  }
}
