/**
 * 🔒 Environment variable validation
 * Ensures all required environment variables are present and valid
 */

export function validateEnvironmentVariables() {
  const required = {
    NEXT_PUBLIC_SUPABASE_URL: 'Supabase project URL',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'Supabase anonymous key',
    SUPABASE_SERVICE_ROLE_KEY: 'Supabase service role key (SECRET)',
  };

  const optional = {
    ADMIN_EMAILS: 'Comma-separated admin email addresses',
    LEMON_SQUEEZY_API_KEY: 'Lemon Squeezy API key for payments',
    LEMON_SQUEEZY_STORE_ID: 'Lemon Squeezy store ID',
    LEMON_SQUEEZY_VARIANT_ID: 'Lemon Squeezy variant ID',
    LEMON_SQUEEZY_WEBHOOK_SECRET: 'Webhook signature secret',
    SENTRY_DSN: 'Sentry error tracking (optional)',
  };

  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const [key, description] of Object.entries(required)) {
    if (!process.env[key]) {
      errors.push(`Missing required: ${key} - ${description}`);
    }
  }

  // Check optional variables
  for (const [key, description] of Object.entries(optional)) {
    if (!process.env[key]) {
      warnings.push(`Missing optional: ${key} - ${description}`);
    }
  }

  // Validate Supabase URL format
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://')) {
      errors.push('NEXT_PUBLIC_SUPABASE_URL must start with https://');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }

  if (warnings.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn(`⚠️ Environment warnings:\n${warnings.join('\n')}`);
  }

  return {
    isValid: true,
    warnings,
  };
}

/**
 * Get environment variable with validation
 */
export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  
  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable missing: ${key}`);
  }

  return value;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Get admin emails list
 */
export function getAdminEmails(): string[] {
  const adminEmails = process.env.ADMIN_EMAILS || '';
  return adminEmails
    .split(',')
    .map(email => email.trim())
    .filter(Boolean);
}

// Validate on module load
if (typeof window === 'undefined') {
  // Only validate on server
  try {
    validateEnvironmentVariables();
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    // Don't exit, allow graceful degradation
  }
}
