import "@testing-library/jest-dom";
import React from "react";

type NextImageMockProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
};

// ✅ Next/Image: mock como <img> e remove props que geram warning no DOM (fill/priority/sizes)
jest.mock("next/image", () => ({
  __esModule: true,
  default: function NextImageMock(props: NextImageMockProps) {
    const { fill, priority, sizes, ...rest } = props;
    void fill;
    void priority;
    void sizes;
    return React.createElement("img", rest);
  },
}));

type NextLinkMockProps = {
  href: string;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

// ✅ Next/Link como <a>
jest.mock("next/link", () => ({
  __esModule: true,
  default: function NextLinkMock({ href, children, ...rest }: NextLinkMockProps) {
    return React.createElement("a", { href, ...rest }, children);
  },
}));
