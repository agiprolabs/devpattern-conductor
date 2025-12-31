/**
 * Validation utilities for tool arguments and runtime type checking
 */

/**
 * Validates that a value is a string or undefined
 */
export function validateOptionalString(
  value: unknown,
  fieldName: string
): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === "string") {
    return value;
  }
  throw new Error(
    `Invalid argument: ${fieldName} must be a string, got ${typeof value}`
  );
}

/**
 * Validates that a value is a string
 */
export function validateString(value: unknown, fieldName: string): string {
  if (typeof value === "string") {
    return value;
  }
  throw new Error(
    `Invalid argument: ${fieldName} must be a string, got ${typeof value}`
  );
}

/**
 * Validates that a value is a boolean or undefined
 */
export function validateOptionalBoolean(
  value: unknown,
  fieldName: string
): boolean | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === "boolean") {
    return value;
  }
  throw new Error(
    `Invalid argument: ${fieldName} must be a boolean, got ${typeof value}`
  );
}

/**
 * Validates that a value is a number or undefined
 */
export function validateOptionalNumber(
  value: unknown,
  fieldName: string
): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }
  throw new Error(
    `Invalid argument: ${fieldName} must be a number, got ${typeof value}`
  );
}
