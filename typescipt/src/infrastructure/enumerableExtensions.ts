
export function any<TItem>(array: Array<TItem>, where: (value: TItem) => boolean = null): boolean {
  for (const item of array) {
    if (where == null || where(item)) return true;
  }
  return false;
}

export function firstOrDefault<TItem>(array: ReadonlyArray<TItem>, where: ((value: TItem) => boolean) | null = null): TItem | null {

  if (where == null) return array.length > 0 ? array[0] : null;

  for (const item of array) {
    if (where(item)) return item;
  }
  return null;
}

export function singleOrDefault<TItem>(array: ReadonlyArray<TItem>, where: ((value: TItem) => boolean) | null = null): TItem | null {
  if (where == null) {
    if (array.length > 1) throw new Error("More as one element found in array.");
    return array.length == 1 ? array[0] : null;
  }
  let value: TItem | null = null;
  for (const item of array) {
    if (where(item)) {
      if (value == null) {
        value = item;
      } else {
        throw new Error("More as one element found in array.");
      }
    }
  }
  return value;
}

export function lastOrDefault<TItem>(array: ReadonlyArray<TItem>, where: ((value: TItem) => boolean) | null = null): TItem | null {

  if (where == null) return array.length > 0 ? array[array.length - 1] : null;

  for (let i = array.length - 1; i >= 0; i--){
    const item = array[i];
    if (where(item)) return item;
  }
  return null;
}

export function forEach<TItem>(array: ReadonlyArray<TItem>, action: (value: TItem) => void): ReadonlyArray<TItem> {
  for (const value of array) {
    action(value);
  }
  return array;
}

export function contains<TItem>(array: ReadonlyArray<TItem>, value: TItem): boolean {
  for (const item of array) {
    if (item == value) return true;
  }
  return false;
}

export function where<TItem>(array: ReadonlyArray<TItem>, predicate: (value: TItem) => void): ReadonlyArray<TItem> {
  const results = [];
  for (const item of array) {
    if (predicate(item)) {
      results.push(item);
    }
  }
  return results;
}