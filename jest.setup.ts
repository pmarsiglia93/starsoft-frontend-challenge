import "@testing-library/jest-dom";
import React from "react";

// ✅ Next/Image: mock como <img> e remove props que geram warning no DOM (fill/priority)
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, priority, sizes, ...rest } = props;
    // fill/priority/sizes são props específicas do NextImage e não devem ir pro DOM
    return React.createElement("img", rest);
  },
}));

// ✅ Next/Link como <a>
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) => {
    return React.createElement("a", { href, ...rest }, children);
  },
}));
