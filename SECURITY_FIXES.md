# 🔒 SECURITY FIXES IMPLEMENTATION GUIDE

**Last Updated**: April 23, 2026  
**Priority**: 🔴 CRITICAL - Implement before production

---

## QUICK START - DO THIS FIRST

### 1. Set Up Environment Variables

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local with your actual values
# DO NOT commit this file!
```

### 2. Update .gitignore

Ensure these are in your `.gitignore`:
```
.env.local
.env.*.local
*.key
*.pem
```

### 3. Install Dependencies

Install the validation library:
```bash
npm install zod  # Optional but recommended for validation
```

---

## PHASE 1: EMERGENCY FIXES (Complete Today)

### ✅ 1. Security Headers Added
**Status**: ✅ DONE  
**File**: `src/middleware.ts`

Security headers now include:
- Content-Security-Policy
- X-Frame-Options
- Strict-Transport-Security
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

### ✅ 2. API Route Authentication Added
**Status**: ✅ DONE  
**File**: `src/app/api/admin/create-invoice/route.ts`

Changes:
- ✅ Added admin user verification
- ✅ Added email whitelist check
- ✅ Added rate limiting (10 req/min per user)
- ✅ Added input validation
- ✅ Added CORS protection
- ✅ Added audit logging
- ✅ Hidden sensitive error messages

### ✅ 3. Webhook Security Enhanced
**Status**: ✅ DONE  
**File**: `src/app/api/webhooks/lemon/route.ts`

Changes:
- ✅ Improved constant-time signature verification
- ✅ Better payload validation
- ✅ Proper error handling
- ✅ Better logging

### ✅ 4. Validation Utilities Created
**Status**: ✅ DONE  
**File**: `src/lib/validation.ts`

New functions:
- `validateInvoiceInput()` - Full input validation
- `sanitizeString()` - XSS prevention
- `checkRateLimit()` - Basic rate limiting
- `isValidEmail()` - Email validation

### ✅ 5. Environment Validation Added
**Status**: ✅ DONE  
**File**: `src/lib/env-validation.ts`

Features:
- Required variable validation
- Format validation
- Type safety
- Admin email whitelist support

### ✅ 6. Authentication Utilities Created
**Status**: ✅ DONE  
**File**: `src/lib/auth.ts`

Functions:
- `getAdminUser()` - Get current user from Supabase
- `isAdminEmail()` - Check if user is admin
- `requireAdminAuth()` - Middleware for API routes
- `validateOrigin()` - CORS validation

### ✅ 7. Template Created
**Status**: ✅ DONE  
**File**: `.env.example`

Includes all required and optional variables with documentation.

---

## PHASE 2: IMMEDIATE ACTIONS (Next 24 Hours)

### 🔄 1. Database Schema Update

**Status**: Needs manual execution  
**File**: `supabase/RLS_POLICIES_SECURE.sql`

**Steps**:

1. **Backup your database first!**
   ```bash
   # Export schema
   pg_dump postgresql://user:password@db.supabase.co/postgres > schema_backup.sql
   ```

2. Go to: https://supabase.com/dashboard → Your Project → SQL Editor

3. Run the SQL file in `supabase/RLS_POLICIES_SECURE.sql`

4. **Setup admin claims**:
   - Go to Authentication → Users
   - Click on your admin user
   - Click "User metadata" tab
   - Add JSON:
   ```json
   {
     "admin": "true"
   }
   ```

### 🔄 2. Update Admin Login to Use Supabase Auth

**Status**: Needs implementation  
**File**: `src/app/admin/login/page.tsx`

Replace session storage auth with Supabase:

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.session) {
        router.push("/admin");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
}
```

### 🔄 3. Update Admin Layout to Check Real Auth

**Status**: Needs implementation  
**File**: `src/app/admin/layout.tsx`

Replace with proper session check:

```typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      } else {
        setAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  // ... rest of component
}
```

### 🔄 4. Fix Pay Page (Remove Service Key Exposure)

**Status**: Needs implementation  
**File**: `src/app/pay/[id]/page.tsx`

Create a new API route to fetch invoices:

```typescript
// src/app/api/invoices/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !invoice) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(invoice);
}
```

Then use it in the page:
```typescript
// src/app/pay/[id]/page.tsx
const response = await fetch(`/api/invoices/${id}`);
const invoice = await response.json();
```

