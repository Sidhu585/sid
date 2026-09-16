import { MAX_CONTRIBUTION, MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH, MIN_CONTRIBUTION } from "./config";

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

function isBlank(value: unknown): value is string {
  return typeof value !== "string" || value.trim().length === 0;
}

/**
 * Strips characters that have no business in a plain-text name or message
 * (control characters, angle brackets used for HTML injection). This is a
 * defense-in-depth measure — the app never renders user content as raw
 * HTML in the first place (React escapes text by default), but sanitizing
 * on the way in keeps stored data clean too.
 */
export function sanitizeText(value: string): string {
  return value
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim();
}

export function validateWish(input: { name: unknown; message: unknown }): ValidationResult {
  const errors: Record<string, string> = {};

  if (isBlank(input.name)) {
    errors.name = "Please tell us who this wish is from.";
  } else if ((input.name as string).trim().length > MAX_NAME_LENGTH) {
    errors.name = `Name should be under ${MAX_NAME_LENGTH} characters.`;
  }

  if (isBlank(input.message)) {
    errors.message = "Write a quick birthday message.";
  } else if ((input.message as string).trim().length > MAX_MESSAGE_LENGTH) {
    errors.message = `Message should be under ${MAX_MESSAGE_LENGTH} characters.`;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateContribution(input: {
  name: unknown;
  amount: unknown;
  message?: unknown;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (isBlank(input.name)) {
    errors.name = "Please tell us who's contributing.";
  } else if ((input.name as string).trim().length > MAX_NAME_LENGTH) {
    errors.name = `Name should be under ${MAX_NAME_LENGTH} characters.`;
  }

  const amountNum = Number(input.amount);
  if (!input.amount || Number.isNaN(amountNum)) {
    errors.amount = "Enter a valid amount.";
  } else if (!Number.isFinite(amountNum) || amountNum <= 0) {
    errors.amount = "Amount must be a positive number.";
  } else if (amountNum < MIN_CONTRIBUTION) {
    errors.amount = `Minimum contribution is ₹${MIN_CONTRIBUTION}.`;
  } else if (amountNum > MAX_CONTRIBUTION) {
    errors.amount = `That's a bit much for this MVP — max is ₹${MAX_CONTRIBUTION}.`;
  } else if (!Number.isInteger(amountNum)) {
    errors.amount = "Please use a whole rupee amount.";
  }

  if (input.message !== undefined && input.message !== null && input.message !== "") {
    if ((input.message as string).trim().length > MAX_MESSAGE_LENGTH) {
      errors.message = `Message should be under ${MAX_MESSAGE_LENGTH} characters.`;
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
