import { useCallback, type RefCallback } from "react";
import { useResizeObserver } from "./useResizeObserver.js";

export type ObserveResizeCallback = (
  entry: ResizeObserverEntry,
  resizeObserver: ResizeObserver
) => void;

export function useObserveResize(
  onResize: ObserveResizeCallback,
  options?: ResizeObserverOptions
): RefCallback<Element> {
  const [getResizeObserver, refResizeObserver] = useResizeObserver(
    (entries, ro) => {
      onResize(entries[0], ro);
    }
  );

  return useCallback(
    (target) => {
      if (target) {
        const resizeObserver = getResizeObserver();
        resizeObserver.observe(target, options);
      } else {
        refResizeObserver.current?.disconnect();
      }
    },
    [options]
  );
}