---

## PHASE 3: HARDENING (Next 48 Hours)

### 1. Add Database Audit Logging

The `audit_logs` table is created in the schema update.

Add this to your admin functions:

```typescript
async function logAudit(
  userId: string,
  action: string,
  tableName: string,
  recordId: string,
  changes: Record<string, any>
) {
  await supabase
    .from('audit_logs')
    .insert({
      user_id: userId,
      action,
      table_name: tableName,
      record_id: recordId,
      changes,
      ip_address: request.headers.get('x-forwarded-for'),
      user_agent: request.headers.get('user-agent'),
    });
}
```

### 2. Enable Supabase Auth Email Verification

1. Go to: Authentication → Providers → Email
2. Enable "Confirm email"
3. Set email template

### 3. Add Error Monitoring

Install Sentry:
```bash
npm install @sentry/nextjs
```

Configure in `next.config.ts`:
```typescript
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  // ... config
};

export default withSentryConfig(nextConfig, {
  org: "your-org",
  project: "your-project",
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
```

### 4. Setup Rate Limiting with Redis

For production, use Redis instead of in-memory:

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function checkRateLimit(
  identifier: string,
  maxRequests = 10,
  windowMs = 60000
) {
  const key = `ratelimit:${identifier}`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    redis.expire(key, Math.ceil(windowMs / 1000));
  }
  
  return count <= maxRequests;
}
```

### 5. Enable HTTPS Only

In your hosting (Vercel, etc.):
- Force HTTPS redirects
- Enable HSTS header (done in middleware)
- Use HTTPS everywhere

---

## COMPLIANCE CHECKLIST

- [ ] Environment variables secured (.env.local not committed)
- [ ] Admin authentication uses Supabase Auth
- [ ] RLS policies updated with proper admin checks
- [ ] API endpoints require authentication
- [ ] Input validation on all endpoints
- [ ] Rate limiting active
- [ ] Security headers configured
- [ ] CORS properly restricted
- [ ] Service role key only used server-side
- [ ] Error messages don't expose internals
- [ ] Audit logging enabled
- [ ] Email verification enabled
- [ ] HTTPS only enforced
- [ ] Payment webhook signature verified

---

## TESTING CHECKLIST

### Security Testing

```bash
# Test unauthorized access (should fail)
curl -X POST http://localhost:3000/api/admin/create-invoice

# Test invalid input (should fail)
curl -X POST http://localhost:3000/api/admin/create-invoice \
  -H "Content-Type: application/json" \
  -d '{"client_name": "", "amount": "invalid"}'

# Test rate limiting
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/admin/create-invoice \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -d '{...}'
done
```

### Database Testing

```sql
-- Test RLS policies
SELECT * FROM projects WHERE id = 'test-id';  -- Should work as public

DELETE FROM projects WHERE id = 'test-id';  -- Should fail without admin claim
```

---

## DEPLOYMENT CHECKLIST

- [ ] All .env secrets configured in deployment platform
- [ ] Database migrations applied
- [ ] Admin users have Supabase accounts with `admin: true` claim
- [ ] Webhook secret configured
- [ ] CORS origins updated to production domain
- [ ] Sentry token configured
- [ ] Redis/rate limiting service running
- [ ] Database backups automated
- [ ] SSL certificate valid
- [ ] Health check endpoint working

---

## ONGOING MAINTENANCE

### Weekly
- [ ] Review error logs in Sentry
- [ ] Check audit logs for suspicious activity
- [ ] Verify backups working

### Monthly
- [ ] Rotate API keys
- [ ] Review user access levels
- [ ] Update dependencies (`npm audit`)
- [ ] Review security headers score

### Quarterly
- [ ] Security assessment
- [ ] Penetration testing
- [ ] Dependency audit
- [ ] Access review

---

## STILL NEED HELP?

### Resources
- Supabase Security: https://supabase.com/docs/guides/auth
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Next.js Security: https://nextjs.org/docs/advanced-features/security
- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security

### Support
1. Check SECURITY_AUDIT.md for vulnerability details
2. Review the fixed files listed above
3. Run tests and verify patches
4. Contact your security team if needed

---

**⚠️ REMINDER**: Never commit `.env.local` or secrets to version control.  
Use `.env.example` as your template and add it to git.
