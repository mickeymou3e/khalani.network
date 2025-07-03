import { SVGProps } from "react";

const Delete = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="32" height="32" rx="16" fill="#FF4769" fill-opacity="0.05" />
    <path
      d="M11.0003 21.8333C11.0003 22.75 11.7503 23.5 12.667 23.5H19.3337C20.2503 23.5 21.0003 22.75 21.0003 21.8333V11.8333H11.0003V21.8333ZM12.667 13.5H19.3337V21.8333H12.667V13.5ZM18.917 9.33333L18.0837 8.5H13.917L13.0837 9.33333H10.167V11H21.8337V9.33333H18.917Z"
      fill="#D10049"
    />
  </svg>
);

export default Delete;
