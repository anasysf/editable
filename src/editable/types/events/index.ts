export enum Events {
  UPDATED = 'updated',
  DELETE = 'delete',
}

/* eslint-disable-next-line */
type DeleteEvent = {
  readonly deleteCB: (deleteConfirmed: boolean) => Promise<boolean>;
};

export interface EventMap {
  [key: PropertyKey]: Record<PropertyKey, unknown>;

  [Events.UPDATED]: {
    readonly test: string;
  };

  readonly [Events.DELETE]: DeleteEvent;
}
