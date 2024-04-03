import Input from "../input/Input";
import {ChangeEvent, forwardRef, InputHTMLAttributes, Ref, useRef} from "react";
import useSWR from "swr";

type SearchInputProps = {
  searchMethod: (content: string) => Promise<{ name }[]>
  optionSelected: (option :string) => void
} & InputHTMLAttributes<HTMLInputElement>

import styles from './SearchInput.module.scss'

const SearchInput =
  forwardRef((props: SearchInputProps, ref: Ref<HTMLInputElement>) => {
    const { searchMethod, optionSelected } = props;
    const searchContent = useRef("")
    const lastTimeout = useRef<ReturnType<typeof setTimeout>>()


    const { data: options, mutate: searchOptions, isLoading } =
      useSWR(['search-input', searchContent.current], () => searchMethod(searchContent.current), {
        revalidateOnMount: false,
        revalidateOnFocus: false
      })

    function inputChange(event: ChangeEvent<HTMLInputElement>) {
      clearTimeout(lastTimeout.current)
      lastTimeout.current = setTimeout(() => {
        searchContent.current = event.target.value;
        searchOptions();
      }, 500);
    }

    return <span className={styles.searchInput}>
      <Input loading={isLoading} {...props} ref={ref} onChange={inputChange} />
      {options && <div><div className={styles.options}>
        <ul>
          {
            options.map((option) => <li
              key={option.name}
              onClick={(e) => optionSelected(option.name)}>{option.name}
            </li>)
          }
        </ul>
      </div>
      </div>}
    </span>
  });

export default SearchInput;
