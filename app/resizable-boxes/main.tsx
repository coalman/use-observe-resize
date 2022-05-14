import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ResizableBox from "../lib/ResizableBox.js";

const App = () => {
  return (
    <Fragment>
      <ResizableBox
        initWidth={300}
        initHeight={300}
        testid="box1"
        bgColor="steelblue"
      />
      <ResizableBox
        initWidth={200}
        initHeight={200}
        testid="box2"
        bgColor="red"
      />
      <ResizableBox
        initWidth={100}
        initHeight={100}
        testid="box3"
        bgColor="green"
      />
    </Fragment>
  );
};

const root = createRoot(document.getElementById("main") as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
