import {
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  type MutableRefObject,
} from "react";

// avoid using useLayoutEffect in a node.js process to avoid SSR warnings.
const useEarliestEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useResizeObserver(
  onResize: ResizeObserverCallback
): [() => ResizeObserver, MutableRefObject<ResizeObserver | undefined>] {
  // We don't want to re-create the ResizeObserver every time the onResize callback
  // changes. So we use the last recommendation for effect dependencies changing too often:
  // https://reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often
  //
  // This would be a good use case for the useEvent rfc (https://github.com/reactjs/rfcs/pull/220).
  const refCallback = useRef(onResize);
  useEarliestEffect(() => {
    refCallback.current = onResize;
  });

  const refResizeObserver = useRef<ResizeObserver>();

  // Return a stable getter that lazily creates the resize observer:
  // https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
  //
  // This probably needs to be stable because it will often be used in reference callbacks:
  // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  const getResizeObserver = useCallback((): ResizeObserver => {
    if (!refResizeObserver.current) {
      refResizeObserver.current = new ResizeObserver((entries, ro) => {
        refCallback.current(entries, ro);
      });
    }
    return refResizeObserver.current;
  }, []);

  return [getResizeObserver, refResizeObserver];
}
