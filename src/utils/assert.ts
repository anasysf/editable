export function exists<T extends Exclude<unknown, boolean>>(
  value: T,
): asserts value is Exclude<T, undefined | null> {
  if (!value) throw new ReferenceError('The value given is null or undefined.');
}
