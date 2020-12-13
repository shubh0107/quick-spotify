import { useState, useEffect } from 'react';

const useLocalStorage = (key, defaultValue = '') => {

  const [currentValue, setCurrentValue] = useState(() => {
    if (localStorage.getItem(key)) {
      return localStorage.getItem(key)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, currentValue)
  }, [key, currentValue])

  return [currentValue, setCurrentValue];
}
export default useLocalStorage;