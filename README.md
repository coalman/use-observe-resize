# use-observe-resize

React hooks to use ResizeObservers.

```jsx
import { useState } from "react";
import { useObserveResize } from "use-observe-resize";

const Example = () => {
  const [width, setWidth] = useState(null);

  const observeResize = useObserveResize((entry) => {
    setWidth(entry.contentRect.width);
  });

  return <div ref={observeResize}>{width}</div>;
};
```

## useObserveResize

Observe an element for resizes.

```ts
function useObserveResize(
  onResize: ObserveResizeCallback,
  options?: ResizeObserverOptions
): RefCallback<Element>;

type ObserveResizeCallback = (
  entry: ResizeObserverEntry,
  resizeObserver: ResizeObserver
) => void;
```

### Parameters

`onResize`: The function called when the element resizes.
This function does not need to be stable or memoized (don't call useCallback).
The function takes two parameters:

- `entry`: A [ResizeObserverEntry] with size data for the element that resized.
- `resizeObserver`: The [ResizeObserver] that is observing the element that resized.

`options`: The optional [options parameter for ResizeObserver.observe()](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/ResizeObserver).

### Returns

Returns a [callback ref].
The element passed to the callback will be observed.
This function changes if the `options` object changes.

## useResizeObserver

Creates a [ResizeObserver].

```ts
function useResizeObserver(
  onResize: ResizeObserverCallback
): [() => ResizeObserver, MutableRefObject<ResizeObserver | undefined>];
```

### Parameters

`onResize`: The function called when observed elements resize.
Same type as the [`callback` parameter for the ResizeObserver constructor](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/ResizeObserver).

### Returns

Returns an array with two items:

1. A stable lazy getter function that will create a [ResizeObserver] if one hasn't been created yet. This function is stable for all renders.
1. A reference object with `.current` set to a [ResizeObserver] or `undefined`.

### Example

```jsx
import { useResizeObserver } from "use-observe-resize";

const Example = (props) => {
  const refItemMap = useRef(null);
  if (refItemMap.current === null) {
    refItemMap.current = new Map();
  }

  const [getResizeObserver] = useResizeObserver((entries) => {
    for (let entry of entries) {
      // do w/e
    }
  });

  return (
    <ul>
      {props.items.map((item) => (
        <li
          key={item.id}
          ref={(element) => {
            const resizeObserver = getResizeObserver();
            if (element) {
              refItemMap.current.set(item.id, element);
              resizeObserver.observe(element);
            } else {
              element = refItemMap.current.get(item.id);
              refItemMap.current.delete(item.id);
              resizeObserver.unobserve(element);
            }
          }}
        >
          {item.text}
        </li>
      ))}
    </ul>
  );
};
```

## FAQ (or questions I think might come up)

### `"ResizeObserver loop limit exceeded"` errors

These errors are often benign, but they can be annoying if you have `window.onerror` handlers.
Before you ignore these errors, you should try to implement your layout to be top-down.
This would avoid the loop limit errors because [nodes that are at or above a previously processed depth wouldn't have resize events](https://github.com/WICG/resize-observer/issues/7).

If your layout can't be top-down or requires 2 passes to stabilize, you can either filter these errors out or try the following pattern to avoid them:

```jsx
import { useObserveResize } from "use-observe-resize";

const Example = () => {
  const observeResize = useObserveResize((entry, resizeObserver) => {
    // use entry to make state updates, etc.
    // ...

    // unobserve this element until the next animation frame
    resizeObserver.unobserve(entry.target);
    requestAnimationFrame(() => {
      // it should be okay to re-observe at this point to avoid loop limit errors
      resizeObserver.observe(entry.target);
    });
  });

  return <div ref={observeResize} />;
};
```

[callback ref]: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
[resizeobserverentry]: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry
[resizeobserver]: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
