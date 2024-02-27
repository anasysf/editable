import type { Config, ConfigColumns } from 'datatables.net-bs5';
import type { Options } from '../types/options';
import { isDataSrcPostObj, isDataSrcString } from '../utils/type-guard';

/**
 * Set the default DataTable config.
 * @param options - The options passed.
 * @param columns - The columns generated based on the options.
 *
 * @returns The DataTable's config.
 */
export function defaultConfig(options: Options<boolean>, columns: ConfigColumns[]): Config {
  const { dataSrc, rowId } = options;

  const url = isDataSrcString(dataSrc) ? dataSrc : dataSrc.src;
  const method = isDataSrcString(dataSrc)
    ? 'GET'
    : isDataSrcPostObj(dataSrc)
      ? dataSrc.method
      : 'GET';
  const data = isDataSrcPostObj(dataSrc) ? dataSrc.data : undefined;
  const contentType = isDataSrcPostObj(dataSrc)
    ? dataSrc.format === 'json'
      ? 'application/json; charset=UTF-8'
      : 'application/x-www-form-urlencoded; charset=UTF-8'
    : undefined;

  return {
    ajax: {
      url,
      method,
      data,
      dataSrc: isDataSrcString(dataSrc) ? '' : dataSrc.prop ?? '',
      contentType,
    },
    columns,
    rowId,
  };
}
