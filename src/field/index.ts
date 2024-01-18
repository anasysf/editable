import type { FieldType, Options, NormalizedOptions } from './types/options';
import type { EditorType } from '../editor/types/options';
import { defaultOptions } from './defaults/options';
import type Editor from '../editor';

/**
 * Class representing a field instance.
 * @typeParam T - The field type.
 */
export default class Field<T extends FieldType, E extends EditorType> {
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

  /**
   * Get the field name.
   *
   * @returns The current field name.
   */
  public get name(): string {
    return this.options.name;
  }

  /**
   * Get the field type.
   *
   * @returns The current field type.
   */
  public get type(): T | undefined {
    return this.options.type;
  }

  /**
   * Get if the field is sortable.
   *
   * @returns If the current field is sortable.
   */
  public get sortable(): boolean {
    return this.options.sortable;
  }

  /**
   * Get if the field is visible.
   *
   * @returns If the current field is visible.
   */
  public get visible(): boolean {
    return this.options.visible;
  }

  public get editor(): Editor<E> | undefined {
    return this.options.editor;
  }
}
