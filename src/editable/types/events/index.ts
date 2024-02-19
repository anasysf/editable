export enum Events {
  UPDATED = 'updated',
  DELETE = 'delete',
}

/* eslint-disable-next-line */
type DeleteEvent = {
  readonly deleteRow: (confirmDelete?: boolean) => Promise<void>;
};

export interface EventMap {
  [key: PropertyKey]: Record<PropertyKey, unknown>;

  [Events.UPDATED]: {
    readonly test: string;
  };

  readonly [Events.DELETE]: DeleteEvent;
}
