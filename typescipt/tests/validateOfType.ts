export function validateOfType<T>(asFunction: (value: object) => T | null, value: object, validate: (value: T) => void): void {
  let specificValue = asFunction(value);
  if (specificValue == null) {
    throw new Error(
      `Value '${value.constructor.name}' should be of type '${asFunction.name}'`);
  }

  validate(specificValue);
}