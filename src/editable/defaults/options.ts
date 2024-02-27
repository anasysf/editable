import { isString } from '../../utils/type-guard';
import type { NormalizedOptions, Options } from '../types/options';
import type { DataSrc, DataSrcMethod } from '../types/options/dataSrc';
import type { IconMap, IconSrc } from '../types/options/iconMap';
import type { UpdateDataSrc, UpdateDataSrcObj } from '../types/options/updateDataSrc';
import {
  isDataSrcGetObj,
  isDataSrcPostObj,
  isDataSrcString,
  isEditableOptions,
} from '../utils/type-guard';

function defaultDataSrc<T extends DataSrcMethod>(dataSrc: DataSrc<T>): DataSrc<DataSrcMethod> {
  if (isDataSrcGetObj(dataSrc))
    return {
      src: dataSrc.src,
      method: dataSrc.method,
      prop: dataSrc.prop ?? '',
    };
  if (isDataSrcString(dataSrc))
    return {
      src: dataSrc,
      method: 'GET',
      prop: '',
    };
  if (isDataSrcPostObj(dataSrc))
    return {
      src: dataSrc.src,
      method: dataSrc.method,
      prop: dataSrc.prop ?? '',
      data: dataSrc.data,
      format: dataSrc.format,
    };
  throw new TypeError('The `dataSrc` passed does not follow the correct schema.');
}

function defaultIconMap(iconMap?: IconMap): Required<IconMap> {
  return {
    fa: {
      'edit-row': 'fa-regular fa-pen-to-square',
      'submit-row': 'fa-solid fa-check',
      'delete-row': 'fa-regular fa-trash-can',
      'cancel-row': 'fa-solid fa-xmark',
      ...iconMap?.fa,
    },
  };
}

function defaultUpdateDataSrc(updateDataSrc: UpdateDataSrc): UpdateDataSrcObj {
  if (isString(updateDataSrc))
    return {
      src: updateDataSrc,
      method: 'PUT',
      format: 'json',
      prop: 'result.content',
    };
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
  const { fields, buttons, deleteDataSrc, postDataSrc, rowId } = options;
  const dataSrc = defaultDataSrc(options.dataSrc);
  const iconSrc = options.iconSrc ?? ('fa' as IconSrc);
  const iconMap = defaultIconMap(options.iconMap);
  const editable = (options.editable ?? true) as E;
  const updateDataSrc = isEditableOptions(options) && options.updateDataSrc;

  /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions */
  return {
    ...(updateDataSrc && { updateDataSrc: defaultUpdateDataSrc(updateDataSrc) }),
    buttons,
    dataSrc,
    deleteDataSrc,
    editable,
    iconMap,
    iconSrc,
    postDataSrc,
    rowId,
    fields,
  } as NormalizedOptions<E>;
}
