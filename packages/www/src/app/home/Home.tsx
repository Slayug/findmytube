'use client'

import {useRouter, useSearchParams} from 'next/navigation'

import styles from './Home.module.scss';
import {useEffect, useRef, useState, KeyboardEvent, InputHTMLAttributes, FormEventHandler, FormEvent} from "react";
import useApiChannel from "../../hooks/useApiChannel";
import {useTranslation} from "react-i18next";
import SearchVideoContent from "../../components/searchVideoContent/SearchVideoContent";
import Button from "../../components/component/Button";
import Input from "../../components/input/Input";
import SearchInput from "../../components/searchInput/SearchInput";

const QUERY_KEY = "q";
const CHANNEL_KEY = "channelAuthor";


export default function Home() {
  const searchParams = useSearchParams();

  const [searchContent, setSearchContent] = useState<string>(searchParams.get(QUERY_KEY));
  const [channelAuthorSelected, setChannelAuthorSelected] = useState<string>(searchParams.get(CHANNEL_KEY));
  const searchInputRef = useRef<HTMLInputElement>();

  const {searchYoutubeChannel} = useApiChannel();
  const {t} = useTranslation();

  const router = useRouter()

  useEffect(() => {
    updateSearchParams();
  }, [searchContent, channelAuthorSelected])

  function onPressEnterContent() {
    setSearchContent(searchInputRef.current.value);
    updateSearchParams();
  }

  function onSearchKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    if (event.code === "Enter") {
      onPressEnterContent();
    }
  }

  function goToVideo(videoId: string) {
    //router.push(`/watch?v=${videoId}&q=${searchContent.current.replaceAll(" ", "+")}`)
  }

  function updateSearchParams() {
    //TODO broken
    let currentParams = {};
    if (searchContent) {
      currentParams = {q: searchContent};
    }
    if (channelAuthorSelected) {
      currentParams = {...currentParams, channelAuthor: channelAuthorSelected};
    }
    //TODO update set search
    //setSearchParams();
  }

  function onSelectChannel(channel: string) {
    setChannelAuthorSelected(channel)
    updateSearchParams();
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
            />
          </div>
          <Button type="submit">Search through Youtube</Button>
        </form>
      </div>
    </section>
    <SearchVideoContent searchContent={searchContent}  />
  </main>

}
