import { SVGProps } from "react";

const SortAscending = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={32}
    height={32}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.62 15.5h6.76L12 18.88 8.62 15.5ZM5 14l7 7 7-7H5Zm0-4h14l-7-7-7 7Z"
      fill="currentColor"
    />
  </svg>
);

export default SortAscending;
