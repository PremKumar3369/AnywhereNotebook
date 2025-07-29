import React, { useState, useEffect } from 'react';
import './HelpWidget.css';

const HelpWidget = () => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  // Auto-close after 5s on desktop
  useEffect(() => {
    let timer;
    if (open && window.innerWidth > 480) {
      timer = setTimeout(() => handleClose(), 10000);
    }
    return () => clearTimeout(timer);
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
    setClosing(false);
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 1000); // match animation duration
  };

  return (
    <div className="help-widget">
      <button className="help-icon" onClick={handleOpen}>
        ?
      </button>

      {open && (
        <>
          <div className="help-overlay" onClick={handleClose} />
          <div className={`help-modal ${closing ? 'hinge-out' : 'fade-in'}`}>
            <button className="modal-close" onClick={handleClose}>✖</button>
            <p><strong>This AI Assistant only trains on your data.</strong></p>
            <p>You can ask things like:</p>
            <ul>
              <li>“Did I write anything about React?”</li>
              <li>“Show me my notes on physics.”</li>
              <li>“Or just use tags or words you remember.”</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default HelpWidget;
