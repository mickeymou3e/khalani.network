"use client";
import Link from "next/link";
import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const menuItems = [
  "Overview",
  "Dashboard",
  // "Artifacts",
  // "Organizations",
  "Projects",
  "Settings",
] as const;

export default function NavBar() {
  const session = useSession();
  const user = session?.data?.user;
  const pathname = usePathname();
  const [overlayStyle, setOverlayStyle] = useState({});
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const parentRef = useRef<HTMLUListElement>(null);

  const handleMouseOver = (index: number) => {
    setOverlayVisible(true);
    const currentRef = parentRef.current?.children[index];
    const parentRect = parentRef.current?.getBoundingClientRect();

    if (currentRef && parentRect) {
      const rect = currentRef.getBoundingClientRect();
      setOverlayStyle({
        left: `${rect.left - parentRect.left}px`,
        width: `${rect.width}px`,
      });
    }
  };

  const handleMouseLeave = () => {
    setOverlayVisible(false);
  };

  return (
    <nav
      onMouseLeave={handleMouseLeave}
      className="sticky top-0 z-50 border-b-[1px] border-[#333333] bg-black pl-2"
    >
      <div className="relative">
        <ul className="item-center flex py-2 text-[#888888]" ref={parentRef}>
          {menuItems.map((item, index) => {
            const isDashboardWithUserNameInPath =
              item === "Dashboard" && pathname.includes(user?.name);
            return (
              <li
                key={item}
                onMouseOver={() => handleMouseOver(index)}
                className={
                  pathname === `/${item.toLowerCase()}` ||
                  isDashboardWithUserNameInPath
                    ? "active"
                    : ""
                }
              >
                <div className="relative z-10 rounded-sm text-sm">
                  <a
                    className="relative inline-block px-1.5 py-2  sm:px-4 "
                    href={`/${
                      item.toLowerCase() === "dashboard"
                        ? user?.name
                        : item.toLowerCase()
                    }`}
                  >
                    {item}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
        <div
          className={`absolute bottom-2.5 h-8 rounded-sm bg-[rgba(51,51,51,0.8)] transition-all duration-300 ${
            isOverlayVisible ? "opacity-100" : "opacity-0"
          }`}
          style={overlayStyle}
        ></div>
      </div>
    </nav>
  );
}
