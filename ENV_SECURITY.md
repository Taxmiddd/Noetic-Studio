# Security and Environment Configuration Guidelines

## Critical Files to Never Commit

**The following files contain secrets and must NEVER be committed:**

```
.env.local              - Local environment variables with secrets
.env.*.local            - Environment-specific secrets
*.key                   - Private keys
*.pem                   - PEM certificates
.env.production.local   - Production secrets
```

## Safe Files to Commit

**These files are SAFE and should be committed:**

```
.env.example            - Template with no secrets
.env.production         - Example production config (no actual secrets)
```

## Git Configuration

### For Your Repository

1. **Ensure .env.local is in .gitignore:**

```bash
# Check current .gitignore
cat .gitignore

# If needed, add these lines:
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore
echo "*.key" >> .gitignore
echo "*.pem" >> .gitignore
```

2. **Remove accidentally committed secrets:**

```bash
# If secrets were committed, use git-filter-branch
git rm --cached .env.local
git commit --amend -C HEAD
```

3. **Prevent future accidents:**

```bash
# Install pre-commit hook
npm install husky --save-dev
npm run prepare

# Create hook
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Prevent committing secrets
if git diff --cached --name-only | grep -E '\.env\.local|\.key|\.pem'; then
  echo "❌ ERROR: Attempting to commit secret files!"
  echo "Add these to .gitignore:"
  git diff --cached --name-only | grep -E '\.env\.local|\.key|\.pem'
  exit 1
fi
EOF

chmod +x .husky/pre-commit
```

## Environment Variable Management

### Local Development

1. Copy template:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your values (never commit .env.local)

3. Restart dev server:
   ```bash
   npm run dev
   ```

### Staging/Production

Use your deployment platform's environment variable UI:

- **Vercel**: Settings → Environment Variables
- **Netlify**: Site Settings → Build & Deploy → Environment
- **AWS**: Parameter Store or Secrets Manager
- **GitHub Actions**: Settings → Secrets and variables

### Secret Rotation

Every 90 days:

1. Generate new API keys in each service (Supabase, Lemon Squeezy, etc.)
2. Update environment variables in all environments
3. Invalidate old keys
4. Document in security log

## Audit Trail

### Check What's in Git History

```bash
# Search for potential secrets
git log --all -p | grep -E 'password|secret|key|token' | head -20
```

### If Secrets Were Exposed

1. **Immediately revoke** the compromised credentials
2. **Update** with new credentials everywhere
3. **Regenerate** any affected API keys
4. **Monitor** for unauthorized access
5. **Document** the incident

## Verification Checklist

Before pushing code:

```bash
# These should return NOTHING (no secrets exposed):
git diff --staged | grep -i password
git diff --staged | grep -i secret
git diff --staged | grep -i api_key
git diff --staged | grep SUPABASE_SERVICE_ROLE_KEY
git diff --staged | grep LEMON_SQUEEZY

# This should show clean status:
git status

# This should NOT include .env.local:
git ls-files | grep .env.local
```

## NPM Security

Keep dependencies updated:

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Update everything
npm update

# Check for outdated packages
npm outdated
```

Commit security patches immediately.

## Deployment Security

When deploying to production:

1. ✅ Use deployment platform's secret manager
2. ✅ Never hard-code secrets in code
3. ✅ Never paste secrets in terminal history
4. ✅ Use separate keys for dev/staging/prod
5. ✅ Enable audit logging on deployment
6. ✅ Use HTTPS only
7. ✅ Set CSP headers
8. ✅ Enable HSTS

## References

- [OWASP: Sensitive Data Exposure](https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure)
- [Git Security: Removing Sensitive Data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [NIST Guidelines](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5)
