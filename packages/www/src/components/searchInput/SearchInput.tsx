import {ForwardedRef, forwardRef, useId, useRef} from "react";
import useSWR from "swr";

import styles from './SearchInput.module.scss'
import AsyncSelect from "react-select/async";
import Select from "react-select/base";

interface Option {
  name: string,
  id: string
}

type SearchInputProps = {
  searchMethod: (content: string) => Promise<Option[]>
  placeholder?: string
  defaultValue?: string
}

const SearchInput = forwardRef((props: SearchInputProps, ref: ForwardedRef<Select<{label, value}>>) =>  {
  const { searchMethod, placeholder } = props;
  const searchContent = useRef("")
  const lastTimeRequest = useRef(0);
  const selectId = useId()

  const { mutate: searchOptions} =
      useSWR(['search-input', searchContent.current], () => searchMethod(searchContent.current), {
        revalidateOnMount: false,
        revalidateOnFocus: false
      })

  async function mapOptions(optionsFetched: Promise<Option[]>) {
    return new Promise<{label, value}[]>(async (resolve) => {
      const options = await optionsFetched;
      const mappedOptions = options?.map((option) => ({
        label: option.name,
        value: option.id
      }))
      resolve(mappedOptions)
    }) ?? []
  }

  async function onInputChange(inputValue: string) {
    return new Promise<{label, value}[]>((resolve) => {
      lastTimeRequest.current = Date.now();
      setTimeout(() => {
        if (Date.now() - lastTimeRequest.current > 450) {
          searchContent.current = inputValue
          resolve(mapOptions(searchOptions()))
        } else {
          resolve([])
        }
      }, 600);
    });
  }

  return <span className={styles.searchInput}>
    <AsyncSelect
      styles={{
        control: (baseStyle) => ({
          ...baseStyle,
          borderColor: 'white',
          cursor: 'pointer'
        })
      }}
      defaultInputValue={props.defaultValue}
      className="rounded-lg"
      instanceId={selectId}
      placeholder={placeholder}
      blurInputOnSelect
      closeMenuOnSelect
      cacheOptions
      loadOptions={onInputChange}
      ref={ref}
    />
  </span>
});

export default SearchInput;
