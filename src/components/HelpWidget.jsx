import React, { useState, useEffect } from 'react';
import './HelpWidget.css';

const HelpWidget = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let timer;
    if (open) {
      timer = setTimeout(() => setOpen(false), 5000); // ⏱ auto-close after 5s
    }
    return () => clearTimeout(timer); // clean up on unmount or re-open
  }, [open]);

  return (
    <div className="help-widget">
      <button className="help-icon" onClick={() => setOpen(true)}>
        ?
      </button>

      {open && (
        <div className="help-content">  <button className="close-button" onClick={() => setOpen(false)}>✖</button>
          <p><strong>This AI Assistant only trains on your data.</strong></p>
          <p>You can ask things like:</p>
          <ul>
            <li>“Did I write anything about React?”</li>
            <li>“Show me my notes on physics.”</li>
            <li>“Or just use the tags or any words that you remember from the content”</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HelpWidget;
