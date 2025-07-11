import { SVGProps } from "react";

const Office = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24px"
    height="24px"
    {...props}
  >
    <path
      fill="#e64a19"
      d="M7 12L29 4 41 7 41 41 29 44 7 36 29 39 29 10 15 13 15 33 7 36z"
    />
  </svg>
);

export default Office;
