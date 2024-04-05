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
  const [channelSelected, setChannelSelected] = useState("")
  const searchInputRef = useRef<HTMLInputElement>();
  const channelSelectedRef = useRef<Select<{value, label}>>();

  function onPressEnterContent() {
    setSearchContent(searchInputRef.current.value);
    setChannelSelected(channelSelectedRef.current?.getValue()[0]?.label ?? "")
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
    onPressEnterContent()
  }

  return <main>
    <section>
      <div>
        <form onSubmit={submitSearch}>
          <div className="flex flex-row justify-center">
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
          <div className="flex justify-center">
            <Button type="submit">Search through Youtube</Button>
          </div>
        </form>
      </div>
    </section>
    <SearchVideoContent channelAuthorSelected={channelSelected} searchContent={searchContent} />
  </main>

}
