# Visual Design Guide - Activity Cards Enhancement

## Color & Styling Reference

### Status Badge Colors

#### Featured (🌟)

```tsx
// Light Mode
bg-yellow-100 dark:bg-yellow-900
text-yellow-800 dark:text-yellow-200

// Card Border
border-l-4 border-yellow-400 dark:border-yellow-500
```

#### Ongoing (🔴 Live)

```tsx
// Light Mode
bg-orange-100 dark:bg-orange-900
text-orange-800 dark:text-orange-200
animate-pulse  // Pulsing animation

// Card Border
border-l-4 border-orange-400 dark:border-orange-500
```

#### Upcoming (📅 Coming)

```tsx
// Light Mode
bg-blue-100 dark:bg-blue-900
text-blue-800 dark:text-blue-200

// Card Border
border-l-4 border-primary/70 dark:border-primary/60
```

#### Past (✓ Completed)

```tsx
// Light Mode
bg-slate-200 dark:bg-slate-700
text-slate-700 dark:text-slate-300
opacity-70 dark:opacity-60

// Card Border
No left border, muted styling
```

---

## Typography Scale

### Section Headers

```css
Font Size:   24px (mobile) → 28px (desktop)
Font Weight: 700 (bold)
Gap:         12px (emoji to text)
Line Height: 1.25
```

### Card Titles

```css
Font Size:   18px (mobile) → 20px (desktop)
Font Weight: 600 (semibold)
Line Height: 1.4
Max Lines:   2 (ellipsis overflow)
```

### Meta Information (Location, Date, Time)

```css
Font Size:   14px
Font Weight: 400 (normal)
Color:       muted-foreground
Gap:         8px (icon to text)
Line Height: 1.5
```

### Section Subtitle

```css
Font Size:   14px
Font Weight: 400 (normal)
Color:       muted-foreground
Margin:      4px top
```

---

## Spacing System

### Card Structure

```
┌─────────────────────────────────────┐
│  [Image]           [Status Badge]   │ ← Image (aspect-video)
├─────────────────────────────────────┤
│  Card Title          [Category 1]   │ ← px-4 py-3 md:px-5 md:py-4
├─────────────────────────────────────┤
│  Location Info       [Like Count]   │ ← px-4 py-3 md:px-5 md:py-4
│  Date • Time                        │ ← gap-2 between items
├─────────────────────────────────────┤
│  User Avatar • Host Name            │ ← px-4 py-2 md:px-5 md:py-3
└─────────────────────────────────────┘
```

### Grid Gaps

```css
gap: 20px (between cards);
```

### Section Spacing

```css
Top:          40px (margin-top)
Bottom:       32px (margin-bottom)
Accent bar:   24px below header
Content gap:  20px
```

---

## Responsive Grid

### Mobile (< 640px)

```css
Grid Columns:  1
Gap:           16px
Card Height:   auto (content-driven)
Padding:       16px page edges
```

### Tablet (640px - 1024px)

```css
Grid Columns:  2
Gap:           20px
Card Height:   min-h-96
Padding:       24px page edges
```

### Desktop (1024px+)

```css
Grid Columns:  3-4 (depending on container width)
Gap:           20px
Card Height:   min-h-96
Padding:       32px page edges
```

### Carousel (Past Activities)

```css
Mobile:       basis-full (1 item visible + peek)
Tablet:       basis-1/2 (2 items visible)
Desktop:      basis-1/3 (3 items visible)
XL:           basis-1/4 (4 items visible)
Padding:      8px mobile, 12px tablet/desktop
```

---

## Hover & Interactive States

### Card Hover

```css
Transform:     scale(1.02)
Shadow:        0 10px 30px rgba(0,0,0,0.1)
Transition:    all 250ms ease-out
Cursor:        pointer

Dark Mode:
Shadow:        0 10px 30px rgba(0,0,0,0.3)
```

### Image Hover (on card hover)

```css
Transform:     scale(1.05)
Transition:    250ms ease-out
Origin:        center
```

### Status Badge

```css
Backdrop:      blur-sm
Position:      absolute top-3 right-3
Transition:    all 250ms ease-out

Live/Pulsing (Ongoing):
Animation:     animate-pulse (Tailwind default)
Duration:      2s
```

### Carousel Navigation

```css
Arrow Buttons:
Opacity:       Fade in on hover
Transition:    all 200ms ease

Dot Indicators:
Width:         2px (8px when active)
Height:        2px (fixed)
Background:    muted-foreground/40 → primary
Transition:    all 300ms ease

Active Dot:
Width:         24px (6x wider)
Background:    primary
```

