import type { DataSrc, DataSrcMethod } from '../types/options/dataSrc';
import type { NormalizedOptions, Options } from '../types/options';
import type { IconMap, IconSrc } from '../types/options/iconMap';
import { isIDataSrcGet, isDataSrcString, isIDataSrcPost } from '../utils/type-guard';

function defaultDataSrc<T extends DataSrcMethod>(dataSrc: DataSrc<T>): DataSrc<T> {
  if (isIDataSrcGet(dataSrc))
    return {
      src: dataSrc.src,
      method: dataSrc.method,
      prop: dataSrc.prop ?? '',
    } as DataSrc<T>;
  else if (isDataSrcString(dataSrc))
    return {
      src: dataSrc,
      method: 'GET',
      prop: '',
    } as DataSrc<T>;
  else if (isIDataSrcPost(dataSrc))
    return {
      src: dataSrc.src,
      method: dataSrc.method,
      prop: dataSrc.prop ?? '',
      data: dataSrc.data,
      format: dataSrc.format,
    } as DataSrc<T>;
  else throw new TypeError('The `dataSrc` passed does not follow the correct schema.');
}

function defaultIconMap(iconMap?: IconMap): Required<IconMap> {
  return {
    fa: {
      'edit-row': 'fa-regular fa-pen-to-square',
      'submit-row': 'fa-solid fa-check',
      ...iconMap?.fa,
    },
  };
}

export function defaultOptions(options: Options): NormalizedOptions {
  const fields = options.fields;
  const editable = options.editable ?? (true as const);
  const dataSrc = defaultDataSrc(options.dataSrc);
  const iconSrc = options.iconSrc ?? ('fa' as IconSrc);
  const iconMap = defaultIconMap(options.iconMap);

  return {
    ...options,
    editable,
    dataSrc,
    fields,
    iconSrc,
    iconMap,
  };
}
