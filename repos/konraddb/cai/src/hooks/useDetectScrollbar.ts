import { useEffect, useRef, useState } from "react";

const useDetectScrollbar = () => {
  const [hasScrollbar, setHasScrollbar] = useState(false);
  const scrollbarDetectRef = useRef(null);

  useEffect(() => {
    if (!scrollbarDetectRef.current) return;

    const observer = new ResizeObserver(() => {
      const target = scrollbarDetectRef.current! as HTMLElement;
      const scrollHeight = target?.scrollHeight;
      const offsetHeight = target?.offsetHeight;

      if (!scrollHeight || !offsetHeight) return;

      setHasScrollbar(scrollHeight > offsetHeight);
    });

    observer.observe(scrollbarDetectRef.current);

    return () => {
      observer.disconnect();
    };
  }, [scrollbarDetectRef.current]);

  return {
    scrollbarDetectRef,
    hasScrollbar,
  };
};

export default useDetectScrollbar;
