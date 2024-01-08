import { isObject } from '@utils';
import type { IEditor } from '../types';

export function isIEditorString(
  editorOptions: unknown,
): editorOptions is IEditor<'string' | 'text' | 'email'> {
  return (
    isObject(editorOptions) &&
    'type' in editorOptions &&
    (editorOptions.type === 'string' ||
      editorOptions.type === 'text' ||
      editorOptions.type === 'email') &&
    !('max' in editorOptions) &&
    !('min' in editorOptions) &&
    !('step' in editorOptions)
  );
}

export function isIEditorNumber(
  editorOptions: unknown,
): editorOptions is IEditor<'number' | 'money' | 'money-3'> {
  return (
    isObject(editorOptions) &&
    'type' in editorOptions &&
    (editorOptions.type === 'number' ||
      editorOptions.type === 'money' ||
      editorOptions.type === 'money-3') &&
    !('pattern' in editorOptions) &&
    !('maxLength' in editorOptions)
  );
}

export function isIEditorListStc(
  editorOptions: unknown,
): editorOptions is IEditor<'list-stc'> {
  console.log(editorOptions);
  return (
    isObject(editorOptions) && 'type' in editorOptions && editorOptions.type === 'list-stc'
  );
}
