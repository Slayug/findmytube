'use client'

import {useEffect, useRef, useState} from "react";
import {scrollToMark} from "../../app/video/VideoPageDomain";
import Image from "next/image";

import ArrowDown from '@/assets/arrow_down.png'
import ArrowUp from '@/assets/arrow_up.png'

export default function MarkNavigation() {
  const currentIndexMarkedElement = useRef(0);
  const [markLength, setMarkLength] = useState(0);

  useEffect(() => {
    setMarkLength(document?.getElementsByTagName("mark")?.length ?? 0);
  }, []);


  function moveUp() {
    const markedElements = document.getElementsByTagName("mark");

    if (markedElements.length === 0) {
      return;
    }

    if (currentIndexMarkedElement.current <= 0) {
      currentIndexMarkedElement.current = markedElements.length - 1;
    } else {
      currentIndexMarkedElement.current -= 1;
    }
    scrollToMark(markedElements, currentIndexMarkedElement.current)
  }

  function moveDown() {
    const markedElements = document.getElementsByTagName("mark");

    if (markedElements.length === 0) {
      return;
    }

    if (currentIndexMarkedElement.current >= markedElements.length - 1) {
      currentIndexMarkedElement.current = 0;
    } else {
      currentIndexMarkedElement.current += 1;
    }
    scrollToMark(markedElements, currentIndexMarkedElement.current)
  }

  return <>
    {markLength > 1 && <section className="flex flex-row justify-end">
      <span className="cursor-pointer hover:bg-violet-400" onClick={moveUp}>
        <Image src={ArrowUp} alt="Get previous occurence." width={45}/>
      </span>
      <span className="cursor-pointer hover:bg-violet-400" onClick={moveDown}>
        <Image src={ArrowDown} alt="Get next occurence." width={45}/>
      </span>
    </section>
    }
  </>
}
