import type BaseEditor from '../../editor/base';
import Checkbox from '../../editor/input/checkbox';
import SelectStatic from '../../editor/select/select-static';
import type { EditorTypeMap } from '../../editor/types/options';
import { exists, isObject, isString } from '../../utils/type-guard';
import { stringNotEmpty } from '../../utils/validation';
import type { EditableOptions, Options } from '../types/options';
import type { DataSrc, DataSrcGet, DataSrcMethod, DataSrcPost } from '../types/options/dataSrc';

/**
 * Check if the dataSrc property passed is of type IDataSrc 'POST'.
 * @param dataSrc - The dataSrc property.
 *
 * @returns If the dataSrc property passes the tests.
 */
export function isDataSrcPostObj(dataSrc: unknown): dataSrc is DataSrcPost {
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
export function isDataSrcGetObj(dataSrc: unknown): dataSrc is DataSrcGet {
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
): dataSrc is Exclude<DataSrc<DataSrcMethod>, DataSrcGet | DataSrcPost> {
  return isString(dataSrc) && stringNotEmpty(dataSrc);
}

export function isEditableOptions(options: Options<boolean>): options is EditableOptions {
  return !exists(Boolean(options.editable)) || (exists(options.editable) && options.editable);
}

export function isCheckboxEditor(
  editor?: BaseEditor<keyof EditorTypeMap>,
): editor is BaseEditor<'checkbox'> {
  return (
    Boolean(editor) &&
    editor instanceof Checkbox &&
    'activeLabel' in editor.options &&
    'inactiveLabel' in editor.options
  );
}

export function isSelectStaticEditor(
  editor?: BaseEditor<keyof EditorTypeMap>,
): editor is SelectStatic {
  return Boolean(editor) && editor instanceof SelectStatic;
}
