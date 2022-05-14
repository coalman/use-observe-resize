import { useCallback, useRef, useState } from "react";
import { useObserveResize } from "../../src";

export function ResizableBox(props: {
  initWidth: number;
  initHeight: number;
  bgColor?: string;
  testid?: string;
}) {
  const [width, setWidth] = useState(props.initWidth);
  const [height, setHeight] = useState(props.initHeight);

  const refSizeRecords = useRef<{ width: number; height: number }[]>([]);

  const observeResize = useObserveResize(({ contentRect }) => {
    refSizeRecords.current.push({
      width: contentRect.width,
      height: contentRect.height,
    });
  });

  const ref = useCallback(
    (element: HTMLDivElement | null) => {
      observeResize(element);
      if (element) {
        (element as any).readSizeRecords = () => {
          const records = refSizeRecords.current;
          refSizeRecords.current = [];
          return records;
        };
      }
    },
    [observeResize]
  );

  return (
    <div
      data-testid={props.testid}
      ref={ref}
      tabIndex={0}
      style={{
        display: "inline-block",
        backgroundColor: props.bgColor ?? "steelblue",
        width,
        height,
      }}
      onKeyDown={(event) => {
        let setter;
        let dir = 0;

        if (event.key === "ArrowUp") {
          setter = setHeight;
          dir = -1;
        } else if (event.key === "ArrowDown") {
          setter = setHeight;
          dir = 1;
        } else if (event.key === "ArrowLeft") {
          setter = setWidth;
          dir = -1;
        } else if (event.key === "ArrowRight") {
          setter = setWidth;
          dir = 1;
        }

        if (setter && dir) {
          setter((value) => value + dir * 10);
          event.preventDefault();
        }
      }}
    />
  );
}

export default ResizableBox;
