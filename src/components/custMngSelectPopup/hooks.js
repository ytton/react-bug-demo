import { useRef, useState } from 'react';

/**
 * 提供一个可以重置数据为上次锁定数据的state
 * @param {T|(any)=>T} initialValue
 */
export function useRestState(initialValue) {
  let resetValue = useRef(typeof initialValue === 'function' ? initialValue() : initialValue);
  const [d, setD] = useState(initialValue);
  const lockRestValue = () => {
    resetValue.current = d;
  };
  const reset = () => {
    setD(resetValue.current);
  };
  return [d, setD, reset, lockRestValue];
}
