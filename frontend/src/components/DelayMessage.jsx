import { useEffect, useState } from "react";

export default function DelayedMessage({ show, delay = 500, children }) {
  const [showMessage, setShowMessage] = useState(false);
  useEffect(() => {
    let timeoutId;
    if (show) {
      timeoutId = setTimeout(() => {
        setShowMessage(true);
      }, delay);
    } else {
      setShowMessage(false);
    }
    return () => clearTimeout(timeoutId);
  }, [show, delay]);

  return showMessage ? <div>{children}</div> : null;
}
