import {AutoComplete, Input, InputRef, SelectProps} from "antd";
import {useEffect, useRef, useState} from "react";
import {useQuery} from "@tanstack/react-query";

export default function SearchBar<T>({
  defaultSearchQuery,
  searchMethod,
  onPressEnter,
  onChange,
  onSelect,
  onClear,
  className,
  placeholder,
}: {
    defaultSearchQuery?: string,
    searchMethod: (query: string) => Promise<SelectProps<T>['options']>,
    onPressEnter?: (value: string) => void,
    onChange?: (value: string) => void,
    onSelect?: (value: string) => void,
    onClear?: () => void,
    className?: string,
    placeholder?: string
}) {
  const [searchQuery, setSearchQuery] = useState(defaultSearchQuery);

  const timerRef = useRef(0);
  const searchRef = useRef<InputRef>();

  const {
    data: searchResult,
    refetch: search,
    isLoading
  } = useQuery({
    queryKey: ['searchbar-search', searchQuery],
    queryFn: () => searchMethod(searchQuery),
    enabled: false,
    refetchOnMount: false,
    retry: false,
  });

  const onSearch = (value: string) => {
    setSearchQuery(value);
    if (!value) {
      onClear?.();
    }
  };


  useEffect(() => {
    if (searchQuery !== null && searchQuery !== '') {
      clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => {
        timerRef.current = 0;
        search();
      }, 350)
    }
  }, [searchQuery])

  function _onChange(value: string) {
    setSearchQuery(value);
    onChange?.(value);
  }

  return <AutoComplete
    className={className}
    style={{width: '100%'}}
    options={searchResult}
    onSearch={onSearch}
    onChange={_onChange}
    value={searchQuery}
    onSelect={onSelect}
  >
    <Input.Search
      loading={isLoading}
      onPressEnter={(event) => {
        onPressEnter?.(event.currentTarget.value)
      }}
      ref={searchRef}
      autoFocus
      defaultValue={defaultSearchQuery}
      size="large"
      placeholder={placeholder}
      style={{width: '100%'}}/>
  </AutoComplete>


}