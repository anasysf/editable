import { isTableElement, isValidID } from './assert';

export function validateTableElement(id: Element['id']): HTMLTableElement {
  isValidID(id);

  const element = document.getElementById(id);
  if (!element) throw new ReferenceError(`Could not find a single element with the id: ${id}.`);

  isTableElement(element);
  return element;
}
