import { SVGProps } from "react";

const SortNone = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15.4 8.5H8.6L12 5.1l3.4 3.4ZM19 10l-7-7-7 7h14ZM8.6 15.5h6.8L12 18.9l-3.4-3.4ZM5 14l7 7 7-7H5Z"
      fill="currentcolor"
    />
  </svg>
);

export default SortNone;
