'use client'

import {useSearchParams} from 'next/navigation'

import {useEffect, useRef, useState, KeyboardEvent, FormEvent} from "react";
import SearchVideoContent from "../../components/searchVideoContent/SearchVideoContent";
import Button from "../../components/component/Button";
import Input from "../../components/input/Input";
import SearchInput from "../../components/searchInput/SearchInput";
import {searchYoutubeChannel} from "../../hooks/useApiChannel";
import Select from "react-select/base";

const QUERY_KEY = "q";
const CHANNEL_KEY = "channelAuthor";


export default function Home() {
  const searchParams = useSearchParams();

  const [searchContent, setSearchContent] = useState<string>(searchParams.get(QUERY_KEY));
  const searchInputRef = useRef<HTMLInputElement>();
  const channelSelectedRef = useRef<Select>();

  function onPressEnterContent() {
    setSearchContent(searchInputRef.current.value);
    updateSearchParams();
  }

  function onSearchKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    if (event.code === "Enter") {
      onPressEnterContent();
    }
  }

  function updateSearchParams() {
    //TODO broken
    let currentParams = {};
    if (searchContent) {
      currentParams = {q: searchContent};
    }

    //TODO update set search
    //setSearchParams();
  }


  function submitSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return <main>
    <section>
      <div>
        <form onSubmit={submitSearch} className="flex flex-row">
          <div>
            <Input
              id="search"
              autoFocus
              type="search"
              ref={searchInputRef}
              defaultValue={searchParams.get(QUERY_KEY)}
              onKeyUp={onSearchKeyUp}
              placeholder="Hello world!"
            />
            <SearchInput
              placeholder="Specify a channel (optional)"
              searchMethod={searchYoutubeChannel}
              ref={channelSelectedRef}
            />
          </div>
          <Button type="submit">Search through Youtube</Button>
        </form>
      </div>
    </section>
    <SearchVideoContent searchContent={searchContent} />
  </main>

}
