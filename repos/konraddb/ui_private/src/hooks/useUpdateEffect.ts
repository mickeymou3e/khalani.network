import type { DependencyList, EffectCallback } from "react";
import { useEffect, useRef } from "react";

const useUpdateEffect = (effect: EffectCallback, deps?: DependencyList) => {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) {
      return effect();
    }
    mounted.current = true;
  }, deps);

  useEffect(
    () => () => {
      mounted.current = false;
    },
    []
  );
};

export default useUpdateEffect;
