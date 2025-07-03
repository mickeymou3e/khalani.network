import { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={72}
    height={72}
    viewBox="0 0 72 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M45 67.758C58.851 63.84 69 51.105 69 36 69 18.277 55.03 3.818 37.5 3.033V40.5H45v12h6v3h-6v12.258ZM34.5 3.033V43.5H42v24.956A33.189 33.189 0 0 1 36 69C17.775 69 3 54.225 3 36 3 18.277 16.97 3.818 34.5 3.033ZM36 72c19.882 0 36-16.118 36-36S55.882 0 36 0 0 16.118 0 36s16.118 36 36 36Zm15-52.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-33 6h6v21h-6v-21Zm-3-3h4.5v-6h3v6H27v27h-4.5v6h-3v-6H15v-27Z"
      fill="currentColor"
      fillOpacity={0.2}
    />
  </svg>
);

export default SvgComponent;
