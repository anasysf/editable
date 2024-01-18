import type { Config, ConfigColumns } from 'datatables.net-bs5';
import type { Options } from '../types/options';
import { isIDataSrcPost, isDataSrcString } from '../utils/type-guard';

/**
 * Set the default DataTable config.
 * @param options - The options passed.
 * @param columns - The columns generated based on the options.
 *
 * @returns The DataTable's config.
 */
export function defaultConfig(options: Options, columns: ConfigColumns[]): Config {
  const dataSrc = options.dataSrc;

  return {
    ajax: {
      url: !isDataSrcString(dataSrc) ? dataSrc.src : dataSrc,
      method: !isDataSrcString(dataSrc)
        ? isIDataSrcPost(dataSrc)
          ? dataSrc.method
          : 'GET'
        : 'GET',
      data: isIDataSrcPost(dataSrc) ? dataSrc.data : undefined,
      dataSrc: !isDataSrcString(dataSrc) ? dataSrc.prop ?? '' : '',
      contentType: isIDataSrcPost(dataSrc)
        ? dataSrc.format === 'json'
          ? 'application/json; charset=UTF-8'
          : 'application/x-www-form-urlencoded; charset=UTF-8'
        : undefined,
    },
    columns,
  };
}