---

## Animation Details

### Transition Timing

```css
Standard:      250-300ms ease-out
Carousel:      300ms (slide transition)
Dot Indicator: 300ms (width change)
Opacity:       200-250ms
```

### Keyframe Animations

```css
/* Live Badge Pulsing */
@keyframes pulse {
  0%, 100%:  opacity: 1
  50%:       opacity: 0.5
  Duration:  2s
  Repeat:    infinite
}

/* Card Entry (future enhancement) */
@keyframes slideUp {
  from:      transform: translateY(10px); opacity: 0;
  to:        transform: translateY(0); opacity: 1;
  Duration:  300ms ease-out
}
```

---

## Dark Mode Adjustments

### Color Adjustments

| Component       | Light      | Dark       |
| --------------- | ---------- | ---------- |
| Featured Border | yellow-400 | yellow-500 |
| Ongoing Border  | orange-400 | orange-500 |
| Upcoming Border | primary/70 | primary/60 |
| Past Opacity    | 70%        | 60%        |
| Card Background | white      | slate-800  |
| Text Color      | slate-900  | slate-100  |
| Borders         | slate-200  | slate-700  |

### Shadow Adjustments

```css
Light Mode:
  Shadow:    0 10px 30px rgba(0,0,0,0.1)

Dark Mode:
  Shadow:    0 10px 30px rgba(0,0,0,0.3)
```

---

## Accessibility Features

### Keyboard Navigation

```
Tab:          Move between cards
Enter/Space:  Open card details
Escape:       Close details modal
Arrow Keys:   Navigate carousel (when focused)
```

### ARIA Labels

```tsx
role="article"
aria-label="Activity: {title}"
tabIndex={0}
onKeyDown handler for Enter/Space
```

### Focus Indicators

```css
Focus Ring:
  Ring:      2px
  Color:     primary
  Offset:    2px
  Visible:   outline-none focus-visible:ring-2
```

---

## Component Structure

### ActivityCard Props

```typescript
interface ActivityCardProps {
  activity: ActivityEntity;
  variant?: "featured" | "ongoing" | "upcoming" | "past";
  setSearchParams?: (query: string, value: string) => void;
}
```

### ActivitySection Props

```typescript
interface ActivitySectionProps {
  title: string; // With emoji
  description?: string; // Optional subtitle
  activities: ActivityEntity[];
  variant?: ActivityVariant; // Passed to cards
  gridStyles?: string; // Responsive grid
  onSearch?: (q: string, v: string) => void;
}
```

### PastActivityCarousel Props

```typescript
interface PastActivityCarouselProps {
  activities: ActivityEntity[];
  onSearch?: (query: string, value: string) => void;
}
```

---

## CSS Class Reference

### Utility Classes (Global)

```css
.section-title-enhanced      /* Section headers */
.section-subtitle            /* Section descriptions */
.section-accent-bar          /* Gradient separator */
.activity-card-featured      /* Featured styling */
.activity-card-ongoing       /* Ongoing styling */
.activity-card-upcoming      /* Upcoming styling */
.activity-card-past          /* Past styling */
.status-badge                /* Badge base */
.status-badge-featured       /* Featured badge */
.status-badge-ongoing        /* Ongoing badge */
.status-badge-upcoming       /* Upcoming badge */
.status-badge-past           /* Past badge */
.engagement-metric           /* Likes counter */
.engagement-metric.liked     /* Liked state */
.section-divider             /* Divider line */
```

### Tailwind Classes Used

```css
border-l-4              /* Left border for cards */
rounded-full            /* Badge shape */
backdrop-blur-sm        /* Status badge */
animate-pulse           /* Live badge animation */
hover:scale-105         /* Image zoom */
hover:shadow-xl         /* Card elevation */
dark:opacity-50         /* Dark mode adjustments */
gap-{n}                 /* Spacing utilities */
px-{n} py-{n}          /* Padding utilities */
aspect-video            /* Image ratio */
```

---

## Development Notes

### Z-Index Stack

```css
z-0:   Cards
z-10:  Carousel navigation buttons
z-20:  Status badges
z-30:  Modals/Drawers (from existing code)
```

### Performance Considerations

- Carousel uses Embla for smooth 60fps scrolling
- Images use Next.js Image component with optimization
- CSS transitions use GPU acceleration (transform, opacity)
- No expensive layout shifts

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge latest)
- Mobile browsers (iOS Safari 14+, Chrome Android)
- Dark mode via CSS class (prefers-color-scheme fallback)
