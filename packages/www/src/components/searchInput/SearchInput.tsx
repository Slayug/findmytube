import {InputHTMLAttributes, useRef} from "react";
import useSWR from "swr";

import styles from './SearchInput.module.scss'
import AsyncSelect from "react-select/async";


interface Option {
  name: string,
  id: string
}

type SearchInputProps = {
  searchMethod: (content: string) => Promise<Option[]>
  optionSelected: (option: Option) => void
}


function SearchInput(props: SearchInputProps) {
  const { searchMethod, optionSelected } = props;
  const searchContent = useRef("")
  const lastTimeRequest = useRef(0);

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
    <AsyncSelect blurInputOnSelect closeMenuOnSelect cacheOptions loadOptions={onInputChange}  />
  </span>
}

export default SearchInput;
