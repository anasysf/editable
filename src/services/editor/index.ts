import type BaseEditor from '../../editor/base';
import type Checkbox from '../../editor/input/checkbox';
import type StringInput from '../../editor/input/string-input';
import type SelectStatic from '../../editor/select/select-static';
import { type EditorInstanceMap, type EditorTypeMap } from '../../editor/types/options';

export default class EditorService<
  T extends keyof EditorTypeMap,
  E extends EditorTypeMap[T],
  I extends EditorInstanceMap[T],
> {
  public constructor(private readonly editor: BaseEditor<T, E>) {}

  public get instance(): I {
    if (this.editor.type === 'select-static') return this.editor as unknown as SelectStatic as I;

    if (this.editor.element instanceof HTMLInputElement)
      switch (this.editor.type) {
        case 'string':
        case 'number':
        case 'text':
          return this.editor as unknown as StringInput as I;
        case 'checkbox':
          return this.editor as unknown as Checkbox as I;
        default:
          return this.editor as unknown as StringInput as I;
      }

    return this.editor as unknown as StringInput as I;
  }
}
