import type { IDataOptions } from './types';
import { isObject, isArray } from '@utils';

export function isIDataOptionsListStc(
  dataOptions: unknown,
): dataOptions is IDataOptions<'list-stc'> {
  return (
    isObject(dataOptions) &&
    'type' in dataOptions &&
    dataOptions.type === 'list-stc' &&
    'data' in dataOptions &&
    isArray(dataOptions.data)
  );
}
