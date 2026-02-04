import { useState, useEffect, useCallback, useRef } from "react";
import { ActivityEntity } from "../types";
import { getActivities, PaginatedResult } from "../data/supabaseFunctions";

interface UseInfiniteActivitiesOptions {
  limit?: number;
  enabled?: boolean;
}

export const useInfiniteActivities = (options: UseInfiniteActivitiesOptions = {}) => {
  const { limit = 20, enabled = true } = options;
  const [activities, setActivities] = useState<ActivityEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerTarget = useRef<any>(null);

  const loadActivities = useCallback(
    async (pageNum: number, append: boolean = false) => {
      if (!enabled) return;

      const loadingState = append ? setIsLoadingMore : setIsLoading;
      loadingState(true);
      setError(null);

      try {
        const result = await getActivities({
          page: pageNum,
          limit,
        });

        if (result && typeof result === "object" && "data" in result) {
          const paginatedResult = result as PaginatedResult<ActivityEntity>;
          if (append) {
            setActivities((prev) => [...prev, ...paginatedResult.data]);
          } else {
            setActivities(paginatedResult.data);
          }
          setHasMore(paginatedResult.hasMore);
          setPage(pageNum);
        } else {
          // Fallback for non-paginated result
          const data = result as ActivityEntity[];
          if (append) {
            setActivities((prev) => [...prev, ...data]);
          } else {
            setActivities(data);
          }
          setHasMore(data.length === limit);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to load activities");
        setError(error);
      } finally {
        loadingState(false);
      }
    },
    [limit, enabled],
  );

  useEffect(() => {
    if (enabled) {
      loadActivities(1, false);
    }
  }, [enabled]); // Only depend on enabled, loadActivities is stable

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && enabled) {
      loadActivities(page + 1, true);
    }
  }, [page, isLoadingMore, hasMore, enabled, loadActivities]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoadingMore, loadMore]);

  const refetch = useCallback(() => {
    setPage(1);
    setActivities([]);
    setHasMore(true);
    loadActivities(1, false);
  }, [loadActivities]);

  return {
    activities,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
    observerTarget,
  };
};

