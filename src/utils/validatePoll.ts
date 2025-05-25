// src/utils/validatePoll.ts

import type { Poll, Option } from '@/types/poll';

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePoll(poll: {
  title: string;
  options: string[];
}): ValidationResult {
  const errors: string[] = [];

  // Validate title
  if (!poll.title || poll.title.trim().length === 0) {
    errors.push('Poll title is required.');
  }

  // Validate options - at least 2 unique, non-empty options
  const cleanedOptions = poll.options
    .map((opt) => opt.trim())
    .filter((opt) => opt.length > 0);

  const uniqueOptions = Array.from(new Set(cleanedOptions));

  if (uniqueOptions.length < 2) {
    errors.push('At least two unique options are required.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
