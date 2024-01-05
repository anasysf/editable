import type { IEditor, EditorType } from '../types';

export function defaultEditorOptions<T extends EditorType = EditorType>(
  editorOptions?: IEditor<T>,
): IEditor<T> {
  if (!editorOptions)
    return {
      type: 'string',
      disabled: false,
      required: true,
    } as IEditor<T>;

  return editorOptions;
}
