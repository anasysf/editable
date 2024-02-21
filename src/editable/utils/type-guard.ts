import type BaseEditor from '../../editor/base';
import Checkbox from '../../editor/input/checkbox';
import type { EditorType } from '../../editor/types/options';
import { exists, isObject, isString } from '../../utils/type-guard';
import { stringNotEmpty } from '../../utils/validation';
import type { EditableOptions, Options } from '../types/options';
import type {
  DataSrc,
  DataSrcMethod,
  IDataSrcGET,
  IDataSrcPOST,
} from '../types/options/dataSrc';

/**
 * Check if the dataSrc property passed is of type IDataSrc 'POST'.
 * @param dataSrc - The dataSrc property.
 *
 * @returns If the dataSrc property passes the tests.
 */
export function isIDataSrcPost(dataSrc: unknown): dataSrc is IDataSrcPOST {
  return (
    isObject(dataSrc) &&
    'src' in dataSrc &&
    isString(dataSrc.src) &&
    stringNotEmpty(dataSrc.src) &&
    'method' in dataSrc &&
    isString(dataSrc.method) &&
    stringNotEmpty(dataSrc.method) &&
    dataSrc.method === 'POST'
  );
}

/**
 * Check if the dataSrc property passed is of type IDataSrc 'GET'.
 * @param dataSrc - The dataSrc property.
 *
 * @returns If the dataSrc property passes the tests.
 */
export function isIDataSrcGet(dataSrc: unknown): dataSrc is IDataSrcGET {
  return (
    isObject(dataSrc) &&
    'src' in dataSrc &&
    isString(dataSrc.src) &&
    stringNotEmpty(dataSrc.src) &&
    (('method' in dataSrc &&
      isString(dataSrc.method) &&
      stringNotEmpty(dataSrc.method) &&
      dataSrc.method === 'GET') ||
      (!('method' in dataSrc) && !('data' in dataSrc) && !('format' in dataSrc)))
  );
}

/**
 * Check if the dataSrc property passed is of type string.
 * @param dataSrc - The dataSrc property.
 *
 * @returns If the dataSrc property passes the tests.
 */
export function isDataSrcString(
  dataSrc: unknown,
): dataSrc is Exclude<DataSrc<DataSrcMethod>, IDataSrcGET | IDataSrcPOST> {
  return isString(dataSrc) && stringNotEmpty(dataSrc);
}

export function isEditableOptions(options: Options<boolean>): options is EditableOptions {
  return !exists(!!options.editable) || (exists(options.editable) && options.editable);
}

export function isCheckboxEditor(
  editor?: BaseEditor<keyof EditorType>,
): editor is BaseEditor<'checkbox'> {
  return (
    !!editor &&
    editor instanceof Checkbox &&
    'activeLabel' in editor.options &&
    'inactiveLabel' in editor.options
  );
}
