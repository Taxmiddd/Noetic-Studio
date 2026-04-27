/**
 * 🔒 Input validation utilities
 * Sanitizes and validates user inputs
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize string input - removes HTML/script tags
 */
export function sanitizeString(input: string, maxLength = 1000): string {
  if (typeof input !== 'string') return '';
  
  // Limit length
  let sanitized = input.substring(0, maxLength).trim();
  
  // Remove potentially dangerous characters
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
  
  return sanitized;
}

/**
 * Validate and sanitize invoice input
 */
export function validateInvoiceInput(data: unknown) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request body');
  }

  const input = data as Record<string, unknown>;
  
  const errors: string[] = [];

  // client_name
  if (!input.client_name || typeof input.client_name !== 'string') {
    errors.push('client_name is required and must be a string');
  } else if (input.client_name.length > 255) {
    errors.push('client_name must be less than 255 characters');
  }

  // client_email
  if (!input.client_email || typeof input.client_email !== 'string') {
    errors.push('client_email is required and must be a string');
  } else if (!isValidEmail(input.client_email)) {
    errors.push('client_email must be a valid email address');
  }

  // project_name
  if (!input.project_name || typeof input.project_name !== 'string') {
    errors.push('project_name is required and must be a string');
  } else if (input.project_name.length > 255) {
    errors.push('project_name must be less than 255 characters');
  }

  // amount
  if (input.amount === undefined || input.amount === null) {
    errors.push('amount is required');
  } else {
    const amount = parseFloat(String(input.amount));
    if (isNaN(amount) || amount <= 0) {
      errors.push('amount must be a positive number');
    } else if (amount > 999999) {
      errors.push('amount must be less than 999999');
    }
  }

  // currency
  if (!input.currency || typeof input.currency !== 'string') {
    errors.push('currency is required and must be a string');
  } else {
    const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'BDT', 'INR'];
    if (!validCurrencies.includes(input.currency.toUpperCase())) {
      errors.push(`currency must be one of: ${validCurrencies.join(', ')}`);
    }
  }

  // notes (optional)
  if (input.notes && typeof input.notes !== 'string') {
    errors.push('notes must be a string');
  } else if (input.notes && (input.notes as string).length > 2000) {
    errors.push('notes must be less than 2000 characters');
  }

  if (errors.length > 0) {
    throw new Error(errors.join('; '));
  }

  return {
    client_name: sanitizeString(input.client_name as string, 255),
    client_email: (input.client_email as string).toLowerCase().trim(),
    project_name: sanitizeString(input.project_name as string, 255),
    amount: parseFloat(String(input.amount)),
    currency: (input.currency as string).toUpperCase(),
    notes: input.notes ? sanitizeString(input.notes as string, 2000) : '',
  };
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Rate limiting check (in-memory, basic implementation)
 * For production, use Redis or similar
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests = 10,
  windowMs = 60000
): boolean {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Sanitize object for logging (removes sensitive data)
 */
export function sanitizeForLog(obj: Record<string, unknown>) {
  const sensitive = ['password', 'token', 'secret', 'key', 'auth'];
  const sanitized = { ...obj };

  for (const key in sanitized) {
    if (sensitive.some(s => key.toLowerCase().includes(s))) {
      sanitized[key] = '[REDACTED]';
    }
  }

  return sanitized;
}
