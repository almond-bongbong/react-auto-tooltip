import React, { useEffect, useRef } from 'react';

function useUpdateEffect(
  effect: React.EffectCallback,
  dependencies?: React.DependencyList
) {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      effect();
    }
  }, dependencies);

  useEffect(() => {
    isMounted.current = true;
  }, []);
}

export default useUpdateEffect;
