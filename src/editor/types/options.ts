import type { HtmlElementsWithValue, HtmlInputs } from '../../types';
import type Checkbox from '../input/checkbox';
import type StringInput from '../input/string-input';
import type SelectStatic from '../select/select-static';

// Type EditorTypes = 'string' | 'number' | 'text';

export type EditorTypeMap = {
  readonly string: HTMLInputElement;
  readonly number: HTMLInputElement;
  readonly text: HTMLTextAreaElement;
  readonly checkbox: HTMLInputElement;
  readonly 'select-static': HTMLSelectElement;
};

export type EditorInstanceMap = {
  readonly string: StringInput;
  readonly number: StringInput;
  readonly text: StringInput;
  readonly checkbox: Checkbox;
  readonly 'select-static': SelectStatic;
};

export type OptionsBase = {
  readonly className?: HtmlElementsWithValue['className'];
  readonly required?: HtmlElementsWithValue['required'];
  readonly readonly?: HtmlInputs['readOnly'];
  readonly disabled?: HtmlElementsWithValue['disabled'];
};
