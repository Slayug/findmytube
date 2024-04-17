'use client'

import {usePathname, useRouter, useSearchParams} from 'next/navigation'

import {useRef, useState, KeyboardEvent, FormEvent} from "react";
import SearchVideoContent from "../../components/searchVideoContent/SearchVideoContent";
import Button from "@/components/button/Button";
import Input from "../../components/input/Input";
import SearchInput from "../../components/searchInput/SearchInput";
import {searchYoutubeChannel} from "@/hooks/useApiChannel";
import Select from "react-select/base";
import {CHANNEL_KEY, QUERY_KEY} from "@/domain/SearchQuery";


export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchContent, setSearchContent] = useState<string>(searchParams.get(QUERY_KEY));
  const [channelSelected, setChannelSelected] = useState(searchParams.get(CHANNEL_KEY))
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
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set(QUERY_KEY, searchInputRef.current?.value)
    current.set(CHANNEL_KEY, channelSelectedRef.current?.getValue()[0]?.label ?? "")

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  }

  function submitSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onPressEnterContent()
  }

  return <main>
    <section>
      <div>
        <form onSubmit={submitSearch}>
          <div className="flex flex-col md:flex-row justify-center py-3 md:pt-10">
            <Input
              id="search"
              type="search"
              ref={searchInputRef}
              defaultValue={searchParams.get(QUERY_KEY)}
              onKeyUp={onSearchKeyUp}
              placeholder="Hello world!"
              className="md:mx-5"
            />
            <SearchInput
              defaultValue={searchParams.get(CHANNEL_KEY) ?? ""}
              placeholder="Specify a channel (optional)"
              searchMethod={searchYoutubeChannel}
              ref={channelSelectedRef}
            />
          </div>
          <div className="flex justify-center">
            <Button className="my-2" type="submit">Search through Youtube</Button>
          </div>
        </form>
      </div>
    </section>
    <SearchVideoContent channelAuthorSelected={channelSelected} searchContent={searchContent} />
  </main>

}
