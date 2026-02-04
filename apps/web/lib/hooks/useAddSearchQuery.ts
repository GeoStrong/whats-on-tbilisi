"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const useAddSearchQuery = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleReplace = (params: URLSearchParams) =>
    replace(`${pathname}?${params.toString()}`);

  const handleSearch = (query: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(query, value);
    } else {
      params.delete(query);
    }
    handleReplace(params);
  };

  return { handleSearch, handleReplace, searchParams };
};
export default useAddSearchQuery;
