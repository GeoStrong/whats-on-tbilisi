import { useEffect, useMemo, useState } from "react";
import { ActivityEntity, Category, Poi } from "../types";
import useAddSearchQuery from "./useAddSearchQuery";
import { useActivities, useActivitiesByCategory } from "./useActivities";
import { useCategory } from "./useCategories";

const useActivitiesFilter = () => {
  const [activities, setActivities] = useState<ActivityEntity[] | null>(null);
  const [category, setCategory] = useState<Category[]>([]);
  const [activeActivity, setActiveActivity] = useState<ActivityEntity | null>(
    null,
  );
  const [activityLocations, setActivityLocations] = useState<Poi[] | null>(
    null,
  );

  const { searchParams } = useAddSearchQuery();

  // params
  const categoryCSV = searchParams.get("categories");
  const activityId = searchParams.get("activity");
  const search = searchParams.get("search")?.toLowerCase() || "";
  const date = searchParams.get("date") || "";
  const singleCategoryId = searchParams.get("category");

  // stable categories - use string comparison to avoid array reference issues
  const selectedCategories = useMemo(() => {
    return categoryCSV ? categoryCSV.split(",") : [];
  }, [categoryCSV]);

  // Create stable string representation for dependency comparison
  const selectedCategoriesKey = useMemo(() => {
    return selectedCategories.join(",");
  }, [selectedCategories]);

  // Fetch activities using React Query - all hooks called unconditionally
  const { data: singleCategoryActivities, isLoading: singleCategoryLoading } =
    useActivitiesByCategory(singleCategoryId || null);
  // Use server-side filtering for search and date when no categories selected
  const { data: allActivities, isLoading: allActivitiesLoading } =
    useActivities({
      limit: 100,
      filters:
        !singleCategoryId && selectedCategories.length === 0
          ? {
              search: search || undefined,
              date: date || undefined,
            }
          : undefined,
    });

  // Fetch activities for each selected category (max 10 to avoid too many hooks)
  const category1Query = useActivitiesByCategory(selectedCategories[0] || null);
  const category2Query = useActivitiesByCategory(selectedCategories[1] || null);
  const category3Query = useActivitiesByCategory(selectedCategories[2] || null);
  const category4Query = useActivitiesByCategory(selectedCategories[3] || null);
  const category5Query = useActivitiesByCategory(selectedCategories[4] || null);

  // Create stable array reference using JSON.stringify for deep comparison
  const multipleCategoryActivities = useMemo(() => {
    if (selectedCategories.length === 0) return [];
    const queries = [
      category1Query.data,
      category2Query.data,
      category3Query.data,
      category4Query.data,
      category5Query.data,
    ].filter(Boolean) as ActivityEntity[][];
    return queries.flat();
  }, [
    selectedCategories.length,
    category1Query.data,
    category2Query.data,
    category3Query.data,
    category4Query.data,
    category5Query.data,
  ]);

  // Create stable string representation of activities arrays to prevent infinite loops
  const singleCategoryActivitiesKey = useMemo(() => {
    return JSON.stringify(singleCategoryActivities || []);
  }, [singleCategoryActivities]);

  const multipleCategoryActivitiesKey = useMemo(() => {
    return JSON.stringify(multipleCategoryActivities || []);
  }, [multipleCategoryActivities]);

  const allActivitiesKey = useMemo(() => {
    return JSON.stringify(allActivities || []);
  }, [allActivities]);

  // Load category title
  const { data: categoryData } = useCategory(
    selectedCategories.length === 1 ? selectedCategories[0] : null,
  );

  // --------------------------------------------------------------------
  // Consolidated: Apply filters to fetched activities
  // --------------------------------------------------------------------
  useEffect(() => {
    // Don't update if still loading to prevent unnecessary re-renders
    if (singleCategoryId && singleCategoryLoading) return;
    if (
      !singleCategoryId &&
      selectedCategories.length === 0 &&
      allActivitiesLoading
    )
      return;

    let baseActivities: ActivityEntity[] = [];

    // Priority: singleCategoryId > selectedCategories > all activities
    if (singleCategoryId) {
      baseActivities = singleCategoryActivities || [];
    } else if (selectedCategories.length > 0) {
      baseActivities = multipleCategoryActivities || [];
    } else {
      baseActivities = allActivities || [];
    }

    // 🔎 Apply search filter (only if not already filtered server-side)
    if (search && (singleCategoryId || selectedCategories.length > 0)) {
      baseActivities = baseActivities.filter((a) =>
        `${a.title} ${a.location} ${a.description}`
          .toLowerCase()
          .includes(search),
      );
    }

    // 📅 Apply date filter (only if not already filtered server-side)
    if (date && (singleCategoryId || selectedCategories.length > 0)) {
      if (date === "weekend") {
        baseActivities = baseActivities.filter((a) => {
          if (!a.date) return false;
          const day = new Date(a.date).getDay();
          return day === 0 || day === 6; // Sunday or Saturday
        });
      } else {
        baseActivities = baseActivities.filter(
          (a) => a.date?.toString().split("T")[0] === date,
        );
      }
    }

    setActivities(baseActivities);
  }, [
    singleCategoryId,
    singleCategoryLoading,
    singleCategoryActivitiesKey,
    selectedCategoriesKey,
    multipleCategoryActivitiesKey,
    allActivitiesKey,
    allActivitiesLoading,
    search,
    date,
    selectedCategories.length,
    singleCategoryActivities,
    multipleCategoryActivities,
    allActivities,
  ]);

  // Set category from query result
  useEffect(() => {
    if (categoryData) {
      setCategory([categoryData] as Category[]);
    } else {
      setCategory([]);
    }
  }, [categoryData]);

  // --------------------------------------------------------------------
  // 3️⃣ Active activity
  // --------------------------------------------------------------------
  useEffect(() => {
    if (!activities) return;

    const activity = activities.find((a) => a.id === activityId) || null;
    setActiveActivity(activity);
  }, [activities, activityId]);

  // --------------------------------------------------------------------
  // 4️⃣ Map locations
  // --------------------------------------------------------------------
  useEffect(() => {
    if (!activities) return;

    const fetchLocationsWithCategories = async () => {
      const { getCategoriesByActivityId } = await import(
        "../functions/supabaseFunctions"
      );

      const locationsPromises = activities
        .filter((a) => a.googleLocation)
        .map(async (a) => {
          const categories = await getCategoriesByActivityId(a.id);
          const firstCategory = categories?.[0];

          return {
            key: `activity-${a.id}`,
            location: a.googleLocation!,
            categoryColor: firstCategory?.color,
            categoryIcon: firstCategory?.icon,
          };
        });

      const locations = await Promise.all(locationsPromises);
      setActivityLocations(locations || null);
    };

    fetchLocationsWithCategories();
  }, [activities]);

  return {
    activities,
    category,
    activeActivity,
    activityLocations,
  };
};

export default useActivitiesFilter;
