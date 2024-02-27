import type { HtmlElementsWithValue } from '../../types';

export function isHtmlElementsWithValue(element: Element): element is HtmlElementsWithValue {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  );
}
