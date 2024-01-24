export enum Events {
  UPDATED = 'updated',
}

export interface EventMap {
  [key: PropertyKey]: Record<PropertyKey, unknown>;

  [Events.UPDATED]: {
    readonly test: string;
  };
}
