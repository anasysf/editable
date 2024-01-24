import type { HTMLElementsWithValue } from '../../types';

export function isHTMLElementsWithValue(element: Element): element is HTMLElementsWithValue {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  );
}
