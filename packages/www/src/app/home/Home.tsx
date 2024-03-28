'use client'

import {useRouter, useSearchParams} from 'next/navigation'

import styles from './Home.module.scss';
import {useEffect, useRef, useState, KeyboardEvent, InputHTMLAttributes} from "react";
import useApiChannel from "../../hooks/useApiChannel";
import {useTranslation} from "react-i18next";
import SearchVideoContent from "../../components/searchVideoContent/SearchVideoContent";

const QUERY_KEY = "q";
const CHANNEL_KEY = "channelAuthor";


export default function Home() {
  const searchParams = useSearchParams();
  const [inLoadMore, setInLoadMore] = useState(false);

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


  return <main>
    <section>
      <div className={styles.search}>
        <label htmlFor="search">Search through YouTube: </label>
        <input
          id="search"
          autoFocus
          type="search"
          ref={searchInputRef}
          defaultValue={searchParams.get(QUERY_KEY)}
          onKeyUp={onSearchKeyUp}
        />
      </div>
    </section>
    <SearchVideoContent searchContent={searchContent}  />
  </main>

}
