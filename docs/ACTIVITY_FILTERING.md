# Activity Filtering Logic Documentation

## Overview

The activity filtering system in What'sOnTbilisi allows users to discover activities by status (featured, ongoing, past, upcoming) and apply additional filters like search, date, and categories. This document explains how the filtering logic works and how `determineActivityVariant` aligns with the filter options.

---

## Key Components

### 1. `determineActivityVariant` Function

**Location:** [components/activities/activityCard.tsx](../components/activities/activityCard.tsx#L60-L68)

Determines the status of an activity based on its `status` field:

```typescript
export const determineActivityVariant = (
  activity: ActivityEntity,
): ActivityVariant => {
  const status = activity.status || "active";

  if (status === "inactive") return "past";
  if (status === "pending") return "ongoing";
  return "upcoming";
};
```

**Status Logic:**

- **`past`**: `status === "inactive"`
- **`ongoing`**: `status === "pending"`
- **`upcoming`**: `status === "active"` (default)

---

### 2. `useActivitiesFilter` Hook

**Location:** [lib/hooks/useActivitiesFilter.tsx](../lib/hooks/useActivitiesFilter.tsx)

Manages activity filtering with the following features:

#### Data Fetching

- Fetches **ALL activities** (including past ones) for client-side filtering
- `excludePast: false` allows the "Past" filter to display completed activities
- Search and date filters are applied server-side when no categories are selected

#### Client-Side Filtering (`filteredActivities`)

Applies the filter parameter from the URL query string:

```typescript
const filteredActivities = useMemo(() => {
  if (!allActivities) return [];

  const filter = searchParams.get("filter");

  return allActivities.filter((activity) => {
    const variant = determineActivityVariant(activity);

    // Handle specific filter selections
    if (filter === "featured") {
      return activity.featured;
    }
    if (filter === "ongoing") {
      return variant === "ongoing";
    }
    if (filter === "past") {
      return variant === "past";
    }
    if (filter === "upcoming") {
      return variant === "upcoming";
    }

    // Default: "All" filter - show all activities
    return true;
  });
}, [allActivities, searchParams]);
```

---

### 3. Discover Page Layout

**Location:** [components/discover/discoverLayout.tsx](../components/discover/discoverLayout.tsx)

Provides the UI for filter selection and display:

**Filter Options:**

- **All**: Shows all activities (default)
- **Featured**: Shows activities marked as featured (`activity.featured === true`)
- **Ongoing**: Shows activities with `status === "pending"`
- **Past**: Shows activities with `status === "inactive"`
- **Upcoming**: Shows activities with `status === "active"`

**Active Filter Detection:**

```typescript
const isActiveFilter = (filter: string) => {
  const currentFilter = searchParams.get("filter");
  // "All" is active when no filter is set or filter is explicitly "all"
  if (filter === "All") {
    return !currentFilter || currentFilter === "all";
  }
  return currentFilter === filter.toLowerCase();
};
```

---

## Data Flow

```
User clicks filter button
    ↓
handleSearch("filter", "ongoing") is called
    ↓
URL query param updated: ?filter=ongoing
    ↓
useActivitiesFilter reads searchParams.get("filter")
    ↓
filteredActivities useMemo runs with new filter value
    ↓
determineActivityVariant is called for each activity
    ↓
Activities matching the variant are returned
    ↓
UI re-renders with filtered activities
```

---

## Filter Behavior Details

### Featured Filter

- **Condition:** `activity.featured === true`
- **Use Case:** Highlight important or promoted activities
- **Database Field:** `featured` (boolean)

### Ongoing Filter

- **Condition:** `determineActivityVariant(activity) === "ongoing"`
- **Use Case:** Show activities currently in progress
- **Status Requirement:** `status === "pending"`
- **Visual Badge:** 🔴 Live (with pulse animation)

### Past Filter

- **Condition:** `determineActivityVariant(activity) === "past"`
- **Use Case:** Show completed activities
- **Status Requirement:** `status === "inactive"`
- **Visual Badge:** ✓ Completed (grayed out styling)

### Upcoming Filter

- **Condition:** `determineActivityVariant(activity) === "upcoming"`
- **Use Case:** Show active activities
- **Status Requirement:** `status === "active"`
- **Visual Badge:** 📅 Coming

### All Filter (Default)

- **Condition:** No specific filter applied (returns `true`)
- **Use Case:** Browse all activities
- **Behavior:** Shows all activities from the server (including past if fetched)

---

## Implementation Alignment Checklist

✅ `determineActivityVariant` uses consistent status logic  
✅ `filteredActivities` applies the same variant logic  
✅ Server-side excludePast is disabled to allow "Past" filter  
✅ URL params drive the filter state (single source of truth)  
✅ UI highlights the active filter with `isActiveFilter`  
✅ Default behavior shows "All" activities  
✅ ActivityCard uses variant for styling and badging

---

## How to Add a New Filter

1. Add filter option to `filterOptions` array in [discoverLayout.tsx](../components/discover/discoverLayout.tsx#L23)
2. Add new condition in `filteredActivities` useMemo in [useActivitiesFilter.tsx](../lib/hooks/useActivitiesFilter.tsx#L55-L80)
3. Update `isActiveFilter` if needed (usually no changes required)
4. Update `ActivityCard` styling/badge if the new filter introduces a new status
5. Test by clicking the filter button and verifying activities are categorized correctly

---

## Troubleshooting

### Activities aren't showing in the "Past" filter

**Problem:** Server-side `excludePast: true` prevents past activities from being fetched.  
**Solution:** Ensure `excludePast: false` in the `useActivities` hook call.

### "All" filter shows only non-past activities

**Problem:** The filteredActivities logic returns `variant !== "past"` for the default case.  
**Solution:** Changed to return `true` for the default case (shows all activities).

### Filter state doesn't persist after navigation

**Problem:** Filter is stored in URL params, not persistent state.  
**Solution:** Ensure `handleSearch("filter", value)` is called, which updates the URL.

### Activity has wrong variant badge

**Problem:** `determineActivityVariant` logic doesn't match expected date ranges.  
**Solution:** Verify the activity's `date` and `endDate` fields in the database.

---

## Performance Considerations

- **Client-side filtering:** No performance hit for typical activity counts (<1000)
- **React Query caching:** Prevents unnecessary API calls on filter changes
- **useMemo dependencies:** Minimal dependencies to avoid excessive re-renders
- **Concurrent fetches:** Up to 5 category queries run in parallel for multi-select filters

---

## Related Documentation

- [API.md](./API.md) - API endpoints for activities
- [supabase-rls-policies.sql](./supabase-rls-policies.sql) - Database access control
- [copilot-instructions.md](../.github/copilot-instructions.md) - Architecture overview
