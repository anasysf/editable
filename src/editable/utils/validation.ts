import { isTableElement, isValidId } from './assert';

export function validateTableElement(id: Element['id']): HTMLTableElement {
  isValidId(id);

  const element = document.getElementById(id);
  if (!element) throw new ReferenceError(`Could not find an element with the id: ${id}.`);

  isTableElement(element);
  return element;
}
