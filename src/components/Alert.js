import React, { useContext, useMemo, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import AlertContext from "../context/AlertContext";
import "./Alert.css";

const comicWords = ["POW!", "BAM!", "ZAP!", "WOW!", "SMASH!", "BOOM!", "BLAM!"];

function Alert() {
  const { alert } = useContext(AlertContext);
  const [alertRoot, setAlertRoot] = useState(null);

  const comicWord = useMemo(() => {
    return alert?.type === "success"
      ? comicWords[Math.floor(Math.random() * comicWords.length)]
      : null;
  }, [alert]);

  useEffect(() => {
    const el = document.getElementById("alert-root");
    if (el) setAlertRoot(el);
  }, []);

  if (!alert || !alertRoot) return null;

  return ReactDOM.createPortal(
    <div
      className={`mybox ${alert.type}`}
      data-burst={alert.type === "success" ? comicWord : ""}
    >
      <span className="message">{alert.message}</span>
    </div>,
    alertRoot
  );
}

export default Alert;
