# 🚀 PERFORMANCE & OPTIMIZATION GUIDE

**Last Updated**: April 23, 2026

---

## QUICK WINS (Implement Today)

### 1. Bundle Size Optimization

**Current**: Not analyzed  
**Target**: < 150KB gzipped for homepage

```typescript
// next.config.ts - Already configured
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react", "three", "ogl", "gsap"],
  },
  // ...
};
```

✅ This is good! Package imports are optimized.

**Additional measures**:

```typescript
// Dynamically import heavy components
import dynamic from 'next/dynamic';

const GravityField = dynamic(
  () => import('@/components/hero/GravityField'),
  { 
    loading: () => <div>Loading...</div>,
    ssr: false // Load only on client
  }
);
```

### 2. Image Optimization

**Current**: Uses Supabase storage ✅  
**Issue**: Full URLs not optimized

```typescript
// Before - Unoptimized
<img src="https://..storage../image.jpg" />

// After - Optimized with Next.js Image
import Image from 'next/image';

<Image
  src="https://..storage../image.jpg"
  alt="description"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/..."
  quality={75}
  loading="lazy"
/>
```

**Steps**:
1. Update `next.config.ts` image settings
2. Replace `<img>` with `<Image>`
3. Add placeholder blur
4. Set proper dimensions

### 3. Font Loading

**Current**: Using CSS fonts (possibly unoptimized)  
**Issue**: Might cause layout shift

```typescript
// src/app/globals.css - Add these optimizations

/* 1. Font loading strategy */
@font-face {
  font-family: 'YourFont';
  src: url('/fonts/your-font.woff2') format('woff2');
  font-display: swap; /* ✅ Use swap for better LCP */
  font-weight: 400;
  font-style: normal;
}

/* 2. Preconnect to font origins */
link[rel="preconnect"][href*="fonts"] {
  crossorigin: anonymous;
}
```

Add to `src/app/layout.tsx`:

```typescript
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
</head>
```

### 4. Database Query Optimization

**Current Issues Found**:

```typescript
// ❌ BAD - Multiple sequential queries
const projects = await supabase.from('projects').select('*');
const services = await supabase.from('services').select('*');
const partners = await supabase.from('partners').select('*');

// ✅ GOOD - Parallel queries
const [projects, services, partners] = await Promise.all([
  supabase.from('projects').select('*'),
  supabase.from('services').select('*'),
  supabase.from('partners').select('*'),
]);
```

**Also add**:

```typescript
// ✅ Use select() to limit columns
const { data } = await supabase
  .from('projects')
  .select('id,title,slug,thumbnail_url') // Only needed columns!
  .eq('is_featured', true)
  .limit(6);

// ✅ Use indexes from schema.sql (already done!)
```

---

## WEB VITALS OPTIMIZATION

### Core Web Vitals Targets

| Metric | Current | Target | Fix |
|--------|---------|--------|-----|
| LCP | ? | < 2.5s | Image optimization, Code splitting |
| FID | ? | < 100ms | JavaScript optimization |
| CLS | ? | < 0.1 | Layout shift prevention |

### Check Performance

1. **Google PageSpeed Insights**: https://pagespeed.web.dev/
2. **Lighthouse**: Built into Chrome DevTools
3. **WebPageTest**: https://www.webpagetest.org/

### Implement Performance Monitoring

Add to `src/app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## JAVASCRIPT OPTIMIZATION

### Code Splitting

```typescript
// ❌ BAD - All in one chunk
import { GravityField, Hero, Aurora, Dither } from '@/components';

// ✅ GOOD - Split into routes
import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('@/components/hero/HeroSection'));
const GravityField = dynamic(() => import('@/components/hero/GravityField'));
const Dither = dynamic(() => import('@/components/ui/Dither'));
```

### Remove Unused Dependencies

Check bundle analyzer:

```bash
npm install @next/bundle-analyzer --save-dev
```

Add to `next.config.ts`:

```typescript
import withBundleAnalyzer from '@next/bundle-analyzer';

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withAnalyzer(nextConfig);
```

Run:
```bash
ANALYZE=true npm run build
```

### Animation Optimization

**Current**: Using Framer Motion, GSAP, Three.js  
**Issue**: These are heavy libraries

```typescript
// Lazy load animations
import dynamic from 'next/dynamic';

const NoeticOrbit = dynamic(
  () => import('@/components/hero/NoeticOrbit'),
  { ssr: false }
);

// Only animate on user interaction
const [hasInteracted, setHasInteracted] = useState(false);

return (
  <div onMouseEnter={() => setHasInteracted(true)}>
    {hasInteracted && <NoeticOrbit />}
  </div>
);
```

### Reduce 3D Geometry

For Three.js components:

```typescript
// Reduce polygon count
const geometry = new THREE.IcosahedronGeometry(1, 4); // Lower subdivisions

// Use instancing for multiple objects
const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

// Use Level of Detail (LOD)
const lod = new THREE.LOD();
lod.addLevel(highPolyGeometry, 0);
lod.addLevel(lowPolyGeometry, 100);
```

---

## REACT OPTIMIZATION

### Component Memoization

```typescript
// Memoize expensive components
import { memo } from 'react';

