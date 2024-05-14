import {ForwardedRef, forwardRef, useId, useRef} from "react";
import useSWR from "swr";

import styles from './SearchInput.module.scss'
import AsyncSelect from "react-select/async";
import Select from "react-select/base";
import classNames from "classnames";

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

  return <>
    <AsyncSelect
      defaultInputValue={props.defaultValue}
      className='min-w-72'
      classNames={{
        control: ({isFocused}) => classNames(
          isFocused && styles.selectFocus,
          !isFocused && styles.select,
          "hover:drop-shadow-md"
        ),
        placeholder: () => styles.selectPlaceHolder,
        option: () => styles.option
      }}
      instanceId={selectId}
      placeholder={placeholder}
      blurInputOnSelect
      closeMenuOnSelect
      cacheOptions
      isClearable
      loadOptions={onInputChange}
      ref={ref}
    />
  </>
});

export default SearchInput;
