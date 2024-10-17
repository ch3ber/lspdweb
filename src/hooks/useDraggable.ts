import { useEffect } from "react";

export default function useDraggable(id: string) {
  useEffect(() => {
    const div = document.getElementById(id);
    const header = document.getElementById(id + "_header");

    if (!div) return console.log("xd");
    div.style.position = "absolute";

    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;

    const elementDrag = (e: MouseEvent) => {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      div.style.top = div.offsetTop - pos2 + "px";
      div.style.left = div.offsetLeft - pos1 + "px";

      if (div.offsetTop < 0) div.style.top = "0px";
      if (div.offsetLeft < 0) div.style.left = "0px";
      if (div.offsetTop + div.offsetHeight > window.innerHeight)
        div.style.top = window.innerHeight - div.offsetHeight + "px";
      if (div.offsetLeft + div.offsetWidth > window.innerWidth)
        div.style.left = window.innerWidth - div.offsetWidth + "px";
    };

    const closeDragElement = () => {
      document.onmouseup = null;
      document.onmousemove = null;
    };

    const dragMouseDown = (e: MouseEvent) => {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    };

    (header || div).style.cursor = "move";
    (header || div).onmousedown = dragMouseDown;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
