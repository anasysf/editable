import type { EditorType } from '../editor/types/options';
import { defaultOptions } from './defaults/options';
import type { FieldType, NormalizedOptions, Options } from './types/options';

/**
 * Class representing a field instance.
 * @typeParam T - The field type.
 */
export default class Field<T extends FieldType, E extends keyof EditorType> {
  /** The options passed to the Field instance. */
  public readonly options: NormalizedOptions<T, E>;

  /**
   * Initiate a new Field instance.
   * @param options - The options used by the Field instance.
   */
  public constructor(options: Options<T, E>) {
    // Set the default options.
    const opts = defaultOptions(options);

    // Set the options.
    this.options = opts;
  }
}
