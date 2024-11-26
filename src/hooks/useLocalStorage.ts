import { useEffect } from "react";

import { useState } from "react";

export const useLocalStorage = <T,>(key: string, initialValue: T, migrate: (value: any) => T = (value: any) => value) => {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? migrate?.(JSON.parse(stored)) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};

