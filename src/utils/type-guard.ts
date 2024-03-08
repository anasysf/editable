export function exists<T>(target: T): target is NonNullable<T> {
  return Boolean(target);
}

export function isString(target: unknown): target is string {
  return typeof target === 'string';
}

export function isArray(target: unknown): target is unknown[] {
  return Array.isArray(target);
}

export function isFn(target: unknown): target is (...args: unknown[]) => unknown {
  return target instanceof Function;
}

export function isObject<T extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>>(
  target: unknown,
): target is T {
  return exists(target) && typeof target === 'object' && !isArray(target) && !isFn(target);
}
