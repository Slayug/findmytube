
'use client'


import {useRef} from "react";

export default function MarkNavigation() {
  const currentIndexMarkedElement = useRef(-1);

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
    markedElements.item(currentIndexMarkedElement.current).scrollIntoView();
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
    markedElements.item(currentIndexMarkedElement.current).scrollIntoView();
  }



  return <section>
    <span onClick={moveUp}>UP</span>
    <span onClick={moveDown}>DOWN</span>
  </section>
}