const GlassCard = memo(({ children }) => {
  return <div className="glass-panel">{children}</div>;
});

export default GlassCard;
```

### Reduce Re-renders

```typescript
// ❌ BAD - Re-creates function every render
<NoeticOrbit onUpdate={() => console.log('update')} />

// ✅ GOOD - Memoized callback
import { useCallback } from 'react';

const handleUpdate = useCallback(() => {
  console.log('update');
}, []);

<NoeticOrbit onUpdate={handleUpdate} />
```

### Optimize State Updates

```typescript
// ❌ BAD - Multiple setState calls
setFormData({ ...formData, name: value });
setFormData({ ...formData, email: value });

// ✅ GOOD - Single update
setFormData(prev => ({
  ...prev,
  name: value,
  email: value
}));
```

---

## SEO OPTIMIZATION

### Metadata

Already implemented in `src/app/layout.tsx`:
- ✅ Meta tags
- ✅ Robots.txt
- ✅ Sitemap.xml

Additional improvements:

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: 'NOÉTIC Studio',
  description: 'Creative direction & digital products',
  
  // Add structured data
  other: {
    'script:ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'NOÉTIC Studio',
      url: 'https://noeticstudio.net',
      sameAs: [
        'https://instagram.com/...',
        'https://twitter.com/...',
      ],
    }),
  },
};
```

### Canonical URLs

```typescript
// For dynamic routes
export const metadata: Metadata = {
  alternates: {
    canonical: `https://noeticstudio.net${pathname}`,
  },
};
```

---

## CSS OPTIMIZATION

### Tailwind Configuration

Already using Tailwind 4 ✅

```typescript
// tailwind.config.js - Optimize
export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  // Only include plugins you use
  plugins: [],
};
```

### Remove Unused CSS

```bash
npm run build  # Tailwind automatically removes unused CSS
```

### Critical CSS

Inline critical CSS for above-the-fold content:

```typescript
// src/app/globals.css
/* Critical styles (LCP) */
.hero-section {
  /* Inline critical styles */
}

/* Non-critical styles */
@media (prefers-reduced-motion: no-preference) {
  .animate-fade {
    animation: fade 0.3s ease-in-out;
  }
}
```

---

## CACHING STRATEGY

### Browser Caching

Already configured in `public/_headers`:
```
Cache-Control: public,max-age=31536000,immutable
```

Add dynamic page caching:

```typescript
// src/app/layout.tsx
export const revalidate = 3600; // Revalidate every hour

// Or per-page
// src/app/services/page.tsx
export const revalidate = 3600;
```

### ISR (Incremental Static Regeneration)

```typescript
// src/app/work/[slug]/page.tsx
export const revalidate = 86400; // Revalidate daily

export default async function ProjectPage({ params }) {
  const project = await fetchProject(params.slug);
  return <ProjectDetail project={project} />;
}
```

### Database Query Caching

```typescript
// Use unstable_cache for database queries
import { unstable_cache } from 'next/cache';

const getCachedProjects = unstable_cache(
  async () => {
    return await supabase.from('projects').select('*');
  },
  ['projects'],
  { revalidate: 3600 }
);
```

---

## PERFORMANCE CHECKLIST

- [ ] Bundle size < 150KB gzipped
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Core Web Vitals "Good" on PageSpeed
- [ ] Images optimized with Next.js Image
- [ ] Fonts using `font-display: swap`
- [ ] Code splitting implemented
- [ ] Database queries parallelized
- [ ] Lazy loading components added
- [ ] Memoization used for expensive components
- [ ] CSS tree-shaken
- [ ] Caching strategy implemented
- [ ] Monitoring enabled (Vercel Analytics)
- [ ] No console errors or warnings

---

## MONITORING

### Vercel Analytics (Already integrated)

View at: https://vercel.com/dashboard

Track:
- Page load times
- Core Web Vitals
- Browser crashes
- Usage by page

### Create Custom Dashboard

```typescript
// src/app/api/analytics/route.ts
export async function GET() {
  // Fetch metrics from Vercel API
  // or your analytics provider
}
```

### Real User Monitoring

```typescript
// Monitor actual users
import { reportWebVitals } from 'next/app';

export function reportWebVitals(metric) {
  console.log('Web Vital:', metric);
  
  // Send to analytics service
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric),
  });
}
```

---

## OPTIMIZATION TIMELINE

### Week 1
- [ ] Optimize images
- [ ] Implement code splitting
- [ ] Fix easy Lighthouse warnings

### Week 2
- [ ] Implement caching strategy
- [ ] Optimize database queries
- [ ] Add component memoization

### Week 3
- [ ] Optimize animations (3D)
- [ ] Reduce bundle size
- [ ] Test on real devices

### Week 4
- [ ] Implement monitoring
- [ ] Performance regression testing
- [ ] Documentation

---

## REFERENCES

- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-core-web-vitals)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Webpack Bundle Analyzer](https://github.com/webpack-bundle-analyzer/webpack-bundle-analyzer)
