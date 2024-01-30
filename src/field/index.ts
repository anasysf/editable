import type { FieldType, Options, NormalizedOptions } from './types/options';
import type { EditorType } from '../editor/types/options';
import { defaultOptions } from './defaults/options';

/**
 * Class representing a field instance.
 * @typeParam T - The field type.
 */
export default class Field<T extends FieldType, E extends keyof EditorType> {
  /** The options passed to the Field instance. */
  private readonly _options: NormalizedOptions<T, E>;

  /**
   * Initiate a new Field instance.
   * @param options - The options used by the Field instance.
   */
  public constructor(options: Options<T, E>) {
    // Set the default options.
    const opts = defaultOptions(options);

    // Set the options.
    this._options = opts;
  }

  /**
   * Get the options.
   *
   * @returns The options used by this instance.
   */
  public get options(): NormalizedOptions<T, E> {
    return this._options;
  }
}
