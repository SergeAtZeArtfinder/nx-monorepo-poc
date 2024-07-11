export const isNullOrUndefined = <T>(
  value: T | null | undefined
): value is null | undefined => typeof value === 'undefined' || value === null;

export const getErrorMessage = (error: unknown, defaultMessage?: string) => {
  const message = error instanceof Error ? error.message : defaultMessage;

  return message || 'And error occurred';
};

export const isPropertyOf = <T>(
  valueToCheck: unknown,
  propertyToCheckFor: keyof T
): valueToCheck is T => (valueToCheck as T)[propertyToCheckFor] !== undefined;
