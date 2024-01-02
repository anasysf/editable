export function getTrFromTarget(target: HTMLElement): HTMLTableRowElement {
  if (!(target instanceof HTMLTableRowElement)) {
    const tr = target.closest('tr');
    if (!tr)
      throw new ReferenceError('Could not find the closest <tr> element to the target.');

    return tr;
  }

  return target;
}

export function getElementByName<T extends HTMLElement = HTMLElement>(
  source: HTMLElement,
  name: string,
): T {
  const element = source.querySelector<T>(`[name="${name}"]`);
  if (!element) throw new ReferenceError(`Could not find an element with the name: ${name}.`);

  return element;
}

export function getTrIndex(tr: HTMLTableRowElement): number {
  return tr.rowIndex === -1 ? tr.rowIndex : tr.rowIndex - 1;
}

export function getCellsInTr(tr: HTMLTableRowElement): HTMLTableCellElement[] {
  const tds = tr.cells;
  if (tds.length === 0)
    throw new RangeError(
      `Could not find a single <td> on this <tr> element. row-index: ${getTrIndex(tr)}.`,
    );

  return Array.from(tds);
}

export function getElementNameAttribute(element: HTMLElement): string | undefined {
  const elementName = element.getAttribute('name');
  if (!elementName || elementName.trim().length === 0) return;

  return elementName;
}

export function formatNumber(
  input: unknown,
  decimals: number,
  decimal_point: string,
  separator: string,
): string {
  if (isNaN(Number(input))) throw new TypeError(`${String(input)} is not a number.`);

  const number = Number(input).toFixed(decimals).toString();
  const x = number.split('.');
  let x1 = x[0];

  if (isNaN(Number(x1))) throw new TypeError(`${x1} is not a number.`);

  x1 = x1.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return x1 + (x.length > 1 ? `${decimal_point}${x[1]}` : '');
}
