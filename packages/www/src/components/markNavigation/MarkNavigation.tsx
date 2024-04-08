'use client'

import {useEffect, useRef, useState} from "react";
import {scrollToMark} from "../../app/video/VideoPageDomain";

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
    {markLength > 1 && <section>
      <span onClick={moveUp}>UP</span>
      <span onClick={moveDown}>DOWN</span>
    </section>
    }
  </>
}
