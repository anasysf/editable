export enum Events {
  UPDATED = 'updated',
  DELETE = 'delete',
}

type DeleteEvent = {
  readonly deleteRow: (confirmDelete?: boolean) => Promise<void>;
};

export type EventMap = {
  [key: PropertyKey]: Record<PropertyKey, unknown>;

  [Events.UPDATED]: {
    readonly test: string;
  };

  readonly [Events.DELETE]: DeleteEvent;
};
