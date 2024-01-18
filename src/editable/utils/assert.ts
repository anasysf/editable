import type { TableID } from '../../types';

export function isTableElement(element: Element): asserts element is HTMLTableElement {
  if (!(element instanceof HTMLTableElement))
    throw new TypeError(
      `Expected the element with the id: ${
        element.id
      } to be a <table>, instead received: <${element.nodeName.toLowerCase()}>.`,
    );
}

export function isValidID(id: Element['id']): asserts id is TableID {
  if (id.trim().length === 0)
    throw new SyntaxError('Expected a valid HTML Element id, instead received an empty string.');
}
