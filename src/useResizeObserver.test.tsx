import { it, expect } from "vitest";
import { Profiler, type FC } from "react";
import { render } from "@testing-library/react";
import { useResizeObserver } from "./useResizeObserver.js";

it("should not create ResizeObserver until getter is called", () => {
  let result: ReturnType<typeof useResizeObserver>;
  const TestComponent: FC = () => {
    result = useResizeObserver(() => {});
    return null;
  };

  render(<TestComponent />);
  const [getValue, ref] = result;

  expect(ref.current).toBeUndefined();
  const resizeObserver = getValue();
  expect(ref.current).toBeDefined();
  expect(getValue()).toBe(resizeObserver);
});

it("should only render once when creating ResizeObserver during render", () => {
  let result: ReturnType<typeof useResizeObserver>;
  const TestComponent: FC = () => {
    result = useResizeObserver(() => {});
    result[0]();
    return null;
  };

  let renders = 0;
  render(
    <Profiler id="profiler" onRender={() => renders++}>
      <TestComponent />
    </Profiler>
  );

  expect(result[1].current).toBeDefined();
  expect(renders).toBe(1);
});
