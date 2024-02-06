import { useState, useEffect } from "react";

function usePersistState(key, defaultValue) {
  const [initialValue] = useState(() => {
    const storedValue = sessionStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
  });

  const [state, setState] = useState(initialValue);

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default usePersistState;
