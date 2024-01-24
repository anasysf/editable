import type { DataSrc, DataSrcMethod } from '../types/options/dataSrc';
import type { NormalizedOptions, Options } from '../types/options';
import type { IconMap, IconSrc } from '../types/options/iconMap';
import {
  isIDataSrcGet,
  isDataSrcString,
  isIDataSrcPost,
  isEditableOptions,
} from '../utils/type-guard';
import type { IUpdateDataSrc, UpdateDataSrc } from '../types/options/updateDataSrc';
import { isString } from '../../utils/type-guard';

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
      'delete-row': 'fa-regular fa-trash-can',
      ...iconMap?.fa,
    },
  };
}

function defaultUpdateDataSrc(updateDataSrc: UpdateDataSrc): IUpdateDataSrc {
  if (isString(updateDataSrc))
    return {
      src: updateDataSrc,
      method: 'PUT',
      format: 'json',
      prop: 'result.content',
    };
  else
    return {
      src: updateDataSrc.src,
      method: updateDataSrc.method ?? 'PUT',
      format: updateDataSrc.format ?? 'json',
      prop: updateDataSrc.prop ?? 'result.content',
    };
}

export function defaultOptions<E extends boolean | undefined>(
  options: Options<E>,
): NormalizedOptions<E> {
  const fields = options.fields;
  const buttons = options.buttons;
  const editable = (options.editable ?? true) as E;
  const dataSrc = defaultDataSrc(options.dataSrc);
  const iconSrc = options.iconSrc ?? ('fa' as IconSrc);
  const iconMap = defaultIconMap(options.iconMap);
  const updateDataSrc = isEditableOptions(options) && options.updateDataSrc;

  return {
    buttons,
    dataSrc,
    editable,
    fields,
    iconMap,
    iconSrc,
    ...(updateDataSrc && { updateDataSrc: defaultUpdateDataSrc(updateDataSrc) }),
  } as NormalizedOptions<E>;
}
