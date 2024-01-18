import type Field from '../../../field';
import type { FieldType } from '../../../field/types/options';
import type { EditorType } from '../../../editor/types/options';
import type { WithRequired } from '../../../types';
import type ButtonBase from '../../../button/base';
import type { DataSrc, DataSrcMethod } from './dataSrc';
import type { IconMap, IconSrc } from './iconMap';

/**
 * The options passed to the Editable instance.
 */
export interface Options {
  readonly editable?: boolean;

  /**
   * The source the Editable instance uses to retrieve the data.
   * @typeParam T - The HTTP Method 'GET' or 'POST'.
   */
  readonly dataSrc: DataSrc<DataSrcMethod>;

  readonly fields: Field<FieldType, EditorType>[];

  readonly buttons?: ButtonBase[];

  readonly iconSrc?: IconSrc;

  readonly iconMap?: IconMap;
}

export type NormalizedOptions = WithRequired<Options, 'editable' | 'iconSrc' | 'iconMap'>;
