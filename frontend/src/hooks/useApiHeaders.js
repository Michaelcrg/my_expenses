import { useEffect, useState } from "react";

const useApiHeaders = () => {
  const [headers, setHeaders] = useState({
    "Content-Type": "application/json",
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return { headers, isReady };
};

export default useApiHeaders;
