export default function useAddSearchQuery() {
  const handleSearch = (_query: string, _value: string) => {};
  const handleReplace = (_params: URLSearchParams) => {};
  const searchParams = new URLSearchParams();

  return { handleSearch, handleReplace, searchParams };
}
