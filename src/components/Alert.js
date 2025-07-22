import React, { useContext } from "react";
import AlertContext from "../context/AlertContext";
import "./Alert.css";

function Alert() {
  const { alert } = useContext(AlertContext);

  if (!alert) return null;

  return (
    <div className={`mybox ${alert.type}`}>
      <div className="mybox-content">
        <p>{alert.message}</p>
      </div>
    </div>
  );
}

export default Alert;
