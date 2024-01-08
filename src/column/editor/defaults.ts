import type { IEditor, EditorType } from '../types';
import type { JSONValues } from '@/types';
import type Column from '@/column';

export function defaultEditorOptions<
  T extends EditorType = EditorType,
  TData extends Record<string, JSONValues> = Record<string, never>,
>(editorOptions?: IEditor<T>, column?: Column<TData>): IEditor<T> {
  if (column && !editorOptions)
    return {
      type: column.type === 'list-stc' ? 'list-stc' : 'string',
      disabled: false,
      required: true,
    } as IEditor<T>;
  else if (!column && editorOptions)
    return {
      type: 'string',
      disabled: false,
      required: true,
    } as IEditor<T>;
  else return editorOptions as IEditor<T>;
}
