import { useEffect, useState } from "react";

export function useAutoToggle(delay: number) {
  const [bool, setBool] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setBool(true);
    }, delay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return bool;
}
