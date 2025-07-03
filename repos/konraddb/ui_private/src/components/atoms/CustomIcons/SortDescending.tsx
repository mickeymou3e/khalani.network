import { SVGProps } from "react";

const SortDescending = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15.38 8.5H8.62L12 5.12l3.38 3.38ZM19 10l-7-7-7 7h14Zm0 4H5l7 7 7-7Z"
      fill="currentColor"
    />
  </svg>
);

export default SortDescending;
