import type IconButtonBase from '../../../button/base';
import type { ButtonTypeIconMap } from '../../../button/types';
import type { EditorType } from '../../../editor/types/options';
import type Field from '../../../field';
import type { FieldType } from '../../../field/types/options';
import type { WithRequired } from '../../../types';
import type { DataSrc, DataSrcMethod } from './dataSrc';
import type { DeleteDataSrc } from './deleteDataSrc';
import type { IconMap, IconSrc } from './iconMap';
import type { UpdateDataSrc } from './updateDataSrc';

export interface OptionsBASE<E extends boolean | undefined> {
  readonly editable?: E;

  /**
   * The source the Editable instance uses to retrieve the data.
   * @typeParam T - The HTTP Method 'GET' or 'POST'.
   */
  readonly dataSrc: DataSrc<DataSrcMethod>;

  readonly fields: Field<FieldType, keyof EditorType>[];

  readonly buttons?: IconButtonBase<ButtonTypeIconMap>[];

  readonly iconSrc?: IconSrc;

  readonly iconMap?: IconMap;

  readonly rowId?: string;

  readonly deleteDataSrc?: DeleteDataSrc;
}

export type EditableOptions = OptionsBASE<true> & {
  readonly updateDataSrc: UpdateDataSrc;
};

/**
 * The options passed to the Editable instance.
 */
export type Options<E extends boolean | undefined> = E extends true | undefined
  ? EditableOptions
  : OptionsBASE<E>;
export type NormalizedOptions<E extends boolean | undefined> = E extends true | undefined
  ? WithRequired<Options<E>, 'editable' | 'iconSrc' | 'iconMap' | 'updateDataSrc'>
  : WithRequired<Options<E>, 'editable' | 'iconSrc' | 'iconMap'>;
