import type {
  DataSrc,
  DataSrcMethod,
  IDataSrcPOST,
  IDataSrcGET,
} from '../types/options/dataSrc';
import type { EditableOptions, Options } from '../types/options';
import { exists, isObject, isString } from '../../utils/type-guard';
import { stringNotEmpty } from '../../utils/validation';

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
